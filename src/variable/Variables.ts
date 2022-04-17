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
  handleClick(action, props, e) {
    switch (action) {
      case 'TO_VARIABLE':
        break;
    }
  },
  async getVariables() {
    try {
      // console.log(this.req);
      let _pipeline_id = this.req.query.pipeline_id
      let resData = await VariableService.getVariables({
        pipeline_id: _pipeline_id
      });
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