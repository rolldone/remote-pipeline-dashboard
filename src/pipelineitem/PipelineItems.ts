import BaseRactive from "base/BaseRactive";
import Ractive from "ractive";
import AddCommand from "./input/AddCommand";
import BasicCommand from "./input/BasicCommand";
import CommandGroup from "./input/CommandGroup";
import ConditionalCommand from "./input/ConditionalCommand";
import SwitchCommandType from "./input/SwitchCommandType";
import template from './PipelineItemsView.html';

export const CommandItem = BaseRactive.extend({
  components: {
    "basic-command": BasicCommand,
    "conditional-command": ConditionalCommand
  },
  template:/* html */`
    {{#if command_type.type == "basic-command"}}
    <basic-command></basic-command>
    {{elseif command_type.type == "conditional-command"}}
    <conditional-command></conditional-command>
    {{/if}}
  `,
  data() {
    return {
      command_type: {
        type: "basic-command"
      }
    }
  },
})

export const ListGroupItem = BaseRactive.extend({
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
          <a href="#" class="text-reset d-block">{{pipeline_item.pipeline_item_name}}</a>
          <div class="d-block text-muted text-truncate mt-n1">{{pipeline_item.pipeline_item_description}}</div>
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
              <a class="dropdown-item" href="#">
                Save
              </a>
              <a class="dropdown-item" href="#">
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
      command_datas: [],
      pipeline_item: {
        pipeline_item_name: "New Pipeline Item",
        pipeline_item_description: "Description for new pipeline item"
      },
    }
  },
  addNewCommandItem() {
    let command_datas = this.get("command_datas");
    let partial_input = [];
    for (var a = 0; a < command_datas.length; a++) {
      let _ii = Ractive.parse(/* html */`
            <div class='list-group-item'>
              <switch-command-type on-listener="onSwitchCommandTypeListener" index={{${a}}}></switch-command-type>
              <br>
              <command-item command_type={{command_datas[${a}]}}></command-item>
            </div>
          `);
      partial_input.push({
        ..._ii.t[0],
      });
    }
    command_datas.push({
      type: "basic-command",
      /* ...other datas */
    });
    let _ii = Ractive.parse(/* html */`
          <div class='list-group-item'>
            <switch-command-type on-listener="onSwitchCommandTypeListener" index={{command_datas.length-1}}></switch-command-type>
            <br>
            <command-item command_type={{command_datas[command_datas.length-1]}}></command-item>
          </div>
        `);
    partial_input.push({
      ..._ii.t[0],
    });
    this.set("command_datas", command_datas);
    this.resetPartial('pipeline_type_partial', partial_input);
  },
  newOn: {
    onSwitchCommandTypeListener(c, action, text, object) {
      switch (action) {
        case 'SWITCH_COMMAND':
          let command_datas = this.get("command_datas") as Array<any>;
          if (text.value == "delete") {
            command_datas.splice(text.index, 1);
            
            let partial_input = [];
            for (var a = 0; a < command_datas.length; a++) {
              let _ii = Ractive.parse(/* html */`
              <div class='list-group-item'>
                <switch-command-type on-listener="onSwitchCommandTypeListener" index={{${a}}}></switch-command-type>
                <br>
                <command-item command_type={{command_datas[${a}]}}></command-item>
              </div>
            `);
              partial_input.push({
                ..._ii.t[0],
              });
            }
            this.set("command_datas", command_datas);
            this.resetPartial('pipeline_type_partial', partial_input);
            return;
          }
          command_datas[text.index] = {
            ...command_datas[text.index],
            type: text.value
          }
          this.set("command_datas", command_datas);
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
  }
});


export default BaseRactive.extend({
  template,
  components: {
    "command-group": CommandGroup,
    "add-pipeline-item": AddCommand,
    "list-group-item": ListGroupItem
  },
  data() {
    return {
      pipelines_items: [],
      command_group_calc: []
    }
  },
  partials: {
    command_group_calc: [],
    pipeline_type: []
  },
  newOn: {
    onAddPipelineItemListener(c, action, text, object) {
      switch (action) {
        case 'ADD_MORE':
          let pipelines_items = this.get("pipelines_items");
          let command_group_calc = [];
          if (pipelines_items.length > 0) {
            let _exist_pipeline_item = Ractive.parse(/* html */`
                {{#each pipelines_items:i}}
                  <list-group-item pipeline_item={{pipelines_items[i]}}></list-group-item>
                {{/each}}
            `);
            command_group_calc.push({
              ..._exist_pipeline_item.t[0]
            });
          }
          let _new_pipeline_item = Ractive.parse(/* html */`
            <list-group-item ></list-group-item>
          `);
          command_group_calc.push({
            ..._new_pipeline_item.t[0]
          });
          this.resetPartial('command_group_calc', command_group_calc);
          break;
      }
    }
  },
});