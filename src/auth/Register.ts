import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import SmartValidation from "base/SmartValidation";
import AuthService from "services/AuthService";
import template from './RegisterView.html';

export interface RegisterInterface extends BaseRactiveInterface {
  submit?: { (): void }
  registerExpiredCheck?: { (): void }
}

export default BaseRactive.extend<RegisterInterface>({
  template,
  data() {
    return {
      form_data: {},
      form_error: {},
      form_blocked: false
    }
  },
  onconfig() {
    return new Promise(async (resolve: Function) => {
      let resData = await this.registerExpiredCheck() as any;
      if (resData.return == "expired") {
        this.set("form_blocked", true);
      }
      resolve();
    })
  },
  oncomplete() {
    let _smartValidation = SmartValidation("main-auth-form");
    _smartValidation.inputTextValidation({
      callback: (props, e) => {
        console.log(props);
        let target = $(e.target);
        let _form_error = this.get("form_error");
        switch (props.status) {
          case "error":
            _form_error = props.error;
            this.set("form_error", _form_error);
            return target.addClass("is-invalid");
          case "valid":
          case "complete":
            return target.removeClass("is-invalid");
        }
      },
      form_data: this.get("form_data"),
      element_target: "input[type=email],input[type=text],input[type=number],input[type=password]",
      form_rules: {
        first_name: "required",
        email: "required|email",
        password: "required|min:6",
      },
      form_attribute_name: {
        first_name: "First Name"
      }
    })
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'TERM_POLICY':
        this.set("form_data." + e.target.name, $(e.target).is(":checked") == false ? null : "on");

        break;
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        let _smartValidation = SmartValidation("main-auth-form");
        _smartValidation.submitValidation({
          form_data: this.get("form_data"),
          form_attribute_name: {
            first_name: "First Name"
          },
          form_rules: {
            first_name: "required",
            email: "required|email",
            password: "required|min:6",
            term_policy: "required"
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
      let formData = new FormData();
      for (var key in form_data) {
        formData.append(key, form_data[key]);
      }
      let resData = await AuthService.registerService(formData);
      window.router.navigate(window.router.buildUrl(`/login`));
    } catch (ex) {
      console.error("submit - ex :: ", ex);
    }
  },
  async registerExpiredCheck() {
    try {
      let resData = await AuthService.registerExpiredCheck();
      return resData;
    } catch (ex) {
      console.error("registerExpiredCheck - ex :: ", ex);
    }
  }
});