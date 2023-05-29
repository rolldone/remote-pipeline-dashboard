import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";
import template from './ConditionalCommandView.html';
import Tags from "bootstrap5-tags"
import BasicCommand, { BasicCommandInterface } from "./BasicCommand";

export interface ConditionalCommandInterface extends BasicCommandInterface {
  getParentConditionType: { (): any }
  displayPartial: { (action: string, val: any): void }
}

const ConditionalCommand = BasicCommand.extend<ConditionalCommandInterface>({
  template,
  partials: {
    parent_conditon_partial: [],
    parent_condition_type: null,
    method_type: null,
    parent_order_number_commands_partial: [],
  },
  data() {
    return {
      pipeline: {},
      condition_values: [],
      method_type: null,
      sync_action: null,
      form_data: {
        parent_order_temp_ids: [],
        data: {
          command: '',
          condition_values: []
        }
      },
    }
  },
  observe: {
    parent_condition_type(val): any {
      switch (val) {
        case 'includes':
        case 'equals':
        case 'next':
        case 'failed':
          let _condition_values = this.get("condition_values");
          this.displayPartial('parent_conditon_partial', _condition_values);
          this.set("form_data.data.condition_values", _condition_values);
          this.set("form_data.data.parent_condition_type", val);
          return;
        case 'success':
          this.set("form_data.data.parent_condition_type", val);
          this.resetPartial('parent_conditon_partial', []);
          break;
        default:
          this.resetPartial('parent_conditon_partial', []);
          return;
      }
    },
    condition_values: {
      handler: function (val: Array<any>, old: Array<any>) { }
    }
  },
  getParentConditionType() {
    return {
      EQUALS: 'equals',
      INCLUDES: 'includes',
      NEXT: 'next',
      FAILED: 'failed',
      SUCCESS: 'success',
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      // Add condition values;
      this.set("condition_values", this.get("form_data.data.condition_values") || []);
      this.set("parent_condition_type", this.get("form_data.data.parent_condition_type") || this.getParentConditionType().NEXT);
      _super();
      resolve();
    })
  },
  displayPartial(action, val) {
    let parent_conditon_partial = [];
    switch (action) {
      case 'parent_conditon_partial':
        let _template = null;
        for (var a = 0; a < val.length; a++) {
          _template = Ractive.parse(/* html */`
            <div class="row">
              <div class="col col-lg-1">
                <div class="mb-3">
                  <div class="form-label">Condition</div>
                  <select class="form-select" name="condition_logic" on-change="@this.handleChange('CONDITION_LOGIC',{ index : ${a} },@event)" value="{{condition_values[${a}].condition_logic}}">
                    <option value="NONE">--</option>
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
              </div>
              <div class="col">
                <div class="mb-3">
                  <label class="form-label">Value</label> 
                  <input class="form-control" type="text" placeholder="Condition value" name="condition_input_value" value="{{condition_values[${a}].condition_input_value}}">
                </div>
              </div>
              {{#if ${a} < condition_values.length - 1}}
              <div class="col col-lg-1">
                <div class="mb-3">
                  <label class="form-label" style="visibility:hidden">T</label>
                  <a href="#" class="btn btn-twitter w-100 btn-icon" aria-label="Twitter" on-click="@this.handleClick('ADD_MORE_CONDITIONAL_VALUE',{ action : 'delete', index : ${a} },@event)">
                    <!-- Download SVG icon from http://tabler-icons.io/i/brand-twitter -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </a>
                </div>
              </div>
              {{else}}
              <div class="col col-lg-1">
                <div class="mb-3">
                  <label class="form-label" style="visibility:hidden">T</label>
                  <a href="#" class="btn btn-twitter w-100 btn-icon" aria-label="Twitter" on-click="@this.handleClick('ADD_MORE_CONDITIONAL_VALUE',{ action : 'delete', index : ${a} },@event)">
                    <!-- Download SVG icon from http://tabler-icons.io/i/brand-twitter -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </a>
                </div>
              </div>
              {{/if}}
            </div>
          `);
          parent_conditon_partial.push({
            ..._template.t[0]
          });
        }
        _template = Ractive.parse(/* html */`
          <a href="#" class="btn btn-twitter w-50 btn-icon" style="max-width: 50px;" aria-label="Twitter"
            on-click="@this.handleClick('ADD_MORE_CONDITIONAL_VALUE',{action : 'new' },@event)">
            <!-- Download SVG icon from http://tabler-icons.io/i/brand-twitter -->
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="24" height="24"
              viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </a>
        `)
        parent_conditon_partial.push({
          ..._template.t[0]
        });
        this.resetPartial('parent_conditon_partial', parent_conditon_partial);
        break;
    }
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'CONDITION_LOGIC':
        break;
    }
    /**
     * Parent :
     * SELECT_PARENT_ORDER_NUMBER
     */
    this._super(action, props, e);
  },
  handleClick(action, props, e) {
    let _template = null;
    let _condition_values = this.get("condition_values") as Array<any>;
    switch (action) {
      case 'ADD_MORE_CONDITIONAL_VALUE':
        e.preventDefault();
        switch (props.action) {
          case 'new':
            _condition_values.push({})
            this.set("condition_values", _condition_values);
            break;
          case 'delete':
            _condition_values.splice(props.index, 1);
            this.set("condition_values", _condition_values);
            break;
        }
        this.displayPartial('parent_conditon_partial', _condition_values);
        break;
      case 'PARENT_CONDITION':
        this.set("parent_condition_type", props.value);
        switch (props.value) {
          case 'includes':
          case 'equals':
            if (_condition_values.length > 0) {
              return;
            }
            _condition_values.push({})
            this.set("condition_values", _condition_values);
            this.displayPartial('parent_conditon_partial', _condition_values);
            break;
          case 'success':
          case 'failed':
          case 'next_turn':
            // this.set("form_data.data.parent_condition_type", props.value);
            break;
        }
        break;
    }
  }
});

export default ConditionalCommand;