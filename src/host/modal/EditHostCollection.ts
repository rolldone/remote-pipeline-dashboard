import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import CredentialService from "services/CredentialService";
import template from './EditHostCollectionView.html';

declare let window: Window

export interface EditHostCollectionInterface extends BaseRactiveInterface {
  show: { (): void }
  hide: { (): void }
  getCredentials?: { (): void }
  setCredentials?: { (props: any): void }

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
      index: null,
      credential_datas: []
    }
  },
  oncomplete() {
    this.observe("form_data.auth_type", async (val: string, val2: string) => {
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
              password: null,
              credential_id: null
            });
            break;
          case 'credential':
            this.setCredentials(await this.getCredentials());
            this.set("set_auth_value", {
              private_key: null,
              passphrase: null,
              password: null,
              username: form_data.username,
              credential_id: form_data.credential_id
            });
            break;
        }
        this.set("form_data", {
          ...this.get("form_data"),
          // Override the value on top
          ...this.get("set_auth_value")
        })
      }
    }, {
      // Dont let start on first load
      init: false
    })
  },
  async show() {
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
        let index = this.get("index");
        this.fire("listener", action, {
          index: index,
          form_data: this.get("form_data")
        }, e);
        break;
    }
  },
  async getCredentials() {
    try {
      let resDatas = await CredentialService.getCredentials({
        types: ["certificate", "password"]
      });
      return resDatas;
    } catch (ex) {
      console.error("getCredential - ex :: ", ex);
    }
  },
  setCredentials(props: any) {
    if (props == null) return;
    this.set("credential_datas", props.return);
  }
});