import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import SwitchType from "./SwitchType";

export interface InputTextInterface extends BaseRactiveInterface {
  testo?: any
}

export default BaseRactive.extend<InputTextInterface>({
  components: {
    "switch-type": SwitchType
  },
  template: /* html */`
    <div class="row align-items-top">
      <div class="col-auto">
        <input type="checkbox" class="form-check-input">
      </div>
      <div class="col-auto">
        <switch-type on-listener="setOnSwitchTypeListener" type="{{form_data.type}}" index="{{index}}"></switch-type>
      </div>
      <div class="col text-truncate">
        <input type="text" class="form-control" name="example-text-input" placeholder="Input var name">
        <br/>
        <input type="text" class="form-control" name="example-text-input" placeholder="Input Value">
      </div>
    </div>
  `,
  onconstruct() {
    this.newOn = {
      setOnSwitchTypeListener: (c, action, text, object) => {
        switch (action) {
          case 'SWITCH_VARIABLE_TYPE':
            this.fire("listener", action, text, object);
            break;
        }
      }
    }
    this._super();
  },
  data() {
    return {
      form_data: {},
      index: null
    }
  },
  handleChange(action, props, e) {
    switch (action) { }
  }
});