import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './DisplayErrorModalView.html';

export interface DisplayErrorModalInterface extends BaseRactiveInterface {
  show?: { (props: any): void }
  hide?: { (): void }
}

let myModal = null;
const DisplayErrorModal = BaseRactive.extend<DisplayErrorModalInterface>({
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {}
    }
  },
  show(props) {
    this.set("form_data", props);
    let _id_element = this.get("id_element");
    let the_element = document.getElementById(_id_element);
    myModal = new window.bootstrap.Modal(the_element, {
      keyboard: false
    });
    the_element.addEventListener("hidden.bs.modal", (event: any) => {
      // do something...
      if (event.target.id == _id_element) {
        this.hide();
      }
    });
    debugger;
    myModal.show();
  },
  hide() {

  }
});

export default DisplayErrorModal;