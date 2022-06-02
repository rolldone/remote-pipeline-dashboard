import makeid from "base/MakeID";
import QueueRecordDetailQueue, { QueueRecordDetailsInterface as QueueRecordDetailQueueInterface } from "queue_record/QueueRecordDetail";
import QueueService from "services/core/QueueService";
import { ExecutionServiceInterface } from "services/ExecutionService";
import QueueRecordDetailService from "services/QueueRecordDetailService";
import QueueRecordService, { QueueRecordInterface, QueueRecordStatus } from "services/QueueRecordService";
import template from './QueueRecordDetailView.html';

export interface QueueRecordDetailInterface extends QueueRecordDetailQueueInterface {
  insertOrUpdateQueueRecord?: { (): void }
}

const QueueRecordDetail = QueueRecordDetailQueue.extend<QueueRecordDetailInterface>({
  template,
  data() {
    return {
      form_data: {},
      execution_id: null,
      execution_data: {},
      queue_record_data: {}
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await this.insertOrUpdateQueueRecord();
      await _super();
      resolve();
    });
  },
  async getQueueRecordDetails() {
    try {
      let _queue_record_data: QueueRecordInterface = this.get("queue_record_data");
      console.log("_quvmadkfvm :: ", _queue_record_data);
      let resData = await QueueRecordDetailService.getQueueRecordDetails({
        queue_record_id: _queue_record_data.id,
        order_by: "qrec_detail.id DESC",
        limit: 10,
        offset: 0
      });
      return resData;
    } catch (ex) {
      console.error("getQueueRecordDetails - ex :: ", ex);
    }
  },
  async insertOrUpdateQueueRecord() {
    try {
      let _form_data: QueueRecordInterface = this.get("form_data");
      let _execution_data: ExecutionServiceInterface = this.get("execution_data");
      let resData = await QueueRecordService.getQueueRecords({
        execution_id: _execution_data.id,
        limit: 1,
        offset: 0,
        order_by: "qrec.id DESC"
      })
      resData = resData.return;
      let queue_record_data: QueueRecordInterface = resData[0];
      // If get null create new one
      if (queue_record_data == null) {
        _form_data.queue_key = null;
        _form_data.execution_id = _execution_data.id;
        _form_data.status = QueueRecordStatus.STAND_BY;
        _form_data.queue_key = makeid(12);
        _form_data.type = 'instant'
        resData = await QueueRecordService.addQueueRecord(_form_data);
        queue_record_data = resData.return;
      } else {
        queue_record_data.queue_key = queue_record_data.queue_key == "null" ? makeid(12) : queue_record_data.queue_key;
      }
      // Store it on queue_record_data
      await this.set("queue_record_data", queue_record_data);
      // Update and create new queue
      let resQueueRecordData = await QueueRecordService.updateQueueRecord({
        ...queue_record_data,
        id: queue_record_data.id,
        status: QueueRecordStatus.READY,
        type: 'instant'
      })
      
      let queue_record: QueueRecordInterface = resQueueRecordData.return as any;
      let formData = new FormData();

      formData.append("id", queue_record.id as any);
      formData.append("data", JSON.stringify(queue_record.data));
      formData.append("process_mode", queue_record.exe_process_mode);
      formData.append("delay", queue_record.exe_delay);

      if (queue_record.exe_process_mode == "parallel") {
        formData.append("process_limit", queue_record.exe_process_limit as any);
      }

      resData = await QueueService.create(formData);

    } catch (ex) {
      console.error("insertOrUpdateQueueRecord - ex :: ", ex);
    }
  }
});

export default QueueRecordDetail;