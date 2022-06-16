import QueueSchedulerModalExectution, { QueueSchedulerInterface as QueueSchedulerInterfaceExecution } from "execution/modal/QueueSchedulerModal";
import QueueScheduleService from "services/QueueScheduleService";

export interface QueueSchedulerInterface extends QueueSchedulerInterfaceExecution {
  getQueueSchedule?: {
    (props?: {
      execution_id: number
      queue_record_id: number
    }): Promise<any>
  }
  setQueueSchedule?: { (props: any): void }
}

const QueueSchedulerModal = QueueSchedulerModalExectution.extend<QueueSchedulerInterface>({
  show(props) {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await _super(props);
      this.setQueueSchedule(await this.getQueueSchedule(props));
      resolve();
    });
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        let form_data = this.get("form_data");
        this.fire("listener", action, form_data, e);
        break;
    }
  },
  async getQueueSchedule(props) {
    try {
      let resData = await QueueScheduleService.getQueueSchedule({
        execution_id: props.execution_id,
        queue_record_id: props.queue_record_id
      });
      return resData;
    } catch (ex) {
      console.error("getQueueSchedule - ex :: ", ex);
    }
  },
  setQueueSchedule(props) {
    if (props == null) return;
    let resData = props.return;
    this.set("form_data", {
      ...this.get("form_data"),
      ...resData.data,
      id: resData.id,
    });
  }
});

export default QueueSchedulerModal;