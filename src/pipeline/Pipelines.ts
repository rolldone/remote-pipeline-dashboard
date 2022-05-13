import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './PipeLinesView.html';
import { BrowserHistoryEngine, createRouter, Router } from "routerjs";
import PipelineService from "services/PipelineService";
import Ractive from "ractive";

declare let window: Window;

export interface PipelinesInterface extends BaseRactiveInterface {
  getPipelines: { (): Promise<any> }
  setPipelines: { (props: any): void }
}

export default BaseRactive.extend<PipelinesInterface>({
  template,
  data() {
    return {
      pipeline_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setPipelines(await this.getPipelines())
      resolve();
    });
  },
  async getPipelines() {
    try {
      let project_id = this.req.query.project_id;
      let resData = await PipelineService.getPipelines({
        project_id
      });
      return resData;
    } catch (ex) {
      console.log("getPipelines - ex :: ", ex);
    }
  },
  setPipelines(props) {
    if (props == null) return;
    this.set("pipeline_datas", props.return);
  }
});