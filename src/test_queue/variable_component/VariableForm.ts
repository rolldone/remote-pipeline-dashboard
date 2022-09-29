import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive, { ParsedTemplate } from "ractive";
import InputValue from "./variable/InputValue";
import template from './VariableFormView.html';

export interface VariableFormInterface extends BaseRactiveInterface {
  displayForms?: { (): void }
  renderValue?: { (index: number): ParsedTemplate }
}

const VariableForm = BaseRactive.extend<VariableFormInterface>({
  template,
  partials: {
    "input_type_partials": []
  },
  components: {
    "input-value": InputValue
  },
  data() {
    return {
      schema_datas: [],
      variable_option: null,
      variable_id: null,
      variable_item_data: []
    }
  },
  onconstruct() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      this.newOn = {
        onInputTextListener: (c, action, text, object) => {
          debugger;
        }
      }
      _super();
      resolve();
    });
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      this.displayForms();
      _super();
      resolve();
    });
  },
  async displayForms() {
    this.observe("variable_item_data", (val) => {
      console.log("observe - variable_item_data :: ", val);
    });
    let _schema_datas = this.get("schema_datas");
    let _variable_option = this.get("variable_option");
    let _variable_item_data = this.get("variable_item_data");
    let _datas = _variable_item_data.datas;
    let _input_type_partials = [];

    for (let a = 0; a < _schema_datas.length; a++) {
      for (let b = 0; b < _datas.length; b++) {
        if (_schema_datas[a].name == _datas[b].name) {
          let _template = this.renderValue(b);
          _input_type_partials.push({
            ..._template.t[0]
          });
        }
      }
    }

    for (let a = 0; a < _schema_datas.length; a++) {
      if (_datas[a] == null) {
        _datas[a] = JSON.parse(JSON.stringify(_schema_datas[a]));
        let _template = this.renderValue(a);
        _input_type_partials.push({
          ..._template.t[0]
        });
      } else {
        if (_datas[a].name == null) {
          _datas[a].name = _schema_datas[a].name;
          let _template = this.renderValue(a);
          _input_type_partials.push({
            ..._template.t[0]
          });
        } else if (_datas[a].name != _schema_datas[a].name) {
          _datas[a].name = _schema_datas[a].name;
          let _template = this.renderValue(a);
          _input_type_partials.push({
            ..._template.t[0]
          });
        } else {

        }
      }
    }

    this.set("variable_item_data", _variable_item_data);
    this.resetPartial("input_type_partials", _input_type_partials);
  },
  renderValue(index) {
    return Ractive.parse(/* html */`
      <input-value schema_data={{variable_item_data.datas[${index}]}} variable_id={{variable_id}} index={{${index}}} on-listener="setOnInputSchemaListener"></input-value>
    `);
  }
});

export default VariableForm;