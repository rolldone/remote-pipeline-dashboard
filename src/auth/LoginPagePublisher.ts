import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import AuthService from "services/AuthService";
import Login, { LoginInterface } from "./Login";
import template from './LoginPagePublisherView.html';

export interface LoginPagePublisherInterface extends LoginInterface {
  submitRequestPin: { (): void }
  submitGuest: { (): void }
}

const LoginPagePublisher = Login.extend<LoginPagePublisherInterface>({
  template,
  handleClick(action, props, e) {
    switch (action) {
      case 'REQUEST_PIN':
        e.preventDefault();
        this.submitRequestPin();
        return;
      case 'SUBMIT_GUEST':
        e.preventDefault();
        this.submitGuest();
        return;
    }
    return this._super(action, props, e);
  },
  async submitGuest() {
    try {
      let query = new URLSearchParams(window.location.search);
      const url = new URL(query.get("redirect"));
      let redirectVal = new URLSearchParams(url.search);
      let _form_data = this.get("form_data");
      _form_data.share_key = redirectVal.get("share_key");
      let resData = await AuthService.loginPagePublisher(_form_data);
      redirectVal.set("share_key", resData.return);
      url.search = redirectVal.toString();
      return window.location.href = url.toString();
    } catch (ex) {
      console.error("submitRequestPin - ex :: ", ex);
    }
  },
  async submitRequestPin() {
    try {
      let query = new URLSearchParams(window.location.search);
      const url = new URL(query.get("redirect"));
      let redirectVal = new URLSearchParams(url.search);
      let _form_data = this.get("form_data");
      _form_data.share_key = redirectVal.get("share_key");
      let resData = await AuthService.requestPin(_form_data.share_key, _form_data.email);
      _form_data.pin_code = resData.return;
      this.set("form_data", _form_data);
    } catch (ex) {
      console.error("submitRequestPin - ex :: ", ex);
    }
  }
});

export default LoginPagePublisher;