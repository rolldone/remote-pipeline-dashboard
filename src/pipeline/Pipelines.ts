import BaseRactive from "base/BaseRactive";
import template from './PipeLinesView.html';
import { BrowserHistoryEngine, createRouter, Router } from "routerjs";
import PipelineService from "services/PipelineService";

declare let window: Window;

const Pipelines = BaseRactive.extend({
  getPipelines() { },
  setPipelines(props) { }
});

export default Pipelines.extend({
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
      let resData = await PipelineService.getPipelines({});
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