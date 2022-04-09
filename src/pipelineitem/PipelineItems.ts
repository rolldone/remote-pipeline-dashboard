import BaseRactive from "base/BaseRactive";
import Ractive from "ractive";
import AddCommand from "./input/AddCommand";
import CommandGroup from "./input/CommandGroup";
import template from './PipelineItemsView.html';
import CommandItem from "./CommandItem";
import ListGroupItem from "./ListGroupItem";

const PipelineItem = BaseRactive.extend({
  calibrateListGroup() {
    let pipelines_items = this.get("pipelines_items");
    let command_group_calc = [];
    console.log("pipeline_items",pipelines_items);
    for (var a = 0; a < pipelines_items.length; a++) {
      let _exist_pipeline_item = Ractive.parse(/* html */`
          <list-group-item pipeline_item={{pipelines_items[${a}]}} index={{${a}}} on-listener="onListGroupItemListener"></list-group-item>
      `);
      command_group_calc.push({
        ..._exist_pipeline_item.t[0]
      });
    }
    this.resetPartial('command_group_calc', command_group_calc);
  }
})

export default PipelineItem.extend({
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
  observe: {},
  submitPipelineItem() {
    try {
      console.log(this.get("pipelines_items"));
      debugger;
    } catch (ex) {
      console.error("submitPipelineItem - ex :: ", ex);
    }
  },
  newOn: {
    async onAddPipelineItemListener(c, action, text, object) {
      switch (action) {
        case 'ADD_MORE':
          let pipelines_items = this.get("pipelines_items");
          pipelines_items.push({
            pipeline_item_name: 'Task ' + (pipelines_items.length + 1),
            pipeline_item_description: 'Description for Task ' + (pipelines_items.length + 1)
          })
          this.set("pipelines_items", pipelines_items);
          this.calibrateListGroup();
          break;
      }
    },
    onListGroupItemListener(c, action, text, object) {
      switch (action) {
        case 'SAVE_PIPELINE_ITEM':
          this.submitPipelineItem();
          break;
        case 'DELETE_PIPELINE_ITEM':
          let pipelines_items: Array<any> = this.get("pipelines_items");
          pipelines_items.splice(text.index,1);
          this.set("pipelines_items", pipelines_items);
          this.calibrateListGroup();
          break;
      }
    }
  },
});