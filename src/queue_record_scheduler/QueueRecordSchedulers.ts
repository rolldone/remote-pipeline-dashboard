import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueRecordService from "services/QueueRecordService";
import QueueScheduleService, { QueueScheduleInterface } from "services/QueueScheduleService";
import QueueScheduleModal, { QueueSchedulerInterface } from "./modal/QueueScheduleModal";
import template from './QueueRecordSchedulersView.html';

export interface QueueRecordSchedulerInterface extends BaseRactiveInterface {
  getQueueRecords?: { (): Promise<any> }
  setQueueRecords?: { (props: any): void }
  submitUpdateQueueSchedule?: { (props: QueueScheduleInterface): void }
  submitUpdateQueueRecord?: {
    (props: {
      id: number,
      status: number,
      type: string
    }): Promise<any>
  }
  submitDeleteQueueRecord?: {
    (id: number): Promise<any>
  }
}

export default BaseRactive.extend<QueueRecordSchedulerInterface>({
  template,
  components: {
    "scheduler-modal": QueueScheduleModal
  },
  data() {
    return {
      queue_record_datas: []
    }
  },
  onconstruct() {
    this.newOn = {
      onSChedulerModalListener: (object, action, text, c) => {
        switch (action) {
          case 'SUBMIT':
            this.submitUpdateQueueSchedule({
              schedule_type: text.schedule_type,
              data: text,
              execution_id: text.execution_id,
              id: text.id,
              queue_record_id: text.queue_record_id
            })
            break;
          case 'DISPOSE':
            break;
        }
      }
    }
    this._super();

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
      case 'EDIT':
        e.preventDefault();
        let _modalQueueSchedule: QueueSchedulerInterface = this.findComponent("scheduler-modal");
        _modalQueueSchedule.show({
          queue_record_id: props.id,
          execution_id: queue_record_datas[props.index].execution_id
        });
        break;
    }
  },
  async getQueueRecords() {
    try {
      let resData = await QueueRecordService.getQueueRecords({
        type: "schedule"
      });
      return resData;
    } catch (ex) {
      console.error("getQueueRecords - ex :: ", ex);
    }
  },
  setQueueRecords(props) {
    if (props == null) return;
    this.set("queue_record_datas", props.return);
  },
  async submitUpdateQueueSchedule(props) {
    try {
      let resData = await QueueScheduleService.updateQueueSchedule(props);
      this.setQueueRecords(await this.getQueueRecords());
    } catch (ex) {
      console.error("submitUpdateQueueSchedule - ex :: ", ex);
    }
  },
  async submitUpdateQueueRecord(props) {
    try {
      debugger;
      let resData = await QueueRecordService.updateQueueRecord({
        ...props,
        id: props.id,
        status: props.status,
        type: props.type || 'schedule'
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