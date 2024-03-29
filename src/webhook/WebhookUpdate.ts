import WebHookService from "services/WebHookService";
import Notify from "simple-notify";
import WebhookNew, { WebhookNewInterface } from "./WebhookNew";

export interface WebhookUpdateInterface extends WebhookNewInterface {
  getWebHook?: { (): Promise<any> }
  setWebHook?: { (props: any): void }
}


const WebhookUpdate = WebhookNew.extend<WebhookUpdateInterface>({

  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await _super();
      this.setWebHook(await this.getWebHook());
      resolve();
    });
  },
  async getWebHook() {
    try {
      let resData = await WebHookService.getWebHook({
        id: this.req.params.id
      });
      return resData;
    } catch (ex) {
      console.error("getHost - ex :: ", ex);
    }
  },
  setWebHook(props) {
    if (props == null) return;
    let _form_data = props.return;
    this.set("form_data", _form_data);
    this.set("datas", _form_data.data);
    this.set("webhook_datas", _form_data.webhook_datas);
    this.observe("webhook_datas", (val) => {
      if(val == null) return
      this.submitWebHook();
    }, {
      init: false
    })
  },
  async submitWebHook() {
    try {
      let _form_data = this.get("form_data");
      let _datas = this.get("datas");
      let _webhook_datas = this.get("webhook_datas");
      _form_data.datas = _datas;
      _form_data.webhook_datas = _webhook_datas;
      let resData = await WebHookService.updateWebHook({
        id: _form_data.id,
        name: _form_data.name,
        key: _form_data.key,
        description: _form_data.description || "",
        data: _form_data.datas || {},
        webhook_datas: _form_data.webhook_datas || [],
        status: _form_data.status
      });
      new Notify({
        status: "success",
        autoclose: true,
        autotimeout: 3000,
        title: "Webhook " + _form_data.name,
        text: "Updated!",
      });
    } catch (ex) {
      console.error("submitHost - ex :: ", ex);
    }
  }
})

export default WebhookUpdate;