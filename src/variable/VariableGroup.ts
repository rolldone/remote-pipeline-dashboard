import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { assign, cloneDeep, keys, pick } from "lodash";
import Ractive from "ractive";
import InputAsset from "./input/InputAsset";
import InputScript from "./input/InputScript";
import InputText from "./input/InputText";
import './style.scss';

export interface VariableGroupInterface extends BaseRactiveInterface {
  calibrateVariableGroups: { (index: number): void }
  newTypeInput: { (index: number): any }
  changeTypeInput: { (props: any): any }
  refreshVariableGroups: { (): void }
}

declare let window: Window;

export default BaseRactive.extend<VariableGroupInterface>({
  components: {
    "input-text": InputText,
    "input-asset": InputAsset,
    "input-script": InputScript
  },
  template: /* html */ `
    <div class="row row-cards">
      <div class="col-md-12">
        <div class="card">
          <ul class="nav nav-tabs" data-bs-toggle="tabs">
            {{#each variable_groups:i}}
            <li class="nav-item">
              {{#if i>0}}
              <a href="#tabs-home-{{i}}" class="nav-link {{active_tab == i?'active':''}}" data-bs-toggle="tab" on-click="@this.handleClick('SWITCH_TAB',{ index : i },@event)">
                <svg xmlns="http://www.w3.org/2000/svg" on-click="@this.handleClick('DELETE_TAB',{ index : i },@event)" style="color: red; font-size: 0.5em;" class="icon icon-tabler icon-tabler-x"
                  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span contenteditable="true" value="{{name}}">
                  {{name}}
                <span>
              </a>
              {{else}}
              <a href="#tabs-home-{{i}}" class="nav-link {{active_tab == i?'active':''}}" data-bs-toggle="tab" on-click="@this.handleClick('SWITCH_TAB',{ index : i },@event)">
                <span contenteditable="true" value="{{name}}">
                  {{name}}
                <span>
              </a>
              {{/if}}
            </li>
            {{/each}}
            <li class="nav-item-button">
              <a href="#tabs-settings-10" class="nav-link-button" title="Settings" data-bs-toggle="tab" on-click="@this.handleClick('ADD_TAB',{},@event)"><!-- Download SVG icon from http://tabler-icons.io/i/settings -->
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <circle cx="12" cy="12" r="9"></circle>
                  <line x1="9" y1="12" x2="15" y2="12"></line>
                  <line x1="12" y1="9" x2="12" y2="15"></line>
                </svg>
              </a>
            </li>
          </ul>
          <div class="card-body" style="padding:0;">
            <div class="tab-content">
              {{#each variable_groups:i}}
              <div class="tab-pane {{ active_tab == i ? 'active' : '' }}" id="tabs-home-{{i}}">
                <div>
                  <div class="list-group list-group-flush">
                    {{>input_type_partials}}
                  </div>
                </div>
              </div>
              {{/each}}
            </div>
          </div>
          {{#if variable_groups.length > 0}}
          <div class="card-footer">
            <div class="row align-items-center">
              <div class="col">Learn more about <a href="#">Project ID</a></div>
              <div class="col-auto">
                <a href="#" class="btn btn-primary" on-click="@this.handleClick('ADD_MORE',{},@event)">
                  Add More
                </a>
              </div>
            </div>
          </div>
          {{/if}}
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      variable: {},
      variable_groups: [],
      active_tab: 0,
      form_schemes: [],
      req: null,
    }
  },
  partials: {
    input_type_partials: []
  },
  onconstruct() {
    this.newOn = {
      onInputTextListener: (c, action, text, object) => {
        let _form_schemes = this.get("form_schemes");
        let _variable_groups = this.get("variable_groups");
        let _active_tab = this.get("active_tab");
        switch (action) {
          case 'SWITCH_VARIABLE_TYPE':
            this.changeTypeInput(text);
            break;
          case 'DELETE':
            // Delete real and scheme
            for (var a = 0; a < _variable_groups.length; a++) {
              _variable_groups[a].datas.splice(text.index, 1);
            }
            _form_schemes.splice(text.index, 1);
            // Save again
            setTimeout(async () => {
              await this.set("variable_groups", _variable_groups);
              await this.set("form_schemes", _form_schemes);
              this.refreshVariableGroups();
            }, 100);
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    this.observe("variable_groups[*].datas[*].name", (val, val2, path) => {
      console.log(val, val2, path);
    })
    this._super();
    let _form_schemes = this.get("form_schemes");
    if (_form_schemes.length > 0) {
      this.handleClick("SWITCH_TAB", { index: 0 }, { preventDefault: () => { } })
    }
  },
  newTypeInput(index) {
    return {
      type: "input-text",
      element: /* html */`<input-text form_scheme="{{form_schemes[${index}]}}" form_data="{{datas[${index}]}}" index="${index}" on-listener="onInputTextListener"></input-text>`,
      is_active: true
    }
  },
  changeTypeInput(props) {
    let _components = this.components;
    let _active_tab = this.get("active_tab");
    let _variable_groups = this.get("variable_groups");
    let _datas = _variable_groups[_active_tab].datas;
    let _props_type = props.type;
    let _props_index = props.index;
    if (_components[_props_type] != null) {
      // debugger;
      _datas[_props_index] = {
        type: _props_type,
        element: /* html */`<${_props_type} form_scheme="{{form_schemes[${_props_index}]}}" form_data="{{datas[${_props_index}]}}" index="${_props_index}" on-listener="onInputTextListener"></${_props_type}>`,
        is_active: true
      }
      this.set("variable_groups", _variable_groups);
      this.calibrateVariableGroups(_active_tab);
    } else {
      alert("The Component is not found or not initialized!");
    }
  },
  refreshVariableGroups() {
    let _active_tab = this.get("active_tab");
    let _form_schemes = this.get("form_schemes");
    let _variable_groups = this.get("variable_groups");
    // Must override the new array again for get effetct
    // But for now the skenario is reset it
    let _input_type_partials = [
      // ...this.partials.input_type_partials as Array<any>
    ];
    let _ractiveView = null;
    // debugger;
    let _variable_scheme = _variable_groups[_active_tab];
    if (_variable_scheme.datas.length > 0) {
      for (let a = 0; a < _variable_scheme.datas.length; a++) {
        let _datas = cloneDeep(_variable_groups[_active_tab].datas[a]);
        _datas.element = /* html */ `<${_datas.type} form_scheme="{{form_schemes[${a}]}}" form_data="{{datas[${a}]}}" index="${a}" on-listener="onInputTextListener"></${_datas.type}>`
        _ractiveView = Ractive.parse(/* html */`
          <div class='list-group-item' index='${a}'>
            ${_datas.element}
          </div>
        `);
        _input_type_partials.push({
          ..._ractiveView.t[0]
        })
      }
      this.resetPartial("input_type_partials", _input_type_partials);
    } else {
      this.resetPartial("input_type_partials", []);
      this.handleClick('ADD_MORE', {}, {
        preventDefault: () => { }
      })
    }
    console.log(this.get("form_schemes"))
    console.log(this.get("variable_groups"))
  },
  calibrateVariableGroups(index) {
    let _datas = [];
    let _form_schemes = this.get("form_schemes");
    let _variable_groups = this.get("variable_groups");
    let _variable_group = _variable_groups[index];
    // Must override the new array again for get effetct
    // But for now the skenario is reset it
    let _input_type_partials = [
      // ...this.partials.input_type_partials as Array<any>
    ];
    let _ractiveView = null;
    // debugger;
    let _variable_scheme = _variable_groups[0];
    if (_variable_scheme.datas.length > 0) {
      _datas = _variable_group.datas;
      for (let a = 0; a < _variable_scheme.datas.length; a++) {
        if (_datas[a] != null && _datas[a].element != null && _datas[a].type == _variable_scheme.datas[a].type) {
          _datas[a].element = /* html */ `<${_datas[a].type} form_scheme="{{form_schemes[${a}]}}" form_data="{{datas[${a}]}}" index="${a}" on-listener="onInputTextListener"></${_datas[a].type}>`
        } else {
          _datas[a] = cloneDeep(_variable_scheme.datas[a]);
          // _.assign(obj1, _.pick(obj2, _.keys(obj1)));
          // cloneDeep(_variable_scheme.datas[a]);
          // debugger;
        }
        _ractiveView = Ractive.parse(/* html */`
          <div class='list-group-item' index='${a}'>
            ${_datas[a].element}
          </div>
        `);

        _input_type_partials.push({
          ..._ractiveView.t[0]
        })
      }
    } else {
      // Create for scheme first
      _form_schemes.push({});

      _datas = _variable_group.datas;
      _datas.push(this.newTypeInput(0));
      _ractiveView = Ractive.parse(/* html */`
          <div class='list-group-item' index='0'>
            ${_datas[0].element}
          </div>
        `);
      _input_type_partials.push({
        ..._ractiveView.t[0]
      })
    }
    this.set("variable_groups", _variable_groups);
    this.set("form_schemes", _form_schemes);
    this.resetPartial("input_type_partials", _input_type_partials);
  },
  handleClick(action, props, e) {
    let _index = null;
    let _variable_group = null;
    let _variable_groups = this.get("variable_groups");
    let _datas = [];
    switch (action) {
      case 'DELETE_TAB':
        e.preventDefault();
        _variable_groups.splice(props.index, 1);
        this.set("variable_groups", _variable_groups);
        break;
      case 'SWITCH_TAB':
        this.set("active_tab", props.index);
        this.calibrateVariableGroups(props.index);
        break;
      case 'ADD_TAB':
        e.preventDefault();
        _variable_groups.push({
          name: "var-mode-"+(_variable_groups.length),
          datas: [],
          is_active: true
        });
        this.set("variable_groups", _variable_groups);
        this.set("active_tab", _variable_groups.length - 1);
        // debugger;
        this.calibrateVariableGroups(_variable_groups.length - 1);
        break;
      case 'ADD_MORE':
        e.preventDefault();
        _variable_group = _variable_groups[0];
        _datas = _variable_group.datas;
        let _next_index = (_datas.length - 1) + 1;
        _datas.push(this.newTypeInput(_next_index));
        this.set("variable_groups", _variable_groups);
        this.calibrateVariableGroups(0);
        break;
    }
  }
})