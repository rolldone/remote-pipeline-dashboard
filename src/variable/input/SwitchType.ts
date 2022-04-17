import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

export default BaseRactive.extend<BaseRactiveInterface>({
  template:/* html */`
    <select type="text" class="form-select tomselected ts-hidden-accessible" value="{{type}}" placeholder="Select a type" on-change="@this.handleChange('SWITCH_VARIABLE_TYPE',{},@event)">
      {{#variable_types:key}}
      <option value="{{key}}">{{variable_types[key].label}}</option>
      {{/variable_types}}
    </select>
  `,
  data() {
    return {
      type: "input-text",
      index: null,
      variable_types: {
        "input-text": {
          label: "Input text",
        },
        "input-script": {
          label: "Input script"
        },
        "input-asset": {
          label: "Input asset"
        }
      }
    }
  },
  oncomplete(){
    this.observe("type",(val)=>{
    })
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'SWITCH_VARIABLE_TYPE':
        this.fire("listener", action, {
          type: e.target.value,
          index: this.get("index")
        }, e);
        break;
    }
  }
});