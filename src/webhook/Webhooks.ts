import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import HostService from "services/HostService";
import WebHookService from "services/WebHookService";
import Notify from "simple-notify";
import template from './WebhooksView.html';

export interface HostsInterface extends BaseRactiveInterface {
  getWebHooks: { (): Promise<any> }
  setWebHooks: { (props: any): void }
  submitDelete: { (index: number): void }
}

const Webhooks = BaseRactive.extend<HostsInterface>({
  template,
  data() {
    return {
      webhook_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setWebHooks(await this.getWebHooks());
      _super();
      resolve();
    })
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'DELETE':
        e.preventDefault();
        this.submitDelete(props.index);
        break;
    }
  },
  async getWebHooks() {
    try {
      let resData = await WebHookService.getWebHooks({});
      return resData;
    } catch (ex) {
      console.error("getHosts - ex :: ", ex);
    }
  },
  setWebHooks(props) {
    if (props == null) return;
    this.set("webhook_datas", props.return);
  },
  async submitDelete(index) {
    try {
      let webhook_data = this.get("webhook_datas")[index];
      let resData = await WebHookService.deleteWebHooks([webhook_data.id]);
      new Notify({
        status: "success",
        autoclose: true,
        autotimeout: 3000,
        title: "Webhook " + webhook_data.name,
        text: "Deleted!",
      });
      this.setWebHooks(await this.getWebHooks());
    } catch (ex) {
      console.error("submitDelete - ex :: ", ex);
    }
  }
});

export default Webhooks;