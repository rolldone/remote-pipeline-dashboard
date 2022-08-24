import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import HostService from "services/HostService";
import DeleteInfoModal, { DeleteInfoModalInterface } from "./delete_info_modal/DeleteInfoModal";
import template from './HostsView.html';

export interface HostsInterface extends BaseRactiveInterface {
  getHosts: { (): Promise<any> }
  setHosts: { (props: any): void }
}

export default BaseRactive.extend<HostsInterface>({
  components: {
    "delete-info-modal": DeleteInfoModal
  },
  template,
  data() {
    return {
      host_datas: []
    }
  },
  css: /* css */``,
  onconstruct() {
    this.newOn = {
      onDeleteModalInfoListener: async (c, action, text, e) => {
        switch (action) {
          case 'DELETED':
            this.setHosts(await this.getHosts());
            let _deleteModalInfo: DeleteInfoModalInterface = this.findComponent("delete-info-modal");
            _deleteModalInfo.hide();
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setHosts(await this.getHosts());
      _super();
      resolve();
    })
  },
  handleClick(action, props, e) {
    let _host_datas = this.get("host_datas");
    let _host_data = null;
    switch (action) {
      case 'DELETE':
        e.preventDefault();
        _host_data = _host_datas[props.index];
        let _deleteModalInfo: DeleteInfoModalInterface = this.findComponent("delete-info-modal");
        _deleteModalInfo.show(_host_data);
        break;
    }
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