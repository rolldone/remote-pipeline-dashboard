import QueueRecordDetail, { QueueRecordDetailInterface } from "queue_record/QueueRecordDetail";
import QueueRecordDetailService from "services/QueueRecordDetailService";

declare let window: Window;

export default QueueRecordDetail.extend<QueueRecordDetailInterface>({
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
        queue_record_id: this.req.params.id,
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
  }
});