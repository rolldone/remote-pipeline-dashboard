import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import SmartValidation from "base/SmartValidation";
import PipelineService from "services/PipelineService";
import ProjectService from "services/ProjectService";
import VariableService from "services/VariableService";
import Notify from "simple-notify";
import VariableGroup from "./VariableGroup";
import VariableGroup2 from "./VariableGroup2";
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
    "variable-group": VariableGroup2,
  },
  data() {
    return {
      form_data: {},
      form_error: {},
      project_datas: [],
      pipeline_datas: [],
      schema_datas: [],
      variable_groups: [],
      deleted_ids: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setProjects(await this.getProjects());
      let _smartValidation = SmartValidation("variable-form");
      _smartValidation.inputTextValidation({
        callback: (props, e) => {
          console.log(props);
          let target = $(e.target);
          let _form_error = this.get("form_error");
          switch (props.status) {
            case "error":
              _form_error = props.error;
              this.set("form_error", {
                ...this.get("form_error"),
                ..._form_error
              });
              return target.addClass("is-invalid");
            case "valid":
            case "complete":
              return target.removeClass("is-invalid");
          }
        },
        form_data: this.get("form_data"),
        element_target: "input[type=email],input[type=text],input[type=number],input[type=password]",
        form_rules: {
          name: "required",
        },
        form_attribute_name: {
        }
      })
      this.observe("schema_datas", (val) => {
        console.log("VariableNew - schema_datas :: ", val);
      })
      this.observe("variable_groups", (val) => {

      })
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
        let _smartValidation = SmartValidation("variable-form");
        _smartValidation.submitValidation({
          form_data: this.get("form_data"),
          form_attribute_name: {
            name: "Pipeline Name"
          },
          form_rules: {
            name: "required",
            pipeline_id: "required",
            project_id: "required"
          },
          callback: (props) => {
            for (var key in props.error) {
              $("#" + props.id).find(`input[name=${key}]`).addClass("is-invalid");
              $("#" + props.id).find(`select[name=${key}]`).addClass("is-invalid");
            }
            this.set("form_error", props.error);
            for (var key in props.form_data) {
              $("#" + props.id).find(`input[name=${key}]`).removeClass("is-invalid");
              $("#" + props.id).find(`select[name=${key}]`).removeClass("is-invalid");
            }
            if (props.status == "complete") {
              this.submitVariable();
            }
          }
        })
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
      resData = resData.return;
      window.variableRouter.navigate(window.variableRouter.buildUrl(`/${resData.id}/view`));
      new Notify({
        status: 'success',
        title: 'New Variable',
        text: 'Create new successfully :)',
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
    } catch (ex: any) {
      console.error("submitVariable - ex :: ", ex);
      new Notify({
        status: 'error',
        title: 'Variable Error',
        text: ex.message,
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: false,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
    }
  }
});