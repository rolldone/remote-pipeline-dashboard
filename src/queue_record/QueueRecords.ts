import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueService from "services/core/QueueService";
import QueueRecordService, { QueueRecordInterface, QueueRecordStatus } from "services/QueueRecordService";
import template from './QueueRecordsView.html';

export interface QueueRecordsInterface extends BaseRactiveInterface {
  getQueueRecords?: { (): Promise<any> }
  setQueueRecords?: { (props: any): void }
  submitUpdateQueueRecord?: {
    (props: {
      id: number,
      status: number,
    }): Promise<any>
  }
  submitDeleteQueueRecord?: {
    (id: number): Promise<any>
  }
  getQueueIdsStatus?: { (): void }
  setQueueIdsStatus?: { (props: any) }
}

export default BaseRactive.extend<QueueRecordsInterface>({
  template,
  data() {
    return {
      queue_record_datas: [],
      ids_status: {}
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setQueueRecords(await this.getQueueRecords());
      this.setQueueIdsStatus(await this.getQueueIdsStatus());
      resolve();
    })
  },
  handleClick(action, props, e) {
    let queue_record_datas = this.get("queue_record_datas");
    switch (action) {
      case 'ADD_TO_QUEUE':
        e.preventDefault();
        queue_record_datas[props.index].status = QueueRecordStatus.READY;
        this.submitUpdateQueueRecord(queue_record_datas[props.index]);
        break;
      case 'REMOVE_TO_QUEUE':
        e.preventDefault();
        queue_record_datas[props.index].status = QueueRecordStatus.STAND_BY;
        this.submitUpdateQueueRecord(queue_record_datas[props.index]);
        break;
      case 'DELETE':
        e.preventDefault();
        this.submitDeleteQueueRecord(props.id);
        break;
    }
  },
  async getQueueRecords() {
    try {
      let resData = await QueueRecordService.getQueueRecords({
        type: "instant",
        order_by: "qrec.id DESC",
        limit: 10,
        offset: 0
      });
      return resData;
    } catch (ex) {
      console.error("getQueueRecords - ex :: ", ex);
    }
  },
  async setQueueRecords(props) {
    if (props == null) return;
    this.set("queue_record_datas", props.return);
    // Manual first
    let _idsStatObj = {};
    let _datas = props.return;
    for (var a = 0; a < _datas.length; a++) {
      _idsStatObj[_datas[a].id] = _datas[a].status;
    }
    this.set("ids_status", _idsStatObj);
  },
  async submitUpdateQueueRecord(props) {
    try {
      let resData = await QueueRecordService.updateQueueRecord({
        ...props,
        id: props.id,
        status: props.status,
        type: 'instant'
      })
      let queue_record: QueueRecordInterface = resData.return;
      // And register to the bullmq
      let formData = new FormData();
      formData.append("id", queue_record.id as any);
      formData.append("data", JSON.stringify(queue_record.data));
      formData.append("process_mode", queue_record.exe_process_mode);
      if (queue_record.exe_process_mode == "parallel") {
        formData.append("process_limit", queue_record.exe_process_limit as any);
      }
      if (queue_record.status == 0) {
        resData = await QueueService.delete(formData);
      } else {
        resData = await QueueService.create(formData);
      }
      
      this.setQueueRecords(await this.getQueueRecords());
    } catch (ex) {
      console.error("submitUpdateQueueRecord - ex :: ", ex);
    }
  },
  async submitDeleteQueueRecord(id) {
    try {
      let resData = await QueueRecordService.deleteQueueRecord([id]);
      this.setQueueRecords(await this.getQueueRecords());
    } catch (ex) {
      console.error("submitDeleteQueueRecord - ex :: ", ex);
    }
  },
  async getQueueIdsStatus() {
    try {
      let _datas = this.get("queue_record_datas");
      let _ids = [];
      for (var a = 0; a < _datas.length; a++) {
        _ids.push(_datas[a].id);
      }
      let resData = QueueRecordService.getQueueIdsStatus(_ids);
      return resData;
    } catch (ex) {
      console.error("getQueueIdsStatus - ex :: ", ex);
    }
  },
  setQueueIdsStatus(props) {
    if (props == null) return;
    let existEl = document.getElementById('queue-record-table');
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