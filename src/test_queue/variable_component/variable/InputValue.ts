import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './InputValueView.html';
import InputScript from "./InputScript";
import InputText from "./InputText";
import SwitchType from "./SwitchType";
import InputAsset2 from "./InputAsset2";

export interface InputValueInterface extends BaseRactiveInterface {
  displayPartial?: { (): void }
}

const InputValue = BaseRactive.extend<InputValueInterface>({
  template,
  components: {
    "input-text": InputText,
    "input-asset": InputAsset2,
    "input-script": InputScript,
    "switch-type": SwitchType
  },
  partials: {
    input_partials: []
  },
  data() {
    return {
      schema_data: {},
      index: 0,
      variable_id: null
    }
  },
  onconstruct() {
    this.newOn = {
      setOnSwitchTypeListener: (c, action, text, e) => {
        switch (action) {
          case 'SWITCH_VARIABLE_TYPE':
            this.set("schema_data.type", text.type);
            this.displayPartial();
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    this.displayPartial();
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'DELETE':
        e.preventDefault();
        let _index = this.get("index");
        this.fire("listener", "DELETE", {
          index: _index
        }, e);
        break;
    }
  },
  displayPartial() {
    let _input_partial = [];
    let _schema_data = this.get("schema_data");
    this.resetPartial("input_partials",/* html */`
      <fieldset class="form-fieldset">
        <${_schema_data.type} readonly={{true}} schema_data={{schema_data}} form_data={{schema_data}} variable_id={{variable_id}}></${_schema_data.type}>
      </fieldset>
    `)
  }
});

export default InputValue;