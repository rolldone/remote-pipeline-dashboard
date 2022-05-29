import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './DeleteInfoModalView.html';

export interface DeleteInfoModalInterface extends BaseRactiveInterface {
  show?: { (props: any): void }
  hide?: { (): void }
  submitDelete?: { (): void }
}

let myModal = null;
const DeleteInfoModal = BaseRactive.extend<DeleteInfoModalInterface>({
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {}
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'DELETE_PROJECT':
        e.preventDefault();
        
        break;
    }
  },
  show(props) {
    this.set("form_data", props);
    let _id_element = this.get("id_element");
    myModal = new window.bootstrap.Modal(document.getElementById(_id_element), {
      backdrop: 'static',
      keyboard: false
    });
    myModal.show();
  },
  hide() {
    myModal.hide();
  },
  submitDelete() {
    try {

    } catch (ex) {
      console.error("submitDelete - ex :: ", ex);
    }
  }
});

export default DeleteInfoModal;