import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueRecordDetailService from "services/QueueRecordDetailService";
import DisplayProcessModal from "./modal/DisplayProcessModal";
import template from './QueueRecordDetailView.html';

export interface QueueRecordDetailInterface extends BaseRactiveInterface {
  getQueueRecordDetails?: { (): Promise<any> }
  setQueueRecordDetails?: { (props: any): void }
  connectWebSocket?: { (): void }
}

declare let window: Window;

export default BaseRactive.extend<QueueRecordDetailInterface>({
  components: {
    "display-process-modal": DisplayProcessModal
  },
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
      this.connectWebSocket();
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
          id: props.id
          // id: item.qrec_id,
          // data: item.qrec_data,
          // process_mode: item.exe_process_mode,
          // host_id: item.data.host_id
        })
        setTimeout(async () => {
          this.setQueueRecordDetails(await this.getQueueRecordDetails());
        }, 2000)
        break;
      case 'STOP':
        e.preventDefault();
        await QueueRecordDetailService.stopQueueDetail({
          id: props.id
          // id: item.qrec_id,
          // data: item.qrec_data,
          // process_mode: item.exe_process_mode,
          // host_id: item.data.host_id
        })
        setTimeout(async () => {
          this.setQueueRecordDetails(await this.getQueueRecordDetails());
        }, 2000)
        break;
      case 'DISPLAY_PROCESS':
        e.preventDefault();
        let displayProcessModal = this.findComponent("display-process-modal");
        displayProcessModal.show(_queue_record_detail_datas[props.index]);
        break;

    }
  },
  async getQueueRecordDetails() {
    try {
      let resData = await QueueRecordDetailService.getQueueRecordDetails({
        queue_record_id: this.req.params.id,
        order_by: "qrec_detail.id DESC",
        limit: 10,
        offset: 0
      });
      return resData;
    } catch (ex) {
      console.error("getQueueRecordDetails - ex :: ", ex);
    }
  },
  setQueueRecordDetails(props) {
    if (props == null) return;
    let _datas = props.return;
    this.set("queue_record_detail_datas", _datas);
  },
  connectWebSocket() {

  }
});