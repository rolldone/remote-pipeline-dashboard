import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive, { ParsedTemplate } from "ractive";
import QueueRecordService from "services/QueueRecordService";
import BasicCommand, { BasicCommandInterface } from "./BasicCommand";
import template from './CreateQueueCommandView.html';

export interface CreateQueueCommandInterface extends BasicCommandInterface {
  getQueues?: { (): void }
  setQueues?: { (props: any): void }
  renderRequestQueueView: { (index: number): ParsedTemplate }
  displayRegisterQueuePartial: { (): void }
}

const CreateQueueCommand = BasicCommand.extend<CreateQueueCommandInterface>({
  template,
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
    let _queue_datas = this.get("queue_datas");
    let _register_queue_datas: Array<any> = this.get("form_data.data.queue_datas") || [];
    switch (action) {
      case 'ADD_QUEUE':
        e.preventDefault();
        let queue_data = _queue_datas[props.index];
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
    }
  },
  renderRequestQueueView(index) {
    return Ractive.parse(/* html */`
      <div class="row" style="margin-bottom:12px;">
        <div class="col-lg-10">
          <input type="text" class="form-control" placeholder="" name="queue_name" value="{{form_data.data.queue_datas[${index}].name}}" autocomplete="off" readonly>
        </div>
        <div class="col-lg-1">
          <a class="btn btn-facebook w-20 btn-icon" href="#" aria-label="" on-click="@this.handleClick('DELETE_ITEM',{ index : ${index} },@event)">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <desc>Download more icon variants from https://tabler-icons.io/i/x</desc>
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </a>
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