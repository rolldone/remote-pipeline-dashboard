import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive, { ParsedTemplate } from "ractive";
import InputSchema from "./input2/InputSchema";
import InputValue from "./input2/InputValue";
import template from './VariableGroupView.html';

export interface VariableGroup2Interface extends BaseRactiveInterface {
  displaySchemas?: { (): void }
  addType?: { (): void }
  renderSchema?: { (props: any): ParsedTemplate }
  displayVariableGroups?: { (): void }
  renderValue?: { (props: any): ParsedTemplate }
}

const VariableGroup2 = BaseRactive.extend<VariableGroup2Interface>({
  template,
  components: {
    "input-schema": InputSchema,
    "input-value": InputValue
  },
  partials: {
    input_schema_partials: [],
    input_type_partials: []
  },
  data() {
    return {
      variable_id: null,
      active_tab: -1,
      schema_datas: [],
      form_schema: {},
      variable_groups: [],
      deleted_ids: []
    }
  },
  onconstruct() {
    this.newOn = {
      setOnInputSchemaListener: (c, action, text, e) => {
        switch (action) {
          case 'DELETE':
            let _schema_datas = this.get("schema_datas");
            _schema_datas.splice(text.index, 1);
            this.set("schema_datas", _schema_datas);
            this.displaySchemas();
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      this.observe("schema_datas", (val) => {
        console.log("schema_datas :: ", val);
      })
      this.displaySchemas();
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    let _variable_groups = this.get("variable_groups");
    let _deleted_ids = this.get("deleted_ids");
    switch (action) {
      case 'DELETE_TAB':
        e.preventDefault();
        this.set("active_tab", props.index);
        if (_variable_groups[props.index].id != null) {
          _deleted_ids.push(_variable_groups[props.index].id);
          this.set("deleted_ids", _deleted_ids);
        }
        _variable_groups.splice(props.index, 1);
        this.set("variable_groups", _variable_groups);
        this.set("active_tab", -1);
        this.displaySchemas();
        break;
      case 'ADD_TAB':
        e.preventDefault();
        _variable_groups.push({
          name: (Math.random() + 1).toString(36).substring(7),
          datas: [],
          is_active: true
        });
        this.set("variable_groups", _variable_groups);
        this.set("active_tab", _variable_groups.length - 1);
        this.displayVariableGroups();
        break;
      case 'SWITCH_TAB':
        e.preventDefault();
        this.set("active_tab", props.index);
        if (props.index == -1) {
          this.displaySchemas();
        } else {
          this.displayVariableGroups();
        }
        break;
      case 'ADD_MORE':
        e.preventDefault();
        this.addType();
        break;
    }
  },
  addType() {
    let _schema_datas: Array<any> = this.get("schema_datas");
    _schema_datas.push({
      type: "input-text",
      name: "name-" + (Math.random() + 1).toString(36).substring(7)
    })
    this.set("schema_datas", _schema_datas);
    let _input_schema_partials = [
      ...this.partials.input_schema_partials
    ];
    let _template = null;
    let lastIndex = _schema_datas.length - 1;
    _template = this.renderSchema(lastIndex);
    _input_schema_partials.push({
      ..._template.t[0]
    });
    this.resetPartial("input_schema_partials", _input_schema_partials);
  },
  displaySchemas() {
    let _schema_datas: Array<any> = this.get("schema_datas");
    let _input_schema_partials = [];
    for (let a = 0; a < _schema_datas.length; a++) {
      let _template = null;
      _template = this.renderSchema(a);
      _input_schema_partials.push({
        ..._template.t[0]
      });
    }
    this.resetPartial("input_schema_partials", _input_schema_partials);
    this.resetPartial("input_type_partials", []);
  },
  renderSchema(index) {
    return Ractive.parse(/* html */`
      <input-schema schema_data={{schema_datas[${index}]}} variable_id={{variable_id}} index={{${index}}} on-listener="setOnInputSchemaListener"></input-schema>
    `);
  },
  displayVariableGroups() {
    let _input_type_partials = [];
    let _schema_datas = this.get("schema_datas");
    let _variable_groups = this.get("variable_groups")
    let _active_tab = this.get("active_tab");
    let _variable_group = _variable_groups[_active_tab];
    for (let a = 0; a < _schema_datas.length; a++) {
      for (let b = 0; b < _variable_group.datas.length; b++) {
        if (_schema_datas[a].name == _variable_group.datas[b].name) {
          let _template = this.renderValue(b);
          _input_type_partials.push({
            ..._template.t[0]
          });
        }
      }
    }
    for (let a = 0; a < _schema_datas.length; a++) {
      if (_variable_group.datas[a] == null) {
        _variable_group.datas[a] = JSON.parse(JSON.stringify(_schema_datas[a]));
        let _template = this.renderValue(a);
        _input_type_partials.push({
          ..._template.t[0]
        });
      } else {
        if (
          _variable_group.datas[a].name == null ||
          _variable_group.datas[a].name != _schema_datas[a].name) {
          _variable_group.datas[a].name = _schema_datas[a].name;
          let _template = this.renderValue(a);
          _input_type_partials.push({
            ..._template.t[0]
          });
        } else {
          if (_variable_group.datas[a].type != _schema_datas[a].type) {
            _variable_group.datas[a] = JSON.parse(JSON.stringify(_schema_datas[a]));
          } else {
            _variable_group.datas[a].name = _schema_datas[a].name;
          }
          let _template = this.renderValue(a);
          _input_type_partials[a] = {
            ..._template.t[0]
          }
        }
      }
    }
    console.log("_variable_groups :: ", _variable_groups);
    console.log("_input_type_partials :: ", _input_type_partials);
    this.set("variable_groups", _variable_groups);
    this.resetPartial("input_type_partials", _input_type_partials);
    this.resetPartial("input_schema_partials", []);
  },
  renderValue(index) {
    let _active_tab = this.get("active_tab");
    return Ractive.parse(/* html */`
      <input-value schema_data={{variable_groups[${_active_tab}].datas[${index}]}} variable_id={{variable_id}} index={{${index}}} on-listener="setOnInputSchemaListener"></input-value>
    `);
  }
});

export default VariableGroup2;