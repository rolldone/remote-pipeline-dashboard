import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import _ from "lodash";
import CreateWebSocket, { WebSocketCreatedInterface } from "services/CreateWebSocket";
import PipelineItemService from "services/PipelineItemService";
import PipelineTaskService from "services/PipelineTaskService";
import QueueRecordDetailService from "services/QueueRecordDetailService";
import template from './DisplayProcessModalView.html';

declare let window: Window;
var fff = null;
let _ws: WebSocketCreatedInterface = null;
export interface DisplayProcessModalInterface extends BaseRactiveInterface {
  show?: { (props: any): void }
  hide?: { (): void }
  getDisplayProcess?: { (): void }
}

const DisplayProcessModal = BaseRactive.extend<DisplayProcessModalInterface>({
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      queue_record_detail: null,
      log_array: {},
      log_socket_messages: {},
      log_status: {},
      show_process_id: null
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SHOW_PROGRESS':
        e.preventDefault();
        this.set("show_process_id", props.id);
        break;
    }
  },
  async show(props) {
    this.set("queue_record_detail", props);
    let myModalEl = document.getElementById(this.get("id_element"));
    var myModal = new window.bootstrap.Modal(myModalEl, {
      backdrop: 'static', keyboard: false
    })
    myModalEl.addEventListener('hidden.bs.modal', function (event) {
      // do something...
      if (_ws != null) {
        _ws.webSocket.close();
      }
    })
    myModal.show();
    await this.set("log_array", {});
    setTimeout(() => {
      this.getDisplayProcess();
    }, 2000)
  },
  hide() {
    var myModal = new window.bootstrap.Modal(document.getElementById(this.get("id_element")), {
      backdrop: 'static', keyboard: false
    })
    myModal.hide();
  },
  async getDisplayProcess() {
    try {
      let _queue_record_detail = this.get("queue_record_detail");

      // console.log("_queue_record_detail :: ", _queue_record_detail);
      let res_pipeline_item = await PipelineTaskService.getPipelineTasks({
        pipeline_id: _queue_record_detail.exe_pipeline_id,
        order_by: "pip_item.order_number ASC",
        pipeline_item_ids: _queue_record_detail.exe_pipeline_item_ids || []
      })

      // Create a group
      let resGroupPipeline = _(res_pipeline_item.return).groupBy("pip_item_id").map((g) => {
        return {
          name: g[0].pip_item_name,
          data: g,
          order_number: g[0].pip_item_order_number
        }
      }).value();
      console.log("resGroupPipeline : ", resGroupPipeline);
      let _reSortArr = [];

      // Sort again
      resGroupPipeline = _.sortBy(resGroupPipeline, 'order_number');

      // And save it
      await this.set("log_array", resGroupPipeline);

      // Define the action key
      for (let i = 0; i < resGroupPipeline.length; i++) {
        let _tasks = resGroupPipeline[i].data;
        for (var a = 0; a < _tasks.length; a++) {
          let gg = _tasks[a];
          let _action = "job_id_" + _queue_record_detail.job_id + "_pipeline_id_" + gg.pip_item_id + "_task_id_" + gg.id;
          gg.action = _action;
          console.log("gg.action :: ", gg.action);
        }
      }


      // And save again
      await this.set("log_array", [
        ...resGroupPipeline
      ]);

      // And try call websocket
      _ws = await CreateWebSocket("print_process_" + _queue_record_detail.id);
      let _log_socket_messages = {};
      let _log_status = {};
      let _currentActionRunning = null;
      fff = (event) => {
        for (let i = 0; i < resGroupPipeline.length; i++) {
          let _tasks = resGroupPipeline[i].data;
          for (var a = 0; a < _tasks.length; a++) {
            let gg = _tasks[a];
            let _action = gg.action;
            console.log("tttttttttttttttttt ", _action);
            if (_log_status[_action] == null) {
              _log_status[_action] = "WAITING";
              this.set("log_status", _log_status);
            }
            if (_log_socket_messages[_action] == null) {
              _log_socket_messages[_action] = [];
              this.set("log_socket_messages", {
                ...this.get("log_socket_messages"),
                [_action]: _log_socket_messages[_action]
              })
            }
            try {
              let _data = JSON.parse(event.data);

              if (_data.action == _action) {
                if (_data.data.includes("error-error") == true) {
                  _log_status[_action] = "FAILED";
                  this.set("log_status", _log_status);
                  break;
                }
                if (_data.data != "--") {
                  _log_status[_action] = "RUNNING";
                  if (_currentActionRunning != _data.action) {
                    _currentActionRunning = _data.action;
                  }
                }
                // var element = document.getElementById("modal-theboyd");
                //  var element2 = document.getElementById("modal-theboyd2");
                // element.scrollTo(0, element2.offsetHeight);
                console.log(_action + " :: " + _data.action + " :: ", _data.data);
                _log_socket_messages[_action].push(_data.data);
                this.set("log_socket_messages." + _action, _log_socket_messages[_action]);
                this.set("log_status", _log_status);

                // console.log(_data.action + " :: ", _data.data);
              }
            } catch (ex) {
              console.log("vmadfvkdfvmkdfv :: ", event.data);
              throw ex;
            }
          }
        }
        console.log("log_socket_messages :: ", this.get("log_socket_messages"));
      }
      _ws.webSocket.onmessage = fff;
      let resData = await QueueRecordDetailService.getQueueRecordDetailDisplayProcess({
        id: _queue_record_detail.id,
        key: _ws.key
      });

    } catch (ex) {
      console.error("getDisplayProcess - ex :: ", ex);
    }
  }
});

export default DisplayProcessModal;