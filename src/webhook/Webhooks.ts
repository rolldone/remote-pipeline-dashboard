import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import HostService from "services/HostService";
import WebHookService from "services/WebHookService";
import template from './WebhooksView.html';

export interface HostsInterface extends BaseRactiveInterface {
  getWebHooks: { (): Promise<any> }
  setWebHooks: { (props: any): void }
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
  }
});

export default Webhooks;