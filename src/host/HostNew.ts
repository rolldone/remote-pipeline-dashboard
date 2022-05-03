import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import HostService from "services/HostService";
import HostCollections from "./HostCollections";
import template from './HostNewView.html';

declare let window: Window;

export interface HostNewInterface extends BaseRactiveInterface {
  submitHost?: { (): void }
}

export default BaseRactive.extend<HostNewInterface>({
  template,
  components: {
    "host-collections": HostCollections
  },
  data() {
    return {
      form_data: {},
      datas: [],
      set_auth_value: {}
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
        }
      }
    }, {
      // Dont let start on first load
      init: false
    })
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        this.submitHost();
        break;
    }
  },
  async submitHost() {
    try {
      let _form_data = this.get("form_data");
      let resData = await HostService.addHost({
        name: _form_data.name,
        description: _form_data.description,
        auth_type: _form_data.auth_type,
        private_key: _form_data.private_key,
        username: _form_data.username,
        password: _form_data.password,
        // Override the value on top
        ...this.get("set_auth_value")
      });
      resData = resData.return;
      window.hostRouter.navigate(window.hostRouter.buildUrl(`/${resData.id}/view`));
    } catch (ex) {
      console.error("submitHost - ex :: ", ex);
    }
  }
});