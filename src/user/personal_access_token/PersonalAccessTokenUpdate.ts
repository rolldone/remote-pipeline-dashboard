import TokenService, { TokenInterface } from "services/TokenService";
import PersonalAccessTokenNew, { PersonalAccessTokenNewInterface } from "./PersonalAccessTokenNew";

export interface PersonalAccessTokenUpdateInterface extends PersonalAccessTokenNewInterface {
  submitData: { (): void }
  getPersonalAccessToken: { (): void }
  setPersonalAccessToken: { (props: any): void }
}

const PersonalAccessTokenUpdate = PersonalAccessTokenNew.extend<PersonalAccessTokenUpdateInterface>({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setPersonalAccessToken(await this.getPersonalAccessToken());
      resolve();
    });
  },
  async submitData() {
    try {
      let _form_data: TokenInterface = this.get("form_data");
      let resData = await TokenService.updateToken({
        id: _form_data.id,
        name: _form_data.name,
        description: _form_data.description,
        secret_key: _form_data.secret_key,
        api_key: _form_data.api_key,
        expired_date: _form_data.expired_date,
        status: _form_data.status
      })
      alert("Updated!");
    } catch (ex) {
      console.error("submitData - ex :: ", ex);
    }
  },
  async getPersonalAccessToken() {
    try {
      let resData = await TokenService.getToken({
        id: this.req.params.id
      });
      return resData;
    } catch (ex) {
      console.error("getPersonalAccessToken - ex :: ", ex);
    }
  },
  setPersonalAccessToken(props) {
    if (props == null) return;
    this.set("form_data", props.return);
  }
});

export default PersonalAccessTokenUpdate;