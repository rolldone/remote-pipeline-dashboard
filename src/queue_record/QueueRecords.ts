import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueRecordService from "services/QueueRecordService";
import template from './QueueRecordsView.html';

export interface QueueRecordInterface extends BaseRactiveInterface {
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
}

export default BaseRactive.extend<QueueRecordInterface>({
  template,
  data() {
    return {
      queue_record_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setQueueRecords(await this.getQueueRecords());
      resolve();
    })
  },
  handleClick(action, props, e) {
    let queue_record_datas = this.get("queue_record_datas");
    switch (action) {
      case 'ADD_TO_QUEUE':
        e.preventDefault();
        queue_record_datas[props.index].status = 1;
        this.submitUpdateQueueRecord(queue_record_datas[props.index]);
        break;
      case 'REMOVE_TO_QUEUE':
        e.preventDefault();
        queue_record_datas[props.index].status = 0;
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
        type: "instant"
      });
      return resData;
    } catch (ex) {
      console.error("getQueueRecords - ex :: ", ex);
    }
  },
  setQueueRecords(props) {
    if (props == null) return;
    props.return.forEach(element => {
      element.data = JSON.parse(element.data);
    });
    this.set("queue_record_datas", props.return);
  },
  async submitUpdateQueueRecord(props) {
    try {
      let resData = await QueueRecordService.updateQueueRecord({
        ...props,
        id: props.id,
        status: props.status,
        type: 'instant'
      })
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
  }
});