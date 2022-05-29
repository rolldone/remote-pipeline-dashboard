import QueueRecordDetail, { QueueRecordDetailInterface } from "queue_record/QueueRecordDetail";
import QueueRecordDetailService from "services/QueueRecordDetailService";

declare let window: Window;

export default QueueRecordDetail.extend<QueueRecordDetailInterface>({
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
        return;
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
        return;
    }
    this._super(action, props, e);
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
  async setQueueRecordDetails(props) {
    if (props == null) return;
    let _datas = props.return;
    this.set("queue_record_detail_datas", _datas);
    // By execute manual
    let _idsStatObj = {};
    for (var a = 0; a < _datas.length; a++) {
      _idsStatObj[_datas[a].id] = _datas[a].status;
    }
    this.set("ids_status", _idsStatObj);
  }
});