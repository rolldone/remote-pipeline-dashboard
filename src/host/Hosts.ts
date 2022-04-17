import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import HostService from "services/HostService";
import template from './HostsView.html';

export interface HostsInterface extends BaseRactiveInterface {
  getHosts: { (): Promise<any> }
  setHosts: { (props: any): void }
}

export default BaseRactive.extend<HostsInterface>({
  template,
  data() {
    return {
      host_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setHosts(await this.getHosts());
      _super();
      resolve();
    })
  },
  async getHosts() {
    try {
      let resData = await HostService.getHosts({});
      return resData;
    } catch (ex) {
      console.error("getHosts - ex :: ", ex);
    }
  },
  setHosts(props) {
    if (props == null) return;
    this.set("host_datas", props.return);
  }
});