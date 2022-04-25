import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueRecordDetailService from "services/QueueRecordDetailService";
import template from './QueueRecordSchedulerDetailView.html';

export interface QueueRecordSchedulerDetailInterface extends BaseRactiveInterface {
  getQueueRecordDetails: { (): Promise<any> }
  setQueueRecordDetails: { (props: any): void }
}

declare let window:Window;

export default BaseRactive.extend<QueueRecordSchedulerDetailInterface>({
  template,
  data() {
    return {
      queue_record_detail_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setQueueRecordDetails(await this.getQueueRecordDetails());
      resolve();
    })
  },
  async handleClick(action, props, e) {
    let _queue_record_detail_datas = this.get("queue_record_detail_datas");
    switch (action) {
      case 'RETRY':
        e.preventDefault();
        let item = _queue_record_detail_datas[props.index];
        await QueueRecordDetailService.retryQueueDetail({
          id: item.id
        })
        setTimeout(async () => {
          this.setQueueRecordDetails(await this.getQueueRecordDetails());
        }, 2000)
        break;
      case 'STOP':
        e.preventDefault();
        break;
      case 'DISPLAY_PROCESS':
        e.preventDefault();
        var myModal = new window.bootstrap.Modal(document.getElementById('modal-display-process'), {
          keyboard: false
        })
        myModal.show();
        break;

    }
  },
  async getQueueRecordDetails() {
    try {
      let resData = await QueueRecordDetailService.getQueueRecordDetails({
        queue_record_id: this.req.params.id
      });
      return resData;
    } catch (ex) {
      console.error("getQueueRecordDetails - ex :: ", ex);
    }
  },
  setQueueRecordDetails(props) {
    if (props == null) return;
    let _datas = props.return;
    _datas.forEach(element => {
      element.data = JSON.parse(element.data);
      return element;
    });
    this.set("queue_record_detail_datas", _datas);
  }
});