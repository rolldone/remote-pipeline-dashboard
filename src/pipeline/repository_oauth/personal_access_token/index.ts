import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import AuthService from "services/AuthService";
import OAuthService from "services/OAuthService";
import template from './PersonalAccessTokenView.html';

export interface PersonalAccessTokenInterface extends BaseRactiveInterface {
  getOauthUsers: { (): void }
  setOauthUsers: { (props: any): void }

  getOauthUrl: { (): void }
  setOauthUrl: { (props: any): void }

  submitNewPat: { (): void }
  submitDelete: { (index: number): void }
}


const PersonalAccessToken = BaseRactive.extend<PersonalAccessTokenInterface>({
  template,
  data() {
    return {
      repo_from: null,
      oauth_user_datas: [],
      action: null,
      form_data: {},
      select_token: null
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setOauthUsers(await this.getOauthUsers())
      _super()
      resolve();
    });
  },
  async handleClick(action, props, e) {
    let _oauth_user_data = null;
    switch (action) {
      case 'SELECT':
        e.preventDefault();
        let _select_token = this.get("select_token");
        _oauth_user_data = this.get("oauth_user_datas")[_select_token];
        this.fire("listener", action, _oauth_user_data, e);
        break;
      case 'EDIT':
        e.preventDefault();
        _oauth_user_data = this.get("oauth_user_datas")[props.index];
        this.set("form_data", _oauth_user_data);
        this.set("action", "pat");
        break;
      case 'DELETE':
        e.preventDefault();
        this.submitDelete(props.index);
        break;
      case 'BACK':
        e.preventDefault();
        this.set("action", null);
        this.setOauthUsers(await this.getOauthUsers())
        break;
      case 'SUBMIT':
        e.preventDefault();
        this.submitNewPat();
        break;
      case 'NEW_TOKEN':
        this.set("action", props.type);
        switch (props.type) {
          case 'pat':
            this.set("form_data", {});
            break;
          case 'oauth':
            this.setOauthUrl(await this.getOauthUrl());
            break;
        }
        break;
    }
  },
  async getOauthUsers() {
    try {
      let _repo_from = this.get("repo_from");
      let resDatas = await OAuthService.getOAuths({
        repo_from: _repo_from
      })
      return resDatas;
    } catch (ex) {
      console.error("getOauthUsers - ex :: ", ex);
    }
  },
  setOauthUsers(props) {
    if (props == null) return;
    this.set("oauth_user_datas", props.return);
  },
  async getOauthUrl() {
    try {
      let repo_from = this.get("repo_from");
      let resData = await AuthService.oauthGeneate({
        from_provider: repo_from,
        forward_to: window.location.origin + window.location.pathname
      });
      return resData;
    } catch (ex) {
      console.error("getOauthUrl - ex :: ", ex);
    }
  },
  setOauthUrl(props) {
    if (props == null) return;
    window.location.href = props.return;
  },
  async submitNewPat() {
    try {
      let resData = null;
      let _repo_from = this.get("repo_from");
      let _form_data = this.get("form_data");
      if (_form_data.id != null) {
        resData = await OAuthService.updateOAuth({
          id: _form_data.id,
          repo_from: _repo_from,
          access_token: _form_data.access_token,
          name: _form_data.name,
          token_type: "bearer"
        })
        this.set("action", null);
        this.setOauthUsers(await this.getOauthUsers())

        return;
      }
      resData = await OAuthService.addOAuth({
        repo_from: _repo_from,
        access_token: _form_data.access_token,
        name: _form_data.name,
        token_type: "bearer"
      })
      this.set("action", null);
      this.setOauthUsers(await this.getOauthUsers())

    } catch (ex) {
      console.error("submitNewPat - ex :: ", ex);
    }
  },
  async submitDelete(index) {
    try {
      let resData = null;
      let _oauth_user_data = this.get("oauth_user_datas")[index];
      resData = await OAuthService.deleteOAuths({
        ids: [_oauth_user_data.id]
      });
      this.set("action", null);
      this.setOauthUsers(await this.getOauthUsers())
    } catch (ex) {
      console.error("submitDelete - ex :: ", ex);
    }
  }
});

export default PersonalAccessToken;