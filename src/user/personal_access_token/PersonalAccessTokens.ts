import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import TokenService from "services/TokenService";
import template from './PersonalAccessTokensView.html';
import moment from 'moment';

export interface PersonalAccessTokensInterface extends BaseRactiveInterface {
  getTokens: { (): void }
  setTokens: { (props: any): void }
  getMoment: typeof moment
  submitDelete: { (id: number): Promise<boolean> }
}

const PersonalAccessTokens = BaseRactive.extend<PersonalAccessTokensInterface>({
  template,
  data() {
    return {
      token_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setTokens(await this.getTokens());
      _super();
      resolve();
    });
  },
  async handleClick(action, props, e) {
    switch (action) {
      case 'DELETE':
        e.preventDefault();
        let resDelete = await this.submitDelete(props.id);
        if (resDelete == false) return;
        this.setTokens(await this.getTokens());
        break;
    }
  },
  getMoment: moment,
  async submitDelete(id) {
    try {
      let resDelete = await TokenService.deleteTokens([id]);
      return true;
    } catch (ex) {
      console.error("submitDelete - ex :: ", ex);
      return false
    }
  },
  async getTokens() {
    try {
      let resData = await TokenService.getTokens({});
      return resData;
    } catch (ex) {
      console.error("getTokens - ex :: ", ex);
    }
  },
  setTokens(props) {
    if (props == null) return;
    this.set("token_datas", props.return);
  }
});

export default PersonalAccessTokens