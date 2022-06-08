import QueueRecords, { QueueRecordsInterface } from "queue_record/QueueRecords";
import QueueService from "services/core/QueueService";
import QueueRecordService, { QueueRecordInterface, QueueRecordStatus } from "services/QueueRecordService";
import QueueScheduleService, { QueueScheduleInterface } from "services/QueueScheduleService";
import Notify from "simple-notify";
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
        return;
      case 'REMOVE_TO_QUEUE':
        e.preventDefault();
        queue_record_datas[props.index].status = 0;
        this.submitUpdateQueueRecord(queue_record_datas[props.index]);
        return;
      case 'EDIT':
        e.preventDefault();
        let _modalQueueSchedule: QueueSchedulerInterface = this.findComponent("scheduler-modal");
        _modalQueueSchedule.show({
          queue_record_id: props.id,
          execution_id: queue_record_datas[props.index].execution_id
        });
        return;
    }
    this._super(action, props, e);
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
      // debugger;
      // let resData = await QueueRecordService.updateQueueRecord({
      //   ...props,
      //   id: props.id,
      //   status: props.status,
      //   type: props.type || 'schedule'
      // })
      // this.setQueueRecords(await this.getQueueRecords());
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
      new Notify({
        status: "success",
        autoclose: true,
        autotimeout: 3000,
        title: "Queue " + queue_record.queue_key,
        text: queue_record.status == QueueRecordStatus.READY ? "Queue Added" : "Queue Stopped",
      });
      this.setQueueRecords(await this.getQueueRecords());
    } catch (ex) {
      console.error("submitUpdateQueueRecord - ex :: ", ex);
    }
  }
});