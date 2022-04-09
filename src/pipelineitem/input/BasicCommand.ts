import BaseRactive from "base/BaseRactive";
import template from './BasicCommandView.html'
import Tags from "bootstrap5-tags"
import PipelineItemService from "services/PipelineItemService";
import Ractive from "ractive";
import debounce from 'lodash/debounce';

declare let $: JQueryStatic

interface form_data {
  id?: number | string
  temp_id: number | string
  name: string
  parent_order_numbers: Array<string>
  description: string
  order_number: number
  command: string
}

interface parent_order_numbers {
  selected: boolean
  name: string
  temp_id: number | string
}

const BasicCommand = BaseRactive.extend({
  template,
  partials: {
    parent_order_number_commands_partial: []
  },
  data() {
    return {
      form_data: {
        parent_order_numbers: []
      },
      command_datas: []
    }
  },
  async displayParentOrderNumberCommandPartial() {
    let parent_order_number_commands_partial = [
      ...this.partials.parent_order_number_commands_partial
    ];
    let _index = this.get('index');
    let _command_datas: Array<form_data> = this.get("command_datas");
    let _form_data: form_data = this.get("form_data");
    let _parent_order_numbers_selected = _form_data.parent_order_numbers || [];
    let parent_order_numbers: Array<parent_order_numbers> = [];
    for (var a = 0; a < _index; a++) {
      let is_found_selected = false;
      for (var b = 0; b < _parent_order_numbers_selected.length; b++) {
        if (_parent_order_numbers_selected[b] == _command_datas[a].temp_id) {
          parent_order_numbers.push({
            selected: true,
            name: _command_datas[a].name,
            temp_id: _command_datas[a].temp_id
          });
          is_found_selected = true;
          break;
        }
      }
      if (is_found_selected == false) {
        if (_command_datas[a].order_number != _index) {
          parent_order_numbers.push({
            selected: false,
            name: _command_datas[a].name,
            temp_id: _command_datas[a].temp_id
          });
        }
      }
    }
    for (var a = 0; a < parent_order_numbers.length; a++) {
      let _template = Ractive.parse(/* html */`
        <option value="${parent_order_numbers[a].temp_id}" ${parent_order_numbers[a].selected == true ? "selected" : ""}>${parent_order_numbers[a].name}</option>
      `);
      parent_order_number_commands_partial.push({
        ..._template.t[0]
      })
    }
    await this.resetPartial('parent_order_number_commands_partial', parent_order_number_commands_partial);
    Tags.init();
  },
  _pendingTriggerFormDataName: null as any
});

export default BasicCommand.extend({
  oncomplete() {
    this.displayParentOrderNumberCommandPartial();
  },
  handleClick(action, props, e) {
    switch (action) {}
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'SELECT_PARENT_ORDER_NUMBER':
        let _form_data: form_data = this.get("form_data");
        let _is_deleted = false;
        let _ids = $(e.target).val() as string[];
        _form_data.parent_order_numbers = _form_data.parent_order_numbers || [];
        _form_data.parent_order_numbers = _ids;
        this.set("form_data", {
          ...this.get("form_data"),
          ..._form_data,
        });
        break;
    }
  },
  observe: {}
});