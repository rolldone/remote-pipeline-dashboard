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
      form_data: {
        auth_type: "parent"
      },
      set_auth_value: {},
      index: null
    }
  },
  oncomplete() {
    this.observe("form_data.auth_type", (val: string, val2: string) => {
      if (val2 == null) return;
      if (val != val2) {
        let form_data = this.get("form_data");
        switch (val) {
          case 'basic_auth':
            this.set("set_auth_value", {
              username: form_data.username,
              password: form_data.password,
              private_key: null,
              passphrase: null,
            });
            break;
          case 'private_key':
            this.set("set_auth_value", {
              username: form_data.username,
              private_key: form_data.private_key,
              passphrase: form_data.passphrase,
              password: null
            });
            break;
          case 'parent':
            this.set("set_auth_value", {
              username: null,
              private_key: null,
              passphrase: null,
              password: null
            });
            break;
        }
      }
    }, {
      // Dont let start on first load
      init: false
    })
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
        this.set("form_data", {
          ...this.get("form_data"),
          // Override the value on top
          ...this.get("set_auth_value")
        })
        this.fire("listener", action, props, e);
        break;
    }
  }
});