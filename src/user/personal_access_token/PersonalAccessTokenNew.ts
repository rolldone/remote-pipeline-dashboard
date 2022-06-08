import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import TokenService, { TokenInterface } from "services/TokenService";
import Notify from "simple-notify";
import template from './PersonalAccessTokenNewView.html';

export interface PersonalAccessTokenNewInterface extends BaseRactiveInterface {
  submitData: { (): void }
}

export const makeid = (length: number) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

const PersonalAccessTokenNew = BaseRactive.extend<PersonalAccessTokenNewInterface>({
  template,
  data() {
    return {
      form_data: {},
      title: "Add New Personal Access Token"
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'GENERATE_API_KEY':
        e.preventDefault();
        this.set("form_data.api_key", makeid(20));
        break;
      case 'GENERATE_SECRET_KEY':
        e.preventDefault();
        this.set("form_data.secret_key", makeid(20));
        break;
      case 'SUBMIT':
        e.preventDefault();
        this.submitData();
        break;
    }
  },
  async submitData() {
    try {
      let _form_data: TokenInterface = this.get("form_data");
      let resData = await TokenService.addToken({
        name: _form_data.name,
        description: _form_data.description,
        secret_key: _form_data.secret_key,
        api_key: _form_data.api_key,
        expired_date: _form_data.expired_date,
        status: _form_data.status
      })
      resData = resData.return;

      new Notify({
        status: "success",
        autoclose: true,
        autotimeout: 3000,
        title: "Personal Access Token " + _form_data.name,
        text: "Created!",
      });
      window.userRouter.navigate(window.userRouter.buildUrl(`/personal-access-token/${resData.id}/view`));
    } catch (ex) {
      console.error("submitData - ex :: ", ex);
    }
  }
});

export default PersonalAccessTokenNew;