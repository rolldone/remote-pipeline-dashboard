import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import CreateWebSocket, { WebSocketCreatedInterface } from "services/CreateWebSocket";
import QueueRecordDetailService from "services/QueueRecordDetailService";
import template from './DisplayProcessModalView.html';

declare let window: Window;
var fff = null;
let _ws : WebSocketCreatedInterface = null;
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
      log_array: {}
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
      if(_ws != null){
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
      _ws = await CreateWebSocket("print_process_" + _queue_record_detail.id);
      let _log_array = {};
      fff = (event) => {
        for (var a = 0; a < _queue_record_detail.exe_pipeline_item_ids.length; a++) {
          let _sss = _queue_record_detail.exe_pipeline_item_ids[a];
          let _action = "job_id_" + _queue_record_detail.job_id + "_pipeline_id_" + _sss;
          if (_log_array[_action] == null) {
            _log_array[_action] = {
              label: _sss,
              data: []
            };
            this.set("log_array", {
              ...this.get("log_array"),
              [_action]: _log_array[_action]
            })
          }
          try {
            let _data = JSON.parse(event.data);
            if (_data.action == _action) {
              var element = document.getElementById("modal-theboyd");
              var element2 = document.getElementById("modal-theboyd2");
              element.scrollTo(0, element2.offsetHeight);
              _log_array[_action].data.push(_data);
              this.set("log_array." + _action + ".data", _log_array[_action].data);
              // console.log(_data.action + " :: ", _data.data);
            }

          } catch (ex) {
            console.log("vmadfvkdfvmkdfv :: ", event.data);
            throw ex;
          }
        }
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