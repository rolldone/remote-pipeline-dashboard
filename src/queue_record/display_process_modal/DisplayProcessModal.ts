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
      show_process_id: null,
      select_action: null
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SHOW_PROGRESS':
        e.preventDefault();
        if (props.id == this.get("show_process_id")) {
          this.set("show_process_id", null);
          this.set("select_action", null);
          return;
        }
        this.set("show_process_id", props.id);
        let _log_array = this.get("log_array");
        let _select_action = _log_array[props.index].data[props.index2].action;
        this.set("select_action", _select_action);
        break;
    }
  },
  async show(props) {
    this.set("queue_record_detail", props);
    let myModalEl = document.getElementById(this.get("id_element"));
    var myModal = new window.bootstrap.Modal(myModalEl, {
      backdrop: 'static', keyboard: false
    })
    let closeModal = function (event) {
      // do something...
      myModalEl.removeEventListener("hidden.bs.modal", closeModal);
      if (_ws != null) {
        _ws.webSocket.close();
      }
    };
    myModalEl.addEventListener('hidden.bs.modal', closeModal)
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
      resGroupPipeline = [
        // {
        //   name: "Init",
        //   data: [],
        //   order_number: null
        // },
        ..._.sortBy(resGroupPipeline, 'order_number')
      ];

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
      this.set("log_status", {});
      this.set("select_action", null);
      this.set("show_process_id", null);
      this.set("log_socket_messages", {});
      let _log_socket_messages = {};
      let _currentActionRunning = null;
      fff = (event) => {
        let _log_status = this.get("log_status") || {};
        let _eventData = JSON.parse(event.data)
        console.log("action :: ", _eventData.action);
        console.log("data :: ", _eventData.data);
        if (_log_socket_messages[_eventData.action] == null) {
          _log_socket_messages[_eventData.action] = [];
        }
        if (_log_status[_eventData.action] == null) {
          _log_status[_eventData.action] = "";
        }
        _log_socket_messages[_eventData.action].push(_eventData.data);
        if (_eventData.data != null) {
          if (_eventData.data.includes('error-error') == true) {
            _log_status[_eventData.action] = 'FAILED';
          } else {
            if (_eventData.data != "--") {
              _log_status[_eventData.action] = 'RUNNING';
            } else {
              _log_status[_eventData.action] = 'WAITING';
            }
          }
        }
        this.set("log_status", _log_status);
        this.set("log_socket_messages", {
          ..._log_socket_messages
        });
        // for (let i = 0; i < resGroupPipeline.length; i++) {
        //   let _tasks = resGroupPipeline[i].data;
        //   for (var a = 0; a < _tasks.length; a++) {
        //     let gg = _tasks[a];
        //     let _action = gg.action;
        //     console.log("tttttttttttttttttt ", _action);
        //     if (_log_status[_action] == null) {
        //       _log_status[_action] = "WAITING";
        //       this.set("log_status", _log_status);
        //     }
        //     if (_log_socket_messages[_action] == null) {
        //       _log_socket_messages[_action] = [];
        //       this.set("log_socket_messages", {
        //         ...this.get("log_socket_messages"),
        //         [_action]: _log_socket_messages[_action]
        //       })
        //     }
        //     try {
        //       let _data = JSON.parse(event.data);

        //       if (_data.action == _action) {
        //         if (_data.data.includes("error-error") == true) {
        //           _log_status[_action] = "FAILED";
        //           this.set("log_status", _log_status);
        //           break;
        //         }
        //         if (_data.data != "--") {
        //           _log_status[_action] = "RUNNING";
        //           if (_currentActionRunning != _data.action) {
        //             _currentActionRunning = _data.action;
        //           }
        //         }
        //         // var element = document.getElementById("modal-theboyd");
        //         //  var element2 = document.getElementById("modal-theboyd2");
        //         // element.scrollTo(0, element2.offsetHeight);
        //         console.log(_action + " :: " + _data.action + " :: ", _data.data);
        //         _log_socket_messages[_action].push(_data.data);
        //         this.set("log_socket_messages." + _action, _log_socket_messages[_action]);
        //         this.set("log_status", _log_status);

        //         // console.log(_data.action + " :: ", _data.data);
        //       }
        //     } catch (ex) {
        //       console.log("vmadfvkdfvmkdfv :: ", event.data);
        //       throw ex;
        //     }
        //   }
        // }
        // console.log("log_socket_messages :: ", this.get("log_socket_messages"));
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