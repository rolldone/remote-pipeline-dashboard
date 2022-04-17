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
      datas: []
    }
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
        description: _form_data.description
      });
      resData = resData.return;
      window.hostRouter.navigate(window.hostRouter.buildUrl(`/${resData.id}/view`));
    } catch (ex) {
      console.error("submitHost - ex :: ", ex);
    }
  }
});