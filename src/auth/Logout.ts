import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import AuthService from "services/AuthService";
import template from './LogoutView.html';

export interface LogoutInterface extends BaseRactiveInterface {
  submitLogout: { (): void }
}

export default BaseRactive.extend<LogoutInterface>({
  template,
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      this.submitLogout();
      _super();
      resolve();
    })
  },
  async submitLogout() {
    try {
      let resData = await AuthService.logoutService({});
      return resData;
    } catch (ex) {
      console.error("submitLogout - ex :: ", ex);
    }
  }
});