import BaseRactive from "base/BaseRactive";
import Ractive from "ractive";
import CommandItem from "./CommandItem";
import AddCommand from "./input/AddCommand";
import SwitchCommandType from "./input/SwitchCommandType";

const ListGroupItem = BaseRactive.extend({
  async addNewCommandItem() {
    let command_datas = this.get("command_datas");
    let partial_input = [
      ...this.partials.pipeline_type_partial
    ];
    command_datas.push({
      type: "basic-command",
      temp_id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
      /* ...other datas */
    });
    await this.set("command_datas", command_datas);
    let _index = command_datas.length - 1;
    let _ii = Ractive.parse(/* html */`
          <div class='list-group-item' index='${_index}'>
            <switch-command-type on-listener="onSwitchCommandTypeListener" index='${_index}'></switch-command-type>
            <br>
            <command-item on-listener="onCommandItemListener" command_datas={{command_datas}} command_data='{{command_datas[${_index}]}}' index='${_index}'></command-item>
          </div>
        `);
    partial_input.push({
      ..._ii.t[0],
    });
    await this.resetPartial('pipeline_type_partial', partial_input);
  },
  calibrateCommandItem() {
    let command_datas = this.get("command_datas");
    let partial_input = [];
    for (var a = 0; a < command_datas.length; a++) {
      let _ii = Ractive.parse(/* html */`
            <div class='list-group-item' index='${a}'>
              <switch-command-type on-listener="onSwitchCommandTypeListener" index='{{${a}}}'></switch-command-type>
              <br>
              <command-item on-listener="onCommandItemListener" command_datas={{command_datas}} command_data='{{command_datas[${a}]}}' index='${a}'></command-item>
            </div>
          `);
      partial_input.push({
        ..._ii.t[0],
      });
    }
    this.set("command_datas", command_datas);
    this.resetPartial('pipeline_type_partial', partial_input);
  },
})

export default ListGroupItem.extend({
  components: {
    "add-command": AddCommand,
    "switch-command-type": SwitchCommandType,
    "command-item": CommandItem
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
          <span class="text-reset d-block" contenteditable="true" value='{{pipeline_item.pipeline_item_name}}'></span>
          <div class="d-block text-muted text-truncate mt-n1" contenteditable="true" value="{{pipeline_item.pipeline_item_description}}"></div>
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
            </div>
          </div>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-md-6 col-xl-12">
          <div class="row row-cards">
            <div class="col-12">
            <div class="list-group list-group-flush list-group-hoverable" style="border: 1px solid #e6e7e9;">
                {{>pipeline_type_partial}}
                <div class='list-group-item'>
                  <add-command on-listener="onCommandGroupListener" button_text="Add Command"></add-command>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      index: -1,
      command_datas: [],
      pipeline_item: {
        pipeline_item_name: "New Pipeline Item",
        pipeline_item_description: "Description for new pipeline item"
      },
    }
  },
  oncomplete() {
    this.set("command_datas", this.get("pipeline_item.command_datas") || []);
    this.calibrateCommandItem();
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SAVE_PIPELINE_ITEM':
        e.preventDefault();
        this.set("pipeline_item.command_datas", this.get("command_datas"));
        this.fire("listener", action, props, e);
        break;
      case 'DELETE_PIPELINE_ITEM':
        e.preventDefault();
        this.fire("listener", action, { index: this.get("index") }, e);
        break;
    }
  },
  newOn: {
    onSwitchCommandTypeListener(c, action, text, object) {
      switch (action) {
        case 'SWITCH_COMMAND':
          if (text.value == "calibrate") {
            this.calibrateCommandItem();
            return;
          }
          let command_datas = this.get("command_datas") as Array<any>;
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
    onCommandGroupListener(c, action, text, object) {
      switch (action) {
        case 'ADD_MORE':
          this.addNewCommandItem();
          break;
      }
    },
    onCommandItemListener(c, action, text, object) {
      switch (action) {
        case 'FORM_DATA.NAME.TRIGGER':
          this.calibrateCommandItem();
          break;
      }
    }
  }
});
