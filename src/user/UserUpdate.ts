import SmartValidation from "base/SmartValidation";
import UserService from "services/UserService";
import UserNew, { UserNewInterface } from "./UserNew";

export interface UserUpdateInterface extends UserNewInterface {
  getUser: { (): void }
  setUser: { (props: any): void }
}

export default UserNew.extend<UserUpdateInterface>({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setUser(await this.getUser());
      resolve();
    });
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
              if (props.form_data.password != null && props.form_data.password != "") {
                _smartValidation = SmartValidation("user-new-form");
                _smartValidation.submitValidation({
                  form_data: this.get("form_data"),
                  form_attribute_name: {},
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
                      this.submit();
                    }
                  }
                })
              } else {
                this.submit();
              }
            }
          }
        })
        return;
    }
    this._super(action, props, e);
  },
  async getUser() {
    try {
      let resData = await UserService.getUser({
        id: this.req.params.id
      });
      return resData;
    } catch (ex) {
      console.error("getUser - ex :: ", ex);
    }
  },
  setUser(props) {
    if (props == null) return;
    this.set("form_data", props.return);
  },
  async submit() {
    try {
      let _form_data = this.get("form_data");
      _form_data.data = JSON.stringify(_form_data.data || {});
      let resData = await UserService.updateUser(_form_data);
    } catch (ex) {
      console.error("submit - ex :: ", ex);
    }
  }
})