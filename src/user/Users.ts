import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";
import UserService from "services/UserService";
import template from './UsersView.html';

export interface UsersInterface extends BaseRactiveInterface {
  getUsers?: { (): void }
  setUsers?: { (props: any): void }
  getSelfUser?: { (): void }
  setSelfUser?: { (props: any): void }
}

export default BaseRactive.extend<UsersInterface>({
  template,
  data() {
    return {
      user_datas: [],
      user_data: null
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setUsers(await this.getUsers());
      this.setSelfUser(await this.getSelfUser());
      _super();
      resolve();
    })
  },
  async getUsers() {
    try {
      let resData = await UserService.getUsers({});
      return resData;
    } catch (ex) {
      console.error("getUsers - ex :: ", ex);
    }
  },
  setUsers(props) {
    if (props == null) return;
    this.set("user_datas", props.return);
  },
  async getSelfUser() {
    try {
      let resData = await UserService.getSelfUser();
      return resData;
    } catch (ex) {
      console.error("getSelfUser - ex :: ", ex);
    }
  },
  setSelfUser(props) {
    if (props == null) return;
    this.set("user_data", props.return);
  }
});
