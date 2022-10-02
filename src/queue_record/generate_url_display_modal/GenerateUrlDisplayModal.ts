import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueRecordDetailService from "services/QueueRecordDetailService";
import template from './GenerateUrlDisplayModalView.html';

export interface GenerateUrlDisplayModalInterface extends BaseRactiveInterface {
  show?: { (queue_record_detail_id: number): void }
  hide?: { (): void }
  submitGenerateUrl?: { (): void }
}

let myModal = null;
const GenerateUrlDisplayModal = BaseRactive.extend<GenerateUrlDisplayModalInterface>({
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {},
      query_record_detail_data: {},
      queue_record_detail_id: null
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'COPY':
        e.preventDefault();
        // Cari cara copy
        break;
    }
  },
  show(queue_record_detail_id) {
    this.set("queue_record_detail_id", queue_record_detail_id);
    /* this.set("queue_data", props); */
    let myModalEl = document.getElementById(this.get("id_element"));
    myModal = new window.bootstrap.Modal(myModalEl, {
      backdrop: 'static', keyboard: false
    })
    myModalEl.addEventListener('hidden.bs.modal', function (event) {
      // do something...
    })
    myModal.show();
    this.submitGenerateUrl();
  },
  hide() {
    myModal.hide();
  },
  async submitGenerateUrl() {
    try {
      let resData = await QueueRecordDetailService.generateUrlDisplay(this.get("queue_record_detail_id"));
      this.set("query_record_detail_data", resData.return);
    } catch (ex) {
      console.error("submitGenerateUrl - ex :: ", ex);
    }
  }
});

export default GenerateUrlDisplayModal;