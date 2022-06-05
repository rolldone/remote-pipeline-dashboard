import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import makeid from "base/MakeID";
import QueueService from "services/core/QueueService";
import ExecutionService from "services/ExecutionService";
import QueueRecordService, { QueueRecordInterface } from "services/QueueRecordService";
import QueueScheduleService, { QueueScheduleInterface } from "services/QueueScheduleService";
import DeleteInfoModalExecution, { DeleteInfoModalInterface } from "./delete_info_modal/DeleteInfoModal";
import template from './ExecutionsView.html';
import QueueSchedulerModal, { QueueSchedulerInterface } from "./modal/QueueSchedulerModal";

export interface ExecutionsInterface extends BaseRactiveInterface {
  getExecutions?: { (): Promise<any> }
  setExecutions?: { (props: any): void }
  submitAddQueueRecord?: {
    (props: {
      execution_id: number,
      status: number
    }): void
  }
  submitAddQueueSchedule?: { (props: QueueScheduleInterface): void }
}

export default BaseRactive.extend<ExecutionsInterface>({
  template,
  components: {
    "scheduler-modal": QueueSchedulerModal,
    "delete-info-modal": DeleteInfoModalExecution
  },
  data() {
    return {
      execution_datas: []
    }
  },
  onconstruct() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      this.newOn = {
        onDeleteModalInfoListener: async (c, action, text, e) => {
          switch (action) {
            case 'DELETED':
              this.setExecutions(await this.getExecutions());
              let _deleteModalInfo: DeleteInfoModalInterface = this.findComponent("delete-info-modal");
              _deleteModalInfo.hide();
              break;
          }
        },
        onSchedulerModalListener: (object, action, text, c) => {
          switch (action) {
            case 'SUBMIT':
              this.submitAddQueueSchedule({
                schedule_type: text.schedule_type,
                data: text,
                execution_id: text.execution_id,
              })
              break;
            case 'DISPOSE':
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
      this.setExecutions(await this.getExecutions());
      resolve();
    });
  },
  handleClick(action, props, e) {
    let _execution_data = null;
    let _execution_datas = this.get("execution_datas");
    switch (action) {
      case 'DELETE':
        e.preventDefault();
        _execution_data = _execution_datas[props.index];
        let _deleteModalInfo: DeleteInfoModalInterface = this.findComponent("delete-info-modal");
        _deleteModalInfo.show(_execution_data);
        break;
      case 'ADD_TO_QUEUE':
        e.preventDefault();
        this.submitAddQueueRecord({
          execution_id: props.id,
          status: 0
        });
        break;
      case 'ADD_TO_QUEUE_AND_RUN_IT':
        e.preventDefault();
        this.submitAddQueueRecord({
          execution_id: props.id,
          status: 1
        });
        break;
      case 'ADD_TO_QUEUE_SCHEDULER':
        e.preventDefault();
        let queueSchedulerModal: QueueSchedulerInterface = this.findComponent("scheduler-modal");
        queueSchedulerModal.show({
          execution_id: props.id,
          status: 0
        });
        break;
    }
  },
  async getExecutions() {
    try {
      let resData = await ExecutionService.getExecutions({

      });
      return resData;
    } catch (ex) {
      console.error("getExecutions - ex :: ", ex);
    }
  },
  setExecutions(props) {
    if (props == null) return;
    this.set("execution_datas", props.return);
  },
  async submitAddQueueRecord(props) {
    try {
      let resData = await QueueRecordService.addQueueRecord({
        execution_id: props.execution_id,
        status: props.status,
        queue_key: makeid(12),
        type: 'instant'
      })

      let queue_record: QueueRecordInterface = resData.return;
      if (queue_record == null) {
        throw new Error("Queue record is null");
      }
      switch (props.status) {
        case QueueRecordService.status.READY:
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
          break;
      }
    } catch (ex) {
      console.error("submitAddQueueRecord - ex :: ", ex);
    }
  },
  async submitAddQueueSchedule(props) {
    try {
      let resData = await QueueRecordService.addQueueRecord({
        execution_id: props.execution_id,
        status: 0,
        queue_key: makeid(12),
        type: "schedule"
      })
      resData = await QueueScheduleService.addQueueSchedule({
        data: props.data,
        execution_id: props.execution_id,
        queue_record_id: resData.return.id,
        schedule_type: props.schedule_type
      })
    } catch (ex) {
      console.error("submitAddQueueSchedule - ex :: ", ex);
    }
  }
})