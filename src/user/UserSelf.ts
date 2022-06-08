import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import SmartValidation from "base/SmartValidation";
import UserService, { UserServiceInterface } from "services/UserService";
import template from './UserSelfView.html';

export interface UserSelfInterface extends BaseRactiveInterface {
  getSelfUser?: { (): void }
  setSelfUser?: { (props: any): void }
  submitUpdate?: { (): void }
}

const UserSelf = BaseRactive.extend<UserSelfInterface>({
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
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setSelfUser(await this.getSelfUser());
      _super();
      resolve();
    })
  },
  handleClick(action, props, e) {
    let _form_data = this.get("form_data");
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
              if (_form_data.password != null) {
                SmartValidation("user-new-form");
                _smartValidation.submitValidation({
                  form_data: this.get("form_data"),
                  form_attribute_name: {
                    password: "Password"
                  },
                  form_rules: {
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
                      this.submitUpdate();
                    }
                  }
                })
                return;
              }
              this.submitUpdate();
            }
          }
        })
        break;
    }
  },
  async getSelfUser() {
    try {
      let resData = await UserService.getSelfUser();
      return resData;
    } catch (ex) {
      console.error("getSelfUser - ex :: ", ex);
    }
  },
  setSelfUser(props) {
    if (props == null) return;
    this.set("form_data", props.return);
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
      },
      form_attribute_name: {
      }
    })
    _smartValidation.inputPasswordValidation({
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
      element_target: "input[type=password]",
      form_rules: {
        password: "required|min:6",
      },
      form_attribute_name: {
      }
    })
  },
  async submitUpdate() {
    try {
      let _form_data: UserServiceInterface = this.get("form_data");
      let resData = await UserService.updateOwnUser({
        first_name: _form_data.first_name,
        last_name: _form_data.last_name,
        email: _form_data.email,
        password: _form_data.password,
        status: _form_data.status
      })
      debugger;
    } catch (ex) {
      console.error("submitUpdate - ex :: ", ex);
    }
  }
});

export default UserSelf;