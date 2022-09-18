import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import CredentialService from "services/CredentialService";
import template from './FormManageProxyView.html'

export interface FormManageProxyInterface extends BaseRactiveInterface {

  getCredentials?: { (): void }
  setCredentials?: { (props: any): void }
}

const FormManageProxy = BaseRactive.extend<FormManageProxyInterface>({
  template,
  data() {
    return {
      form_select_index: null,
      form_data_origin: {},
      form_data: {},
      set_auth_value: {},
    }
  },
  onconfig() {
    this._super();
    this.set("form_data", Object.assign({}, this.get("form_data_origin")));
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
      init: true
    })
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SAVE':
        this.set("form_data", {
          ...this.get("form_data"),
          // Override the value on top
          ...this.get("set_auth_value")
        })
        this.set("form_data_origin", this.get("form_data"));
        this.fire("listener", "SAVE", props, e);
        break;
      case 'CANCEL':
        this.set("form_data", {});
        this.fire("listener", "CANCEL", props, e);
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
  },
});

export default FormManageProxy;