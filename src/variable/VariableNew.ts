import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import PipelineService from "services/PipelineService";
import ProjectService from "services/ProjectService";
import VariableService from "services/VariableService";
import VariableGroup from "./VariableGroup";
import template from './VariableNewView.html';

declare let window: Window

export interface VariableNewInterface extends BaseRactiveInterface {
  getProjects?: { (): Promise<any> }
  setProjects?: { (props: any): void }
  getPipelines?: { (project_id: number): Promise<any> }
  setPipelines?: { (props: any): void }
  submitVariable?: { (): Promise<any> }
}

export default BaseRactive.extend<VariableNewInterface>({
  template,
  components: {
    "variable-group": VariableGroup,
  },
  data() {
    return {
      form_data: {},
      project_datas: [],
      pipeline_datas: [],
      form_schemes: [],
      variable_groups: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setProjects(await this.getProjects());
      _super();
      resolve();
    })
  },
  async handleChange(action, props, e) {
    switch (action) {
      case 'PROJECT_SELECT':
        if (e.target.value == '') return;
        this.setPipelines(await this.getPipelines(e.target.value))
        break;
      case 'SUBMIT':
        e.preventDefault();
        this.submitVariable();
        break;
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        window.history.back();
        break;
      case 'SUBMIT':
        e.preventDefault();
        this.submitVariable();
        break;
    }
  },
  async getProjects() {
    try {
      let resData = await ProjectService.getProjects({});
      return resData;
    } catch (ex) {
      console.error("getProjects - ex :: ", ex);
    }
  },
  setProjects(props) {
    if (props == null) return;
    this.set("project_datas", props.return);
  },
  async getPipelines(project_id) {
    try {
      let form_data = this.get("form_data");
      let resData = await PipelineService.getPipelines({
        project_id: form_data.project_id
      });
      return resData;
    } catch (ex) {
      console.error("getPipeline - ex :: ", ex);
    }
  },
  setPipelines(props) {
    if (props == null) return;
    this.set("pipeline_datas", props.return);
  },
  async submitVariable() {
    try {
      let form_data = this.get("form_data");
      let resData = await VariableService.addVariable({
        name: form_data.name,
        description: form_data.description,
        project_id: form_data.project_id,
        pipeline_id: form_data.pipeline_id
      });
      debugger;
      resData = resData.return;
      window.variableRouter.navigate(window.variableRouter.buildUrl(`/${resData.id}/view`));
    } catch (ex) {
      console.error("submitVariable - ex :: ", ex);
    }
  }
});