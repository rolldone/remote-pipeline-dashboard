import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import VariableService from "services/VariableService";
import template from './VariablesView.html';

export interface VariablesInterface extends BaseRactiveInterface {
  getVariables: { (): Promise<any> }
  setVariables: { (props: any): void }
}

export default BaseRactive.extend<VariablesInterface>({
  template,
  data() {
    return {
      variable_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setVariables(await this.getVariables());
      _super();
      resolve();
    });
  },
  async getVariables() {
    try {
      let resData = await VariableService.getVariables({});
      return resData;
    } catch (ex) {
      console.error("getVariables - ex :: ", ex);
    }
  },
  setVariables(props) {
    if (props == null) return;
    this.set("variable_datas", props.return);
  }
});