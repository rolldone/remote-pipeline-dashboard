import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueService from "test_queue/services/core/QueueService";
import PipelineTaskService from "test_queue/services/PipelineTaskService";
import template from './DisplayResponseView.html';
import _ from 'lodash';
import CreateWebSocket, { WebSocketCreatedInterface } from "test_queue/services/CreateWebSocket";
import QueueRecordDetailService, { QueueRecordDetailInterface } from "test_queue/services/QueueRecordDetailService";
import GuestService from "test_queue/services/GuestService";

declare let window: Window;
var fff = null;
let _ws: WebSocketCreatedInterface = null;

export interface DisplayResponseInterface extends BaseRactiveInterface {
  submitQueueData?: { (): void }
  listenQueueProcess?: { (): void }
  getDisplayProcess?: { (): void }
}

const DisplayResponse = BaseRactive.extend<DisplayResponseInterface>({
  template,
  data() {
    return {
      form_data: {},
      log_array: {},
      log_socket_messages: {},
      log_status: {},
      queue_record: {},
      queue_record_detail: {},
      show_process_id: null,
      select_action: null
    }
  },
  oncomplete() {
    this._super();
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'FINISH':
        e.preventDefault();
        this.fire("listener", 'NEXT', 1, null)
        break;
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
      case 'SUBMIT_QUEUE':
        e.preventDefault();
        this.submitQueueData();
        break;
    }
  },
  async submitQueueData() {
    try {
      let _form_data = this.get("form_data");
      let props = {
        data: _form_data.data,
        delay: _form_data.delay,
        process_limit: _form_data.process_limit || null,
        process_mode: _form_data.process_mode
      }
      let resData = await QueueService.createByExistKey(_form_data.queue_key, props);
      console.log("resData :: ", resData);
      resData = resData.return;
      let _queue_record = resData.queue_record;
      let _queue_record_details = resData.queue_record_details[0];
      this.set("queue_record_detail", _queue_record_details);
      this.set("queue_record", _queue_record);
      await this.getDisplayProcess();
    } catch (ex) {
      console.error("submitQueueData - ex :: ", ex);
    }
  },
  listenQueueProcess() {

  },
  async getDisplayProcess() {
    try {
      let _queue_record_detail = this.get("queue_record_detail");

      // console.log("_queue_record_detail :: ", _queue_record_detail);
      let res_pipeline_item = await GuestService.getPipelineTasks(_queue_record_detail.token_guest, {
        order_by: "pip_item.order_number ASC",
      })

      // Create a group
      let resGroupPipeline = _(res_pipeline_item.return).groupBy("pip_item_id").map((g) => {
        return {
          name: g[0].pip_item_name,
          data: g,
          order_number: g[0].pip_item_order_number
        }
      }).value();

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
      }
      _ws.webSocket.onmessage = fff;
      let resData = await GuestService.getQueueRecordDetailDisplayProcess(_queue_record_detail.token_guest, {
        key: _ws.key
      });

    } catch (ex) {
      console.error("getDisplayProcess - ex :: ", ex);
    }
  }
});

export default DisplayResponse;