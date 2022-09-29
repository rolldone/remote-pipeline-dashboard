import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueService from "test_queue/services/core/QueueService";
import QueueRecordService, { QueueRecordInterface } from "test_queue/services/QueueRecordService";
import VariableItemService from "test_queue/services/VariableItemService";
import VariableService from "test_queue/services/VariableService";
import VariableForm from "test_queue/variable_component/VariableForm";
import template from './SelectQueueView.html';

export interface SelectQueueInterface extends BaseRactiveInterface {
  getQueue?: { (): void }
  setQueue?: { (props: any): void }
  getVariable?: { (): void }
  setVariabble?: { (props: any): void }
}

const SelectQueue = BaseRactive.extend<SelectQueueInterface>({
  template,
  components: {
    "variable-form": VariableForm
  },
  partials: {
    variable_form_partial: []
  },
  data() {
    return {
      form_data: {},
      queue_data: {},
      variable_data: []
    }
  },
  onconstruct() {
    this._super();
    this.newOn = {
      onVariableFormListener: (c, action, props, e) => {
        debugger;
      }
    }
    this.reInitializeObserve();
  },
  oncomplete() {
    this._super();
    this.set("form_data.queue_key", '7S7XLqPnf7s6');
  },
  async handleClick(action, props, e) {
    let _variable_item = this.get("variable_item");
    let _queue_data: QueueRecordInterface = this.get("queue_data");
    let _form_data = this.get("form_data");
    switch (action) {
      case 'SUBMIT_QUEUE':
        e.preventDefault();
        this.setQueue(await this.getQueue());
        this.setVariabble(await this.getVariable());
        break;
      case 'NEXT':
        e.preventDefault();
        let resData = await VariableItemService.getRenderVariableItem(_variable_item);
        resData = resData.return;
        this.set("form_data.data", resData)
        this.fire("listener", "NEXT", 3, e);
        // resData = await QueueService.createByExistKey(_queue_data.queue_key, {
        //   data: resData,
        //   delay: _form_data.delay,
        //   process_limit: _form_data.process_limit,
        //   process_mode: _form_data.process_mode
        // });
        break;
    }
  },
  async getQueue() {
    try {
      let _form_data = this.get("form_data");
      let resData = await QueueRecordService.getByQueueKey(_form_data.queue_key);
      return resData;
    } catch (ex) {
      console.error("getQueue - ex :: ", ex);
    }
  },
  setQueue(props) {
    if (props == null) return;
    this.set("queue_data", props.return);
    let _form_data = this.get("form_data");
    _form_data = {
      ..._form_data,
      ...props.return
    };
    _form_data.process_mode = _form_data.exe_process_mode;
    _form_data.delay = _form_data.exe_delay;
    this.set("form_data", _form_data);
  },
  async getVariable() {
    try {
      let _form_data = this.get("form_data");
      let resData = await VariableService.getVariableById(_form_data.exe_variable_id);
      return resData;
    } catch (ex) {
      console.error("getVariable - ex :: ", ex);
    }
  },
  setVariabble(props) {
    if (props == null) {
      return;
    }
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
  },
});

export default SelectQueue;