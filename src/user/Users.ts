import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";
import UserService from "services/UserService";
import template from './UsersView.html';

export interface UsersInterface extends BaseRactiveInterface {
  getUsers?: { (): void }
  setUsers?: { (props: any): void }
}

export default BaseRactive.extend<UsersInterface>({
  template,
  data() {
    return {
      user_datas: []
    }
  },
  onconfig() {

  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setUsers(await this.getUsers());
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
  }
});
