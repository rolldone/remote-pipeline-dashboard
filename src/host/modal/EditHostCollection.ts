import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './EditHostCollectionView.html';

declare let window: Window

export interface EditHostCollectionInterface extends BaseRactiveInterface {
  show: { (): void }
  hide: { (): void }

}

export default BaseRactive.extend<EditHostCollectionInterface>({
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {},
      index: null
    }
  },
  oncomplete() {

  },
  show() {
    let _id_element = this.get("id_element");
    var myModal = new window.bootstrap.Modal(document.getElementById(_id_element), {
      keyboard: false
    });
    // myModal.addEventListener('shown.bs.modal', function () {
    //   // myInput.focus()
    // });
    myModal.show();
  },
  hide() {
    let _id_element = this.get("id_element");
    var myModal = new window.bootstrap.Modal(document.getElementById(_id_element), {
      keyboard: false
    });
    // myModal.addEventListener('shown.bs.modal', function () {
    //   // myInput.focus()
    // });
    myModal.hide();
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        this.fire("listener", action, props, e);
        break;
    }
  }
});