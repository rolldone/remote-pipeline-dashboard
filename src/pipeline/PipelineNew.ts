import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import PipelineItems from "pipelineitem/PipelineItems";
import Ractive from "ractive";
import { Router } from "routerjs";
import PipelineService from "services/PipelineService";
import ProjectService from "services/ProjectService";
import template from './PipelineNewView.html';

declare var window: Window;

export interface PipelineNewInterface extends BaseRactiveInterface {
  getProjectDatas?: { (): Promise<any> }
  setProjectDatas?: { (props: any): void }
  getPipeline?: { (): Promise<any> }
  setPipeline?: { (props: any): void }
}

export default BaseRactive.extend<PipelineNewInterface>({
  template,
  components: {
    "pipeline-items": PipelineItems
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setProjectDatas(await this.getProjectDatas());
      resolve();
    })
  },
  data() {
    return {
      pipeline_items: [],
      project_datas: []
    }
  },
  async getProjectDatas() {
    try {
      let resData = await ProjectService.getProjects({});
      return resData;
    } catch (ex) {
      console.error("getProjectDatas - ex :: ", ex);
    }
  },
  setProjectDatas(props) {
    if (props == null) return;
    this.set("project_datas", props.return);
  },
  async handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        let form_data = this.get("form_data");
        let resData = await PipelineService.addPipeline(form_data);
        resData = resData.return;
        window.pipelineRouter.navigate(window.pipelineRouter.buildUrl(`/${resData.id}/view`));
        break;
    }
  }
});