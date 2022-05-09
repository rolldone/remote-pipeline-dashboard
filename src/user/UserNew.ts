import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import SmartValidation from "base/SmartValidation";
import UserService from "services/UserService";
import template from './UserNewView.html';

export interface UserNewInterface extends BaseRactiveInterface {
  submit?: { (): void }

}

export default BaseRactive.extend<UserNewInterface>({
  template,
  data() {
    return {
      status_datas: {
        1: "Active",
        2: "Deactivate"
      },
      form_data: {},
      form_error: {}
    }
  },
  oncomplete() {
    let _smartValidation = SmartValidation("user-new-form");
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
        first_name: "required",
        email: "required|email",
        password: "required|min:6",
      },
      form_attribute_name: {
      }
    })
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'STATUS_CHANGE':
        // debugger;
        break;
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        let _smartValidation = SmartValidation("user-new-form");
        _smartValidation.submitValidation({
          form_data: this.get("form_data"),
          form_attribute_name: {
            first_name: "First Name"
          },
          form_rules: {
            first_name: "required",
            email: "required|email",
            password: "required|min:6",
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
      let _form_data = this.get("form_data");
      let resData = await UserService.addUser(_form_data);
      resData = resData.return;
      window.userRouter.navigate(window.userRouter.buildUrl(`/${resData.id}/view`));
    } catch (ex) {
      console.error("submit - ex :: ", ex);
    }
  }
});