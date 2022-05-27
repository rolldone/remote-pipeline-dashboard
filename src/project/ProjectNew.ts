import SmartValidation from "base/SmartValidation";
import ProjectService from "services/ProjectService";
import BaseRactive, { BaseRactiveInterface } from "../base/BaseRactive";
import template from './ProjectNewView.html';

declare var window: Window;

export interface ProjectNewInterface extends BaseRactiveInterface {
  submit?: { (): Promise<any> }
  getProject?: { (): Promise<any> }
  setProject?: { (props?: any): void }
}

export default BaseRactive.extend<ProjectNewInterface>({
  template: template,
  data() {
    return {
      form_data: {},
      form_error: {}
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      _super();
      let _smartValidation = SmartValidation("project-form");
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
      resolve();
    });
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        let _smartValidation = SmartValidation("project-form");
        _smartValidation.submitValidation({
          form_data: this.get("form_data"),
          form_attribute_name: {
            name: "Project Name"
          },
          form_rules: {
            name: "required",
          },
          callback: (props) => {
            for (var key in props.error) {
              $("#" + props.id).find(`input[name=${key}]`).addClass("is-invalid");
            }
            this.set("form_error", props.error);
            for (var key in props.form_data) {
              $("#" + props.id).find(`input[name=${key}]`).removeClass("is-invalid");
            }
            if (props.status == "complete") {
              this.submit();
            }
          }
        })
        break;
    }
  },
  async submit() {
    try {
      let form_data = this.get("form_data");
      let resData = await ProjectService.addProject(form_data);
      resData = resData.return as any;
      window.projectRouter.navigate(window.projectRouter.buildUrl(`/${resData.id}/view`));
    } catch (ex) {
      console.error('submit - ex :: ', ex);
    }
  }
});