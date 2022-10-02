import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueRecordDetailService, { QueueRecordDetailInterface } from "services/QueueRecordDetailService";
import QueueRecordService, { QueueRecordStatus } from "services/QueueRecordService";
import DisplayProcessModal, { DisplayProcessModalInterface } from "./display_process_modal/DisplayProcessModal";
import GenerateUrlDisplayModal, { GenerateUrlDisplayModalInterface } from "./generate_url_display_modal/GenerateUrlDisplayModal";
import template from './QueueRecordDetailView.html';

export interface QueueRecordDetailsInterface extends BaseRactiveInterface {
  getQueueRecordDetails?: { (): Promise<any> }
  setQueueRecordDetails?: { (props: any): void }
  getQueueIdsStatus?: { (): void }
  setQueueIdsStatus?: { (props: any) }
  displayDataModal?: { (id: number): void }
}

declare let window: Window;

export default BaseRactive.extend<QueueRecordDetailsInterface>({
  components: {
    "display-process-modal": DisplayProcessModal,
    "generate-url-display-modal": GenerateUrlDisplayModal
  },
  template,
  data() {
    return {
      queue_record_detail_datas: [],
      ids_status: [],
      check_ids: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setQueueRecordDetails(await this.getQueueRecordDetails());
      this.setQueueIdsStatus(await this.getQueueIdsStatus());
      resolve();
    })
  },
  handleChange(action, props, e) {
    let _check_ids = this.get("check_ids");
    switch (action) {
      case 'SELECT_QUEUE_HEAD':
        e.preventDefault();
        let _checkItems = document.getElementsByClassName("check-item");
        for (var i = 0; i < _checkItems.length; i++) {
          let _ii = _checkItems[i] as any;
          if (e.target.checked != _ii.checked) {
            _ii.click();
          }
        }
        break;
      case 'SELECT_QUEUE_ITEM':
        e.preventDefault();
        _check_ids[props.id] = e.target.checked;
        this.set("check_ids", _check_ids);
        break;
    }
  },
  async handleClick(action, props, e) {
    let _queue_record_detail_datas = this.get("queue_record_detail_datas");
    let _check_ids = this.get("check_ids");
    let resData = null;
    let _ids = [];
    let item: QueueRecordDetailInterface = null;
    switch (action) {
      case 'DELETES':
        e.preventDefault();
        for (var i in _check_ids) {
          if (_check_ids[i] == true) {
            _ids.push(i);
          }
        }
        resData = await QueueRecordDetailService.deleteQueueDetails(_ids);
        this.setQueueRecordDetails(await this.getQueueRecordDetails());
        break;
      case 'STOPS':
        e.preventDefault();
        for (var i in _check_ids) {
          if (_check_ids[i] == true) {
            this.handleClick('STOP', {
              id: i
            }, e);
          }
        }
        this.set("check_ids", {});
        break;
      case 'RETRIES':
        e.preventDefault();
        for (var i in _check_ids) {
          if (_check_ids[i] == true) {
            this.handleClick('RETRY', {
              id: i
            }, e);
          }
        }
        this.set("check_ids", {});
        break;
      case 'DISPLAY_DATA':
        e.preventDefault();
        this.displayDataModal(props.id);
        break;
      case 'RETRY':
        e.preventDefault();
        item = _queue_record_detail_datas[props.index];
        resData = await QueueRecordService.updateQueueRecord({
          id: this.req.params.id,
          status: QueueRecordStatus.READY,
        })
        resData = await QueueRecordDetailService.retryQueueDetail({
          id: props.id
          // id: item.qrec_id,
          // data: item.qrec_data,
          // process_mode: item.exe_process_mode,
          // host_id: item.data.host_id
        })
        setTimeout(async () => {
          this.setQueueRecordDetails(await this.getQueueRecordDetails());
        }, 2000)
        break;
      case 'STOP':
        e.preventDefault();
        await QueueRecordDetailService.stopQueueDetail({
          id: props.id
          // id: item.qrec_id,
          // data: item.qrec_data,
          // process_mode: item.exe_process_mode,
          // host_id: item.data.host_id
        })
        setTimeout(async () => {
          this.setQueueRecordDetails(await this.getQueueRecordDetails());
        }, 2000)
        break;
      case 'DISPLAY_PROCESS':
        e.preventDefault();
        let displayProcessModal: DisplayProcessModalInterface = this.findComponent("display-process-modal");
        displayProcessModal.show(_queue_record_detail_datas[props.index]);
        break;

    }
  },
  displayDataModal(id) {
    try {
      let generateUrlDisplayModal: GenerateUrlDisplayModalInterface = this.findComponent("generate-url-display-modal");
      generateUrlDisplayModal.show(id);
    } catch (ex) {
      console.error("displayDataModal :: ", ex);
    }
  },
  async getQueueRecordDetails() {
    try {
      let resData = await QueueRecordDetailService.getQueueRecordDetails({
        queue_record_id: this.req.params.id,
        order_by: "qrec_detail.id DESC",
        limit: 10,
        offset: 0
      });
      return resData;
    } catch (ex) {
      console.error("getQueueRecordDetails - ex :: ", ex);
    }
  },
  async setQueueRecordDetails(props) {
    if (props == null) return;
    let _datas = props.return;
    this.set("queue_record_detail_datas", _datas);
    // By execute manual
    let _idsStatObj = {};
    for (var a = 0; a < _datas.length; a++) {
      _idsStatObj[_datas[a].id] = _datas[a].status;
    }
    this.set("ids_status", _idsStatObj);
  },
  async getQueueIdsStatus() {
    try {
      let _datas = this.get("queue_record_detail_datas");
      let _ids = [];
      for (var a = 0; a < _datas.length; a++) {
        _ids.push(_datas[a].id);
      }
      let resData = QueueRecordDetailService.getQueueIdsStatus(_ids);
      return resData;
    } catch (ex) {
      console.error("getQueueIdsStatus - ex :: ", ex);
    }
  },
  setQueueIdsStatus(props) {
    if (props == null) return;
    let existEl = document.getElementById('queue-record-details-table');
    if (existEl == null) return;
    let _datas = props.return;
    let _idsStatObj = {};
    for (var a = 0; a < _datas.length; a++) {
      _idsStatObj[_datas[a].id] = _datas[a].status;
    }
    this.set("ids_status", _idsStatObj);
    setTimeout(async () => {
      this.setQueueIdsStatus(await this.getQueueIdsStatus());
    }, 15000);
  }
});