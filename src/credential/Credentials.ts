import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import CredentialService from "services/CredentialService";
import template from './CredentialsView.html';

export interface CredentialsInterface extends BaseRactiveInterface {
  getCredentials?: { (): void }
  setCredentials?: { (props: any): void }
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
  }
});

export default Credentials;