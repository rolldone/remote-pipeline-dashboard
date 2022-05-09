import BaseRactive from "base/BaseRactive";
import SmartValidation from "base/SmartValidation";
import AuthService from "services/AuthService";
import template from './LoginView.html';
import { RegisterInterface } from "./Register";

export interface LoginInterface extends RegisterInterface {

}

export default BaseRactive.extend<LoginInterface>({
  template,
  oncomplete() {
    let _smartValidation = SmartValidation("form-auth-login");
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
        email: "required|email",
        password: "required|min:6",
      },
      form_attribute_name: {
      }
    })
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        let _smartValidation = SmartValidation("form-auth-login");
        _smartValidation.submitValidation({
          form_data: this.get("form_data"),
          form_attribute_name: {
            first_name: "First Name"
          },
          form_rules: {
            email: "required|email",
            password: "required",
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
      let resData = await AuthService.loginService(formData);
      window.location.href = "/dashboard";
    } catch (ex) {
      console.error("submit - ex :: ", ex);
    }
  }
});