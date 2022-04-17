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
        <a href="#" class="btn btn-red w-100" aria-label="Facebook" on-click="@this.handleClick('DELETE',{ index : index },@event)">
          <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </a>
      </div>
      <div class="col-auto">
        <switch-type on-listener="setOnSwitchTypeListener" type="{{form_scheme.type}}" index="{{index}}"></switch-type>
      </div>
      <div class="col text-truncate">
        <input type="text" class="form-control" name="name" value="{{form_scheme.name}}" placeholder="Input var name">
        <br/>
        <input type="text" class="form-control" name="value" value="{{form_data.value}}" placeholder="Input Value">
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
  oncomplete() {
    this.observe("form_data", (val) => {
    })
  },
  data() {
    return {
      form_data: {},
      index: null,
      form_scheme: {}
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'DELETE':
        e.preventDefault();
        this.fire("listener", action, props, e);
        break;
    }
  },
  handleChange(action, props, e) {
    switch (action) { }
  }
});