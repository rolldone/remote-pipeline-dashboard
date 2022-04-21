import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import ExecutionService from "services/ExecutionService";
import template from './ExecutionsView.html';

export interface ExecutionsInterface extends BaseRactiveInterface {
  getExecutions?: { (): Promise<any> }
  setExecutions?: { (props: any): void }
}

export default BaseRactive.extend<ExecutionsInterface>({
  template,
  data() {
    return {
      execution_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setExecutions(await this.getExecutions());
      resolve();
    });
  },
  async getExecutions() {
    try {
      let resData = await ExecutionService.getExecutions({

      });
      return resData;
    } catch (ex) {
      console.error("getExecutions - ex :: ", ex);
    }
  },
  setExecutions(props) {
    if (props == null) return;
    this.set("execution_datas", props.return);
  }
})