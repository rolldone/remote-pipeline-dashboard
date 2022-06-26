import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import WebHookService from "services/WebHookService";
import DisplayErrorModal, { DisplayErrorModalInterface } from "./display_error_modal/DisplayErrorModal";
import template from './WebhookHistoriesView.html';

export interface WebhookHistoriesInterface extends BaseRactiveInterface {
  getHistories?: { (): void }
  setHistories?: { (props: any): void }
}

const WebhookHistories = BaseRactive.extend<WebhookHistoriesInterface>({
  template,
  components: {
    "display-error-modal": DisplayErrorModal
  },
  data() {
    return {
      history_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setHistories(await this.getHistories());
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    let _historie_datas = this.get("history_datas");
    switch (action) {
      case 'DISPLAY_ERROR':
        e.preventDefault();
        let _display_error_modal: DisplayErrorModalInterface = this.findComponent("display-error-modal");
        _display_error_modal.show(_historie_datas[props.index]);
        break;
    }
  },
  async getHistories() {
    try {
      let resDatas = await WebHookService.getHistories({
        webhook_id: this.req.params.id
      });
      return resDatas;
    } catch (ex) {
      console.error("getHistories - ex :: ", ex);
    }
  },
  setHistories(props) {
    if (props == null) return;
    this.set("history_datas", props.return);
  }
});

export default WebhookHistories;