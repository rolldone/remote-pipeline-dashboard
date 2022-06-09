import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive, { ParsedTemplate } from "ractive";
import { ExecutionServiceInterface } from "services/ExecutionService";
import QueueRecordDetail from "./QueueRecordDetail";
import template from './QueueRecordDetailModalView.html';

export interface QueueRecordDetailModalInterface extends BaseRactiveInterface {
  show?: { (props: ExecutionServiceInterface): void }
  hide?: { (): void }
  displayQueueRecordDetailPartial?: { (): void }
  renderQueueRecordPartial?: { (props: ExecutionServiceInterface): ParsedTemplate }
}

let myModal = null;
const QueueRecordDetailModal = BaseRactive.extend<QueueRecordDetailModalInterface>({
  partials: {
    queue_record_detail_partial: []
  },
  components: {
    "queue-record-detail": QueueRecordDetail
  },
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      execution_data: {}
    }
  },
  show(props) {
    this.set("execution_data", props);
    let _id_element = this.get("id_element");
    var _trrr = document.getElementById(_id_element);
    myModal = new window.bootstrap.Modal(_trrr, {
      backdrop: 'static',
      keyboard: false
    });
    _trrr.addEventListener('hidden.bs.modal', (event: any) => {
      // do something...
      if (event.target.id == _id_element) {
        this.hide();
      }
    });
    myModal.show();
    this.displayQueueRecordDetailPartial();
  },
  hide() {
    myModal.hide();
    this.resetPartial("queue_record_detail_partial", []);
  },
  displayQueueRecordDetailPartial() {
    let _execution_data: ExecutionServiceInterface = this.get("execution_data");
    let _queue_record_detail_partial = [];
    let _template = this.renderQueueRecordPartial(_execution_data);
    _queue_record_detail_partial.push({
      ..._template.t[0]
    });
    this.resetPartial("queue_record_detail_partial", _queue_record_detail_partial);
  },
  renderQueueRecordPartial(props) {
    return Ractive.parse(/* html */`
      <queue-record-detail execution_data={{execution_data}}></queue-record-detail>
    `);
  }
});

export default QueueRecordDetailModal;