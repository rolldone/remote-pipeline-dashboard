import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import CredentialService from "services/CredentialService";
import Notify from "simple-notify";
import template from './CredentialsView.html';

export interface CredentialsInterface extends BaseRactiveInterface {
  getCredentials?: { (): void }
  setCredentials?: { (props: any): void }
  submitDeleteCredential?: { (id: number): void }
}

const Credentials = BaseRactive.extend<CredentialsInterface>({
  template,
  data() {
    return {
      credential_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setCredentials(await this.getCredentials());
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'DELETE':
        e.preventDefault();
        this.submitDeleteCredential(props.id);
        break;
    }
  },
  async getCredentials() {
    try {
      let resDatas = await CredentialService.getCredentials({});
      return resDatas;
    } catch (ex) {
      console.error("getCredentials - ex :: ", ex);
    }
  },
  setCredentials(props) {
    if (props == null) return;
    this.set("credential_datas", props.return);
  },
  async submitDeleteCredential(id) {
    try {
      let resData = await CredentialService.deleteCredentialByIds([id]);
      new Notify({
        status: 'success',
        title: 'Credential Deleted',
        text: 'Credential deleted successfully :)',
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
      this.setCredentials(await this.getCredentials());
    } catch (ex) {
      console.error("submitDeleteCredential - ex :: ", ex);
    }
  }
});

export default Credentials;