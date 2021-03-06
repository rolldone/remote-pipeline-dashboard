import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './WebhookNewView.html';
import WebHookDataCollections from "./WebHookDataCollections";
import WebHookService from '../services/WebHookService';
import makeid from "base/MakeID";
import Notify from "simple-notify";

declare let window: Window;

export interface WebhookNewInterface extends BaseRactiveInterface {
  submitWebHook?: { (): void }
}

const WebhookNew = BaseRactive.extend<WebhookNewInterface>({
  components: {
    "webhook-data-collections": WebHookDataCollections
  },
  template,
  data() {
    return {
      form_data: {},
      datas: {},
      webhook_datas: [],
      set_auth_value: {}
    }
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
      new Notify({
        status: "success",
        autoclose: true,
        autotimeout: 3000,
        title: "Webhook " + _form_data.name,
        text: "Created!",
      });
      setTimeout(()=>{
        window.webhookRouter.navigate(window.webhookRouter.buildUrl(`/${resData.id}/view`));
      },1000);
    } catch (ex) {
      console.error("submitWebHook - ex :: ", ex);
    }
  }
});

export default WebhookNew;