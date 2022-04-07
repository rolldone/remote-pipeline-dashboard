import BaseRactive from "base/BaseRactive";
import PipelineItems from "pipelineitem/PipelineItems";
import { Router } from "routerjs";
import PipelineService from "services/PipelineService";
import ProjectService from "services/ProjectService";
import template from './PipelineNewView.html';

declare var window: Window;
const PipelineNew = BaseRactive.extend({
  getProjectDatas() { },
  setProjectDatas(props) { }
});

export default PipelineNew.extend({
  template,
  components: {
    "pipeline-items": PipelineItems
  },
  data() {
    return {
      form_data: {},
      pipelines_items: [],
      project_datas: []
    }
  },
  onconfig() {

  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setProjectDatas(await this.getProjectDatas());
    })
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
  }
});