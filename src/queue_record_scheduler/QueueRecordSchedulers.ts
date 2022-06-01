import QueueRecords, { QueueRecordsInterface } from "queue_record/QueueRecords";
import QueueRecordService from "services/QueueRecordService";
import QueueScheduleService, { QueueScheduleInterface } from "services/QueueScheduleService";
import QueueScheduleModal, { QueueSchedulerInterface } from "./modal/QueueScheduleModal";
import template from './QueueRecordSchedulersView.html';

export interface QueueRecordSchedulerInterface extends Omit<QueueRecordsInterface, 'submitUpdateQueueRecord'> {
  submitUpdateQueueSchedule?: { (props: QueueScheduleInterface): void }
  submitUpdateQueueRecord?: {
    (props: {
      id: number,
      status: number,
      type: string
    }): Promise<any>
  }
}

export default QueueRecords.extend<QueueRecordSchedulerInterface>({
  template,
  components: {
    "scheduler-modal": QueueScheduleModal
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
    // Manual first
    let _idsStatObj = {};
    let _datas = props.return;
    for (var a = 0; a < _datas.length; a++) {
      _idsStatObj[_datas[a].id] = _datas[a].status;
    }
    this.set("ids_status", _idsStatObj);
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