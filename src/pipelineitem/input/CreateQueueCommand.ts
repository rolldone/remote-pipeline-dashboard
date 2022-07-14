import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive, { ParsedTemplate } from "ractive";
import QueueRecordService from "services/QueueRecordService";
import BasicCommand, { BasicCommandInterface } from "./BasicCommand";
import template from './CreateQueueCommandView.html';
import OverrideQueueModal, { OverrideQueueModalInterface } from "./override_queue_modal/OverrideQueueModal";

export interface CreateQueueCommandInterface extends BasicCommandInterface {
  getQueues?: { (): void }
  setQueues?: { (props: any): void }
  renderRequestQueueView: { (index: number): ParsedTemplate }
  displayRegisterQueuePartial: { (): void }
}

const CreateQueueCommand = BasicCommand.extend<CreateQueueCommandInterface>({
  template,
  components: {
    "override-queue-modal": OverrideQueueModal
  },
  partials: {
    register_queue_partials: []
  },
  data() {
    return {
      queue_datas: [],
      form_data: {},
      select_index: null
    }
  },
  onconstruct() {
    this.newOn = {
      onOverrideQueueModalListener: (c, action, text, e) => {
        debugger;
      }
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await _super();
      this.setQueues(await this.getQueues());
      this.displayRegisterQueuePartial();
      resolve();
    })
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'SELECT_QUEUE':

        break;
    }
  },
  handleClick(action, props, e) {
    let queue_data = null;
    let _register_queue_data = null;
    let _queue_datas = this.get("queue_datas");
    let _register_queue_datas: Array<any> = this.get("form_data.data.queue_datas") || [];
    switch (action) {
      case 'ADD_QUEUE':
        e.preventDefault();
        queue_data = _queue_datas[props.index];
        _register_queue_datas.push({
          id: queue_data.id,
          name: queue_data.exe_name
        });
        this.set("form_data.data.queue_datas", _register_queue_datas);
        this.displayRegisterQueuePartial();
        break;
      case 'DELETE_ITEM':
        e.preventDefault();
        _register_queue_datas.splice(props.index, 1);
        this.set("form_data.data.queue_datas", _register_queue_datas);
        this.displayRegisterQueuePartial();
        break;
      case 'OVERRIDE':
        e.preventDefault();
        _register_queue_data = _register_queue_datas[props.index];
        for (let i in _queue_datas) {
          if (_register_queue_data.id == _queue_datas[i].id) {
            queue_data = _queue_datas[i];
            break;
          }
        }
        let _override_queue_modal: OverrideQueueModalInterface = this.findComponent("override-queue-modal");
        _override_queue_modal.show(queue_data);
        break;
    }
  },
  renderRequestQueueView(index) {
    return Ractive.parse(/* html */`
      <div class="row" style="margin-bottom:12px;">
        <div class="col-lg-10">
          <input type="text" class="form-control" placeholder="" name="queue_name" value="{{form_data.data.queue_datas[${index}].name}}" autocomplete="off" readonly>
        </div>
        <div class="col-lg-1">
          {{! <a class="btn btn-facebook w-20 btn-icon" href="#" aria-label="" on-click="@this.handleClick('DELETE_ITEM',{ index : ${index} },@event)">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <desc>Download more icon variants from https://tabler-icons.io/i/x</desc>
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </a> }}
          <div class="dropdown">
            <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
              <svg class="icon icon-tabler icon-tabler-settings" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path> <circle cx="12" cy="12" r="3"></circle></svg>
            </button> 
            <div style=";" class="dropdown-menu">
              <a class="dropdown-item" href="#" on-click="@this.handleClick('OVERRIDE',{ index : ${index} }, @event)">Override</a> 
              <a class="dropdown-item" href="#" on-click="@this.handleClick('DELETE_ITEM',{ index : ${index} }, @event)">Delete</a>
            </div>
          </div>
        </div>
      </div>
    `);
  },
  displayRegisterQueuePartial() {
    let _register_queue_partials = [];
    let _queue_datas = this.get("form_data.data.queue_datas") || [];
    let _template = null;
    for (var a = 0; a < _queue_datas.length; a++) {
      _template = this.renderRequestQueueView(a);
      _register_queue_partials.push({
        ..._template.t[0]
      });
    }
    this.resetPartial("register_queue_partials", [
      ..._register_queue_partials
    ])
  },
  async getQueues() {
    try {
      let resData = await QueueRecordService.getQueueRecords({
        type: "instant"
      });
      return resData;
    } catch (ex) {
      console.error("getQueues - ex :: ", ex);
    }
  },
  setQueues(props) {
    if (props == null) return;
    this.set("queue_datas", props.return);
  }
});

export default CreateQueueCommand;