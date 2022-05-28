import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import SmartValidation from "base/SmartValidation";
import HostService from "services/HostService";
import HostCollections from "./HostCollections";
import template from './HostNewView.html';

declare let window: Window;

export interface HostNewInterface extends BaseRactiveInterface {
  submitHost?: { (): void }
}

export default BaseRactive.extend<HostNewInterface>({
  template,
  components: {
    "host-collections": HostCollections
  },
  data() {
    return {
      form_data: {},
      form_error: {},
      datas: [],
      set_auth_value: {}
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      this.observe("form_data.auth_type", (val: string, val2: string) => {
        if (val2 == null) return;
        if (val != val2) {
          let form_data = this.get("form_data");
          switch (val) {
            case 'basic_auth':
              this.set("set_auth_value", {
                username: form_data.username,
                password: form_data.password,
                private_key: null,
                passphrase: null,
              });
              break;
            case 'private_key':
              this.set("set_auth_value", {
                username: form_data.username,
                private_key: form_data.private_key,
                passphrase: form_data.passphrase,
                password: null
              });
              break;
          }
        }
      }, {
        // Dont let start on first load
        init: false
      })
      // Define validation
      let _smartValidation = SmartValidation("host-form");
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
          name: "required"
        },
        form_attribute_name: {
        }
      })
      _super();
      resolve();
    })
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        let _smartValidation = SmartValidation("host-form");
        _smartValidation.submitValidation({
          form_data: this.get("form_data"),
          form_attribute_name: {
            name: "Pipeline Name"
          },
          form_rules: {
            name: "required",
            auth_type: "required"
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
              this.submitHost();
            }
          }
        })
        break;
    }
  },
  async submitHost() {
    try {
      let _form_data = this.get("form_data");
      let resData = await HostService.addHost({
        name: _form_data.name,
        description: _form_data.description,
        auth_type: _form_data.auth_type,
        private_key: _form_data.private_key,
        username: _form_data.username,
        password: _form_data.password,
        // Override the value on top
        ...this.get("set_auth_value")
      });
      resData = resData.return;
      window.hostRouter.navigate(window.hostRouter.buildUrl(`/${resData.id}/view`));
    } catch (ex) {
      console.error("submitHost - ex :: ", ex);
    }
  }
});