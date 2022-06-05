import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueService from "services/core/QueueService";
import QueueRecordService, { QueueRecordInterface, QueueRecordStatus } from "services/QueueRecordService";
import DeleteInfoModal, { DeleteInfoModalInterface } from "./delete_info_modal/DeleteInfoModal";
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
  copyClipBoard?: { (props: any): void }
}

export default BaseRactive.extend<QueueRecordsInterface>({
  template,
  components: {
    "delete-info-modal": DeleteInfoModal
  },
  data() {
    return {
      queue_record_datas: [],
      ids_status: {}
    }
  },
  onconstruct() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      this.newOn = {
        onDeleteModalInfoListener: async (c, action, text, e) => {
          switch (action) {
            case 'DELETED':
              this.setQueueRecords(await this.getQueueRecords());
              let _deleteModalInfo: DeleteInfoModalInterface = this.findComponent("delete-info-modal");
              _deleteModalInfo.hide();
              break;
          }
        }
      }
      _super();
      resolve();
    });
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
    let queue_record_data = null;
    switch (action) {
      case 'COPY_LINK':
        e.preventDefault();
        let _urlQueueKey = window.location.origin + "/xhr/outside/queue/" + queue_record_datas[props.index].queue_key;
        if (typeof (navigator.clipboard) == 'undefined') {
          alert("Copied this link: " + _urlQueueKey);
          return;
        }
        navigator.clipboard.writeText(_urlQueueKey);
        alert("Copied the text: " + _urlQueueKey);
        break;
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
        queue_record_data = queue_record_datas[props.index];
        let _deleteModalInfo: DeleteInfoModalInterface = this.findComponent("delete-info-modal");
        _deleteModalInfo.show(queue_record_data);
        // this.submitDeleteQueueRecord(props.id);
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
      // And register to the bullmq
      let queue_record: QueueRecordInterface = props;
      let formData = new FormData();

      formData.append("id", queue_record.id as any);
      formData.append("data", JSON.stringify(queue_record.data));
      formData.append("process_mode", queue_record.exe_process_mode);
      formData.append("delay", queue_record.exe_delay);

      if (queue_record.exe_process_mode == "parallel") {
        formData.append("process_limit", queue_record.exe_process_limit as any);
      }

      let resData = null;

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
      let resData = await QueueRecordService.deleteQueueRecord({
        ids: [id],
        force_deleted: true
      });
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