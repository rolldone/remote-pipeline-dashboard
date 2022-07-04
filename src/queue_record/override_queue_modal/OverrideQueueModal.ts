import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { QueueRecordInterface } from "services/QueueRecordService";
import VariableService from "services/VariableService";
import template from './OverrideQueueModalView.html';
import VariableForm from "./VariableForm";

export interface OverrideQueueModalInterface extends BaseRactiveInterface {
  show?: { (props: any): void }
  hide?: { (): void }
  getVariable?: { (): void }
  setVariable?: { (props: any): void }
}

const OverrideQueueModal = BaseRactive.extend<OverrideQueueModalInterface>({
  template,
  components: {
    "variable-form": VariableForm
  },
  partials: {
    variable_form_partial: []
  },
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      queue_data: {},
      form_data: {},
      variable_data: {},
      variable_item: {}
    }
  },
  onconstruct() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      this.newOn = {
        onVariableFormListener: (c, action, text, e) => {
          debugger;
        }
      }
      resolve();
      _super();
    });
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'SELECT_PROCESS':
        debugger;
        break;
    }
  },
  async show(props) {
    this.set("queue_data", props);
    let myModalEl = document.getElementById(this.get("id_element"));
    var myModal = new window.bootstrap.Modal(myModalEl, {
      backdrop: 'static', keyboard: false
    })
    myModalEl.addEventListener('hidden.bs.modal', function (event) {
      // do something...

    })
    myModal.show();
    this.setVariable(await this.getVariable());
  },
  hide() {

  },
  async getVariable() {
    try {
      let _queue_data: QueueRecordInterface = this.get("queue_data");
      let resData = await VariableService.getVariable({
        id: _queue_data.exe_variable_id
      });
      return resData;
    } catch (ex) {
      console.error("getVariable - ex :: ", ex);
    }
  },
  setVariable(props) {
    if (props == null) return;
    this.set("variable_data", props.return);
    let _variable_item_datas = this.get("variable_data.data");
    let _queue_data = this.get("queue_data");
    let _variable_item = null;
    for (let i in _variable_item_datas) {
      if (_variable_item_datas[i].name == _queue_data.exe_variable_option) {
        _variable_item = _variable_item_datas[i];
      }
    }
    this.set("variable_item", _variable_item);
    this.resetPartial("variable_form_partial", /* html */`
      <variable-form 
        on-listener="onVariableFormListener" 
        variable_item_data={{variable_item}}
        variable_option="{{queue_data.exe_variable_option}}" 
        variable_id="{{queue_data.exe_variable_id}}"
        schema_datas={{variable_data.schema}}>
      </variable-form>
    `);
  }
});

export default OverrideQueueModal;