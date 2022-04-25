import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import ExecutionService from "services/ExecutionService";
import QueueRecordService from "services/QueueRecordService";
import QueueScheduleService, { QueueScheduleInterface } from "services/QueueScheduleService";
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
    "scheduler-modal": QueueSchedulerModal
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
    switch (action) {
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
        queue_key: null
      })
      debugger;
    } catch (ex) {
      console.error("submitAddQueueRecord - ex :: ", ex);
    }
  },
  async submitAddQueueSchedule(props) {
    try {
      let resData = await QueueRecordService.addQueueRecord({
        execution_id: props.execution_id,
        status: 0,
        queue_key: null,
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