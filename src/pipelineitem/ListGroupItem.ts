import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive, { ParsedTemplate } from "ractive";
import PipelineTaskService, { PipelineTaskInterface } from "services/PipelineTaskService";
import CommandItem from "./CommandItem";
import AddCommand from "./input/AddCommand";
import SwitchCommandType from "./input/SwitchCommandType";
import ArrayMove from "base/ArrayMove";

export interface ListGroupItemInterface extends BaseRactiveInterface {
  calibrateCommandItem: { (): void }
  getPipelineTasks: { (): Promise<any> }
  setPipelineTasks: { (props: any): void }
  returnDisplayCommandRactive: { (index: number): ParsedTemplate }
  addNewCommandItem: { (): void }
}

const ListGroupItem = BaseRactive.extend<ListGroupItemInterface>({
  components: {
    "add-command": AddCommand,
    "switch-command-type": SwitchCommandType,
    "command-item": CommandItem,
  },
  partials: {
    "pipeline_type_partial": []
  },
  template: /* html */`
    <div class="list-group-item">
      <div class="row align-items-center">
        <div class="col-auto"><span class="badge bg-red"></span></div>
        <div class="col-auto">
          <a href="#">
            <span class="avatar" style="background-image: url(./static/avatars/000m.jpg)"></span>
          </a>
        </div>
        <div class="col text-truncate">
          <span class="text-reset d-block" contenteditable="true" value='{{pipeline_item.name}}'></span>
          <div class="d-block text-muted text-truncate mt-n1" contenteditable="true" value="{{pipeline_item.description}}"></div>
        </div>
        <div class="col-auto">
          <a href="#" class="list-group-item-actions" style="display: none;">
            <!-- Download SVG icon from http://tabler-icons.io/i/star -->
            <svg xmlns="http://www.w3.org/2000/svg" class="icon text-muted" width="24" height="24"
              viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z">
              </path>
            </svg>
          </a>
          <div class="dropdown">
            <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="24"
                height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z">
                </path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <!-- Download SVG icon from http://tabler-icons.io/i/calendar -->
              <!-- SVG icon code -->
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="#" on-click="@this.handleClick('SAVE_PIPELINE_ITEM',{},@event)">
                Save
              </a>
              <a class="dropdown-item" href="#" on-click="@this.handleClick('DELETE_PIPELINE_ITEM',{},@event)">
                Delete
              </a>
              <a class="dropdown-item" href="#" on-click="@this.handleClick('TEST_PIPELINE_ITEM',{},@event)">
                Test
              </a>
              <a class="dropdown-item" href="#" on-click="@this.handleClick('EDIT_TASKS',{},@event)">
                {{#if is_edit_task == true}}
                Hide Tasks
                {{else}}
                Edit Tasks
                {{/if}}
              </a>
            </div>
          </div>
        </div>
      </div>
      <br>
      {{#if is_edit_task == true}}
      <div class="row">
        <div class="col-md-6 col-xl-12">
          <div class="row row-cards">
            <div class="col-12">
              <div class="list-group list-group-flush list-group-hoverable" style="border: 1px solid #e6e7e9;" id="sort-pipeline-type-partial">
                {{>pipeline_type_partial}}
                <div class='list-group-item'>
                  <add-command on-listener="onCommandGroupListener" button_text="Add Command"></add-command>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {{/if}}
    </div>
  `,
  onconstruct() {
    this.newOn = {
      onTestPipelineModalListener: (c, action, text, object) => {

      },
      onSwitchCommandTypeListener: async (c, action, text, object) => {
        let command_datas = this.get("command_datas") as Array<any>;
        switch (action) {
          case 'MOVE_UP':
          case 'MOVE_DOWN':
            command_datas = ArrayMove(command_datas, text.oldIndex, text.newIndex);
            for (let a = 0; a < command_datas.length; a++) {
              command_datas[a].order_number = a;
            }
            this.set("command_datas", command_datas);
            break;
          case 'RESET':
            this.setPipelineTasks(await this.getPipelineTasks());
            break;
          case 'DELETE':
            command_datas.splice(text.index, 1);
            this.set("command_datas", command_datas);
            this.calibrateCommandItem();
            break;
          case 'SWITCH_COMMAND':
            if (text.value == "calibrate") {
              this.calibrateCommandItem();
              return;
            }
            if (text.value == "delete") {
              command_datas.splice(text.index, 1);
              this.set("command_datas", command_datas);
              this.calibrateCommandItem();
              return;
            }
            command_datas[text.index] = {
              ...command_datas[text.index],
              type: text.value
            }
            this.set("command_datas", command_datas);
            this.calibrateCommandItem();
            break;
        }
      },
      onCommandGroupListener: (c, action, text, object) => {
        switch (action) {
          case 'ADD_MORE':
            this.addNewCommandItem();
            break;
        }
      },
      onCommandItemListener: (c, action, text, object) => {
        switch (action) {
          case 'FORM_DATA.NAME.TRIGGER':
            this.calibrateCommandItem();
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    this.set("command_datas", this.get("pipeline_item.command_datas") || []);
    this.calibrateCommandItem();
  },
  data() {
    return {
      index: -1,
      is_edit_task: false,
      command_datas: [],
      pipeline_item: {
        name: "New Pipeline Item",
        description: "Description for new pipeline item"
      },
    }
  },
  async handleClick(action, props, e) {
    let _pipeline_item = this.get("pipeline_item");
    switch (action) {
      case 'TEST_PIPELINE_ITEM':
        e.preventDefault();
        this.set("pipeline_item.command_datas", this.get("command_datas"));
        this.fire("listener", action, {
          pipeline_id: _pipeline_item.pipeline_id,
          project_id: _pipeline_item.project_id,
          index: this.get("index")
        }, e);
        this.set("is_edit_task", false);
        break;
      case 'SAVE_PIPELINE_ITEM':
        e.preventDefault();
        this.set("pipeline_item.command_datas", this.get("command_datas"));
        this.fire("listener", action, { index: this.get("index") }, e);
        this.set("is_edit_task", false);
        break;
      case 'DELETE_PIPELINE_ITEM':
        e.preventDefault();
        this.fire("listener", action, { index: this.get("index") }, e);
        break;
      case 'EDIT_TASKS':
        e.preventDefault();
        this.set("is_edit_task", this.get("is_edit_task") == true ? false : true)
        if (this.get("is_edit_task") == true) {
          this.setPipelineTasks(await this.getPipelineTasks());
        }
        this.fire("listener", action, this.get("is_edit_task"), e);
        break;
    }
  },
  returnDisplayCommandRactive(index: number) {
    return Ractive.parse(/* html */`
      <div class='list-group-item' index='${index}'>
        <switch-command-type on-listener="onSwitchCommandTypeListener" index='{{${index}}}' length={{command_datas.length}}></switch-command-type>
        <br>
        <command-item on-listener="onCommandItemListener" command_datas={{command_datas}} command_data='{{command_datas[${index}]}}' index='${index}'></command-item>
      </div>
    `);
  },
  async addNewCommandItem() {
    let command_datas = this.get("command_datas");
    let partial_input: Array<any> = [
      ...this.partials.pipeline_type_partial as Array<any>
    ];
    command_datas.push({
      type: "basic-command",
      temp_id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      is_active: true
      /* ...other datas */
    });
    await this.set("command_datas", command_datas);
    let _index = command_datas.length - 1;
    let _ii = this.returnDisplayCommandRactive(_index);
    partial_input.push({
      ..._ii.t[0],
    });
    await this.resetPartial('pipeline_type_partial', partial_input);
  },
  calibrateCommandItem() {
    let command_datas = this.get("command_datas");
    let partial_input = [];
    for (var a = 0; a < command_datas.length; a++) {
      let command_item = command_datas[a];
      if (a == 0) {
        if (command_item.parent_order_temp_ids.length > 0) {
          command_item.parent_order_temp_ids.splice(0, 1);
        }
      } else {
        for (var b = 0; b < a; b++) {
          let _foundParent = false
          let _catchIndex = null;
          let _command_parent_item = command_datas[b];
          for (var c = 0; c < command_item.parent_order_temp_ids.length; c++) {
            _catchIndex = c;
            console.log("_command_parent_item.temp_id :: ", _command_parent_item.temp_id);
            if (_command_parent_item.temp_id == command_item.parent_order_temp_ids[c]) {
              _foundParent = true;
              break;
            }
          }
          if (_foundParent == false) {
            command_item.parent_order_temp_ids.splice(_catchIndex, 1);
          }
        }
      }
      let _ii = this.returnDisplayCommandRactive(a);
      partial_input.push({
        ..._ii.t[0],
      });
    }
    this.set("command_datas", command_datas);
    this.resetPartial('pipeline_type_partial', partial_input);
  },
  async getPipelineTasks() {
    try {
      let pipeline_item = this.get("pipeline_item");
      let resData = await PipelineTaskService.getPipelineTasks({
        pipeline_item_id: pipeline_item.id || -1
      });
      return resData;
    } catch (ex) {
      console.error("getPipelineTask - ex :: ", ex);
    }
  },
  setPipelineTasks(props): void {
    if (props == null) return;
    /**
     * If have edit before and hide and show again
     * dont let insert from server if data from is empty 
    */
    let _commands = [];
    if (props.return.length > 0) {
      let _tasks: Array<any> = props.return as any;
      for (var a = 0; a < _tasks.length; a++) {
        _commands.push({
          data: _tasks[a].data,
          parent_order_temp_ids: _tasks[a].parent_order_temp_ids,
          description: _tasks[a].description,
          id: _tasks[a].id,
          is_active: _tasks[a].is_active,
          order_number: _tasks[a].order_number,
          pipeline_id: _tasks[a].pipeline_id,
          pipeline_item_id: _tasks[a].pipeline_item_id,
          project_id: _tasks[a].project_id,
          name: _tasks[a].name,
          temp_id: _tasks[a].temp_id,
          type: _tasks[a].type,
        })
      }
      this.set("command_datas", _commands);
      this.set("pipeline_item.command_datas", this.get("command_datas"));
    }
    this.calibrateCommandItem();
  }
})

export default ListGroupItem;