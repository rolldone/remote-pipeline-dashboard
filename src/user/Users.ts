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
  onconfig() {

  },
  async getUsers() {
    try {
      let resData = await UserService.getUsers({});
    } catch (ex) {
      console.error("getUsers - ex :: ", ex);
    }
  },
  setUsers(props) {
    if (props == null) return;
  }
});
