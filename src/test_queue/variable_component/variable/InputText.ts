import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

export interface InputTextInterface extends BaseRactiveInterface {

}

const InputText = BaseRactive.extend<InputTextInterface>({
  template: /* html */`
    <div class="col text-truncate">
      <label class="form-label">Variable Text</label>
      <input type="text" class="form-control" name="name" value="{{schema_data.name}}" placeholder="Input var name" readonly={{readonly}}>
      <br/>
      <input type="text" class="form-control" name="value" value="{{schema_data.value}}" placeholder="Input Value">
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
    let _schema_data = this.get("schema_data");
    _schema_data = {
      name: _schema_data.name,
      type: _schema_data.type,
      value: _schema_data.value,
    }
    this.set("schema_data", _schema_data);
  },
  data() {
    return {
      readonly: false,
      form_data: {},
      index: null,
      schema_data: {},
      variable_id: null
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

export default InputText;