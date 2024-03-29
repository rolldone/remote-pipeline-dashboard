import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";
import AddCommand from "./input/AddCommand";
import CommandGroup from "./input/CommandGroup";
import template from './PipelineItemsView.html';
import ListGroupItem from "./ListGroupItem";
import PipelineItemService, { PipelineItemInterface } from "services/PipelineItemService";
import PipelineTaskService from "services/PipelineTaskService";
import TestPipelineItemModal, { TestPipelineItemModalInterface } from "./execution_modal/TestPipelineItemModal";
import Sortable from 'sortablejs';
import ArrayMove from "base/ArrayMove";
import ImportItemModal, { ImportItemModalInterface } from "./import_item_modal/ImportItemModal";
import PipelineService from "services/PipelineService";

export interface PipelineItemsInterface extends BaseRactiveInterface {
  setPipelineItems: { (props: any): void }
  getPipelineItems: { (): Promise<any> }
  submitPipelineItem: { (index: number): void }
  deletePipelineItem: { (index: number): void }
  calibrateListGroup: { (): void }
}

let pipeLineItemSortable = null;
export default BaseRactive.extend<PipelineItemsInterface>({
  template,
  components: {
    "command-group": CommandGroup,
    "add-pipeline-item": AddCommand,
    "list-group-item": ListGroupItem,
    "test-pipeline-modal": TestPipelineItemModal,
    "import-item-modal": ImportItemModal
  },
  data() {
    return {
      pipeline: {},
      pipeline_items: [],
      command_group_calc: []
    }
  },
  onconstruct() {
    this.newOn = {
      onImportItemModalListener: async (c, action, text, object) => {
        let pipeline = this.get("pipeline");
        let pipeline_items = this.get("pipeline_items") || [];
        switch (action) {
          case 'SUBMIT':
            let importItemModal: ImportItemModalInterface = this.findComponent("import-item-modal");
            importItemModal.hide();
            switch (text.import_type) {
              case 'replace':
                for (let i = 0; i < pipeline_items.length; i++) {
                  await this.deletePipelineItem(i);
                }
                pipeline_items = text.file;
                break;
              case 'add_existing':
                pipeline_items = [
                  ...pipeline_items,
                  ...text.file
                ];
                break;
            }
            for (var i in pipeline_items) {
              pipeline_items[i].order_number = i;
              pipeline_items[i].pipeline_id = pipeline.id;
              pipeline_items[i].project_id = pipeline.project_id;
              pipeline_items[i].command_datas = pipeline_items[i].pipeline_tasks;
            }
            this.set("pipeline_items", pipeline_items);
            this.calibrateListGroup();
            break;
        }
      },
      onTestPipelineModalListener: (c, action, text, object) => {

      },
      onAddPipelineItemListener: async (c, action, text, object) => {
        switch (action) {
          case 'ADD_MORE':
            let pipeline_items: Array<PipelineItemInterface> = this.get("pipeline_items");
            for (var a = 0; a < pipeline_items.length; a++) {
              await this.submitPipelineItem(a);
            }
            let pipeline = this.get("pipeline");
            pipeline_items.push({
              name: 'Task ' + (pipeline_items.length + 1),
              description: 'Description for Task ' + (pipeline_items.length + 1),
              pipeline_id: pipeline.id,
              project_id: pipeline.project_id,
              is_active: true,
              order_number: pipeline_items.length,
            })
            this.set("pipeline_items", pipeline_items);
            this.calibrateListGroup();
            break;
        }
      },
      onListGroupItemListener: async (c, action, text, object) => {
        pipeLineItemSortable.option("disabled", false);
        switch (action) {
          case 'EDIT_TASKS':
            pipeLineItemSortable.option("disabled", text);
            break;
          case 'TEST_PIPELINE_ITEM':
            await this.submitPipelineItem(text.index);
            let _testPipelineItemModal: TestPipelineItemModalInterface = this.findComponent("test-pipeline-modal");
            _testPipelineItemModal.show(text);
            break;
          case 'SAVE_PIPELINE_ITEM':
            this.submitPipelineItem(text.index);
            break;
          case 'DELETE_PIPELINE_ITEM':
            let pipeline_items: Array<any> = this.get("pipeline_items");
            await this.deletePipelineItem(text.index);
            pipeline_items.splice(text.index, 1);
            this.calibrateListGroup();
            this.set("pipeline_items", pipeline_items);
            break;
        }
      }
    }
    this._super();
  },
  partials: {
    command_group_calc: [],
    pipeline_type: []
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setPipelineItems(await this.getPipelineItems());
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    let pipeline_items = this.get("pipeline_items");
    switch (action) {
      case 'SAVE_ALL':
        e.preventDefault();
        for (let i = 0; i < pipeline_items.length; i++) {
          this.submitPipelineItem(i);
        }
        break;
      case 'IMPORT_ITEM':
        e.preventDefault();
        let importItemModal: ImportItemModalInterface = this.findComponent("import-item-modal");
        importItemModal.show({});
        break;
      case 'DOWNLOAD_ITEM':
        e.preventDefault();
        for (var i in pipeline_items) {
          delete pipeline_items[i].command_datas;
        }
        PipelineService.downloadPipelineItems(pipeline_items);
        break;
    }
  },
  calibrateListGroup() {
    let pipeline_items = this.get("pipeline_items");
    let command_group_calc = [];
    console.log("pipeline_items", pipeline_items);
    for (var a = 0; a < pipeline_items.length; a++) {
      let _exist_pipeline_item = Ractive.parse(/* html */`
          <list-group-item pipeline={{pipeline}} pipeline_item={{pipeline_items[${a}]}} index={{${a}}} on-listener="onListGroupItemListener"></list-group-item>
      `);
      command_group_calc.push({
        ..._exist_pipeline_item.t[0]
      });
    }
    this.resetPartial('command_group_calc', command_group_calc);
  },
  async getPipelineItems() {
    try {
      let pipeline = this.get("pipeline");
      let resData = await PipelineItemService.getPipelineItems({
        project_id: pipeline.project_id,
        pipeline_id: pipeline.id,
        order_by_name: 'order_number',
        order_by_value: 'ASC'
      });
      return resData;
    } catch (ex) {
      console.error("getPipelineItems - ex :: ", ex);
    }
  },
  setPipelineItems(props) {
    if (props == null) return;
    let pipeline_items = this.get("pipeline_items") || [];
    for (var a = 0; a < props.return.length; a++) {
      let _pipeline_item = props.return[a];
      pipeline_items.push({
        id: _pipeline_item.id,
        name: _pipeline_item.name,
        description: _pipeline_item.description,
        type: _pipeline_item.type,
        order_number: _pipeline_item.order_number,
        project_id: _pipeline_item.pro_id,
        pipeline_id: _pipeline_item.pip_id,
        pipeline_tasks: _pipeline_item.pipeline_tasks
      })
    }
    this.set("pipeline_items", pipeline_items);
    this.calibrateListGroup();

    var el = document.getElementById('sort-list-pip-item');
    pipeLineItemSortable = Sortable.create(el, {
      onEnd: async (/**Event*/evt) => {
        // most likely why this event is used is to get the dragging element's current index
        // same properties as onEnd
        pipeline_items = ArrayMove(pipeline_items, evt.oldIndex, evt.newIndex);
        for (let a = 0; a < pipeline_items.length; a++) {
          pipeline_items[a].order_number = a;
        }
        this.set("pipeline_items", pipeline_items);
        this.calibrateListGroup();
        for (let a = 0; a < pipeline_items.length; a++) {
          this.submitPipelineItem(a)
        }
      }
    });
  },
  async submitPipelineItem(index: number) {
    try {
      let pipeline = this.get("pipeline");
      let pipeline_items: Array<PipelineItemInterface> = this.get("pipeline_items");
      let pipeline_item = pipeline_items[index];

      // Save or update
      let resData: PipelineItemInterface | any = await PipelineItemService.addPipelineItem({
        id: pipeline_item.id,
        pipeline_id: pipeline_item.pipeline_id,
        project_id: pipeline_item.project_id,
        name: pipeline_item.name,
        is_active: pipeline_item.is_active || true,
        type: pipeline_item.type || "",
        order_number: pipeline_item.order_number,
        description: pipeline_item.description
      });
      resData = resData.return;
      pipeline_item.id = resData.id;

      // Store again to pipeline_items
      let command_datas = pipeline_item.command_datas;
      console.log("command_datas :: ", command_datas);
      if (command_datas == null) return;
      for (var a = 0; a < command_datas.length; a++) {
        command_datas[a].pipeline_item_id = pipeline_item.id;
        command_datas[a].project_id = pipeline_item.project_id;
        command_datas[a].pipeline_id = pipeline_item.pipeline_id;
      }
      if (command_datas.length > 0) {
        resData = await PipelineTaskService.addPipelineTasks(command_datas);
      }
    } catch (ex) {
      console.error("submitPipelineItem - ex :: ", ex);
    }
  },
  async deletePipelineItem(index: number) {
    try {
      let pipeline = this.get("pipeline");
      let pipeline_items: Array<PipelineItemInterface> = this.get("pipeline_items");
      let pipeline_item = pipeline_items[index];
      let resData = await PipelineItemService.deletePipelineItem([pipeline_item.id || null]);
    } catch (ex) {
      console.error("deletePipelineItem - ex :: ", ex);
    }
  }
});