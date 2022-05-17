import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import PushServiceCollection from "./PushServiceCollections";
import template from './WebhookNewView.html';
import WebHookService from '../services/WebHookService';

declare let window: Window;

export interface WebhookNewInterface extends BaseRactiveInterface {
  submitWebHook?: { (): void }
}

const makeid = (length: number) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

const WebhookNew = BaseRactive.extend<WebhookNewInterface>({
  template,
  components: {
    "push-service-collections": PushServiceCollection
  },
  data() {
    return {
      form_data: {},
      datas: {},
      webhook_datas: [],
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
      case 'GENERATE_KEY':
        e.preventDefault();
        this.set("form_data.key", makeid(20));
        break;
      case 'SUBMIT':
        e.preventDefault();
        this.submitWebHook();
        break;
    }
  },
  async submitWebHook() {
    try {
      let _form_data = this.get("form_data");
      let resData = await WebHookService.addWebHook({
        name: _form_data.name,
        key: _form_data.key,
        description: _form_data.description,
        status: _form_data.status,
        webhook_datas: [],
        data: {}
      });
      resData = resData.return;
      window.webhookRouter.navigate(window.webhookRouter.buildUrl(`/${resData.id}/view`));
    } catch (ex) {
      console.error("submitWebHook - ex :: ", ex);
    }
  }
});

export default WebhookNew;