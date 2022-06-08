import HostService from "services/HostService";
import Notify from "simple-notify";
import HostNew, { HostNewInterface } from "./HostNew";

export interface HostUpdateInterface extends HostNewInterface {
  getHost?: { (): Promise<any> }
  setHost?: { (props: any): void }
}

export default HostNew.extend<HostUpdateInterface>({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await _super();
      this.setHost(await this.getHost());
      resolve();
    });
  },
  async getHost() {
    try {
      let resData = await HostService.getHost({
        id: this.req.params.id
      });
      return resData;
    } catch (ex) {
      console.error("getHost - ex :: ", ex);
    }
  },
  setHost(props) {
    if (props == null) return;
    let _form_data = props.return;
    this.set("form_data", _form_data);
    this.set("datas", _form_data.data);
  },
  async submitHost() {
    try {
      let _form_data = this.get("form_data");
      let _datas = this.get("datas");
      _form_data.datas = _datas;
      let resData = await HostService.updateHost({
        id: _form_data.id,
        name: _form_data.name,
        description: _form_data.description,
        data: JSON.stringify(_form_data.datas),
        auth_type: _form_data.auth_type,
        private_key: _form_data.private_key,
        username: _form_data.username,
        password: _form_data.password,
        // Override the value on top
        ...this.get("set_auth_value")
      });
      new Notify({
        status: 'success',
        title: 'Update Host',
        text: 'Update new successfully :)',
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
    } catch (ex: any) {
      console.error("submitHost - ex :: ", ex);
      new Notify({
        status: 'error',
        title: 'Host Error',
        text: ex.message,
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: false,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
    }
  }
})