import { BaseRactiveInterface } from "base/BaseRactive";
import CredentialService from "services/CredentialService";
import Notify from "simple-notify";
import CredentialNew, { CredentialNewInterface } from "./CredentialNew";

export interface CredentialUpdateInterface extends CredentialNewInterface {
  getCredential: { (): void }
  setCredential: { (props: any): void }
}

const CredentialUpdate = CredentialNew.extend<CredentialUpdateInterface>({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setCredential(await this.getCredential());
      _super();
      resolve();
    });
  },
  async getCredential() {
    try {
      let resData = await CredentialService.getCredential({
        id: this.req.params.id
      })
      return resData;
    } catch (ex) {
      console.error("getCredential - ex :: ", ex);
    }
  },
  setCredential(props) {
    if (props == null) return;
    this.set("form_data", props.return);
    this.set("form_data_data", props.return.data || {});
  },
  async submit() {
    try {
      let _form_data_data = this.get("form_data_data");
      let _form_data = this.get("form_data");
      for (var key in _form_data.data) {
        switch (true) {
          case _form_data.data[key] == null:
          case _form_data.data[key] == "":
            delete _form_data.data[key];
            break;
        }
      }
      switch (_form_data.type) {
        case 'secret_text':
          _form_data.data = {
            secret_text: _form_data_data.secret_text
          }
          break;
        case 'username_password':
          _form_data.data = {
            username: _form_data_data.username,
            password: _form_data_data.password
          }
          break;
        case 'secret_file':
          _form_data.data = {
            secret_file: _form_data_data.secret_file
          }
          break;
        case 'certificate':
          _form_data.data = {
            certificate: _form_data_data.certificate,
            passphrase: _form_data_data.passphrase
          }
          break;
        case 'docker_certificate':
          _form_data.data = {}
          break;
      }
      let resData = await CredentialService.updateCredential(_form_data);
      resData = resData.return;
      new Notify({
        status: 'success',
        title: 'Update Credential',
        text: 'Update successfully :)',
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
    } catch (ex) {
      console.error("submit - ex :: ", ex);
    }
  }
});

export default CredentialUpdate;