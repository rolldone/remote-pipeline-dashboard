import SelectRepoPipelineItemIndex, { SelectRepoPipelineItemInterface } from "execution/step/SelectRepoPipelineItem";
import { ExecutionInterface } from "services/ExecutionService";
import PipelineService from "services/PipelineService";
import RepositoryService from "services/RepositoryService";
import Sortable from 'sortablejs';


export interface SelectRepoPipelineItemIndexInterface extends SelectRepoPipelineItemInterface {
  getPipeline?: { (): void }
  setPipeline?: { (props: any): void }
}

/**
 * Step1 extends Step2 from execution
 * Because we dont need select pipeline again
 */
const SelectRepoPipelineItem = SelectRepoPipelineItemIndex.extend<SelectRepoPipelineItemIndexInterface>({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      let _form_data: ExecutionInterface = this.get("form_data");

      // If execution type group just direct to step-three
      if (_form_data.execution_type == "group") {
        return this.fire("listener", 'CONTINUE', {
          component: "step-three"
        }, null);
      }

      if (_form_data.project_id == null) {
        return this.fire("listener", 'CONTINUE', {
          component: "step-select-project"
        }, null);
      }
      
      _super();
      resolve();
    });
  },

  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-one"
        }, e);
        return;
      case 'CONTINUE':
        e.preventDefault();
        this.saveSortPipeline();
        this.fire("listener", action, {
          component: "step-three"
        }, e);
        return;
    }
    this._super(action, props, e);
  },
  async getBranchs() {
    try {
      let _form_data = this.get("form_data");
      let pipeLineData = this.get("pipeline_data");
      let repo_data = pipeLineData.repo_data;
      if (repo_data == null) return;
      let resData = await RepositoryService.getBranchs({
        oauth_user_id: repo_data.oauth_user_id,
        from_provider: repo_data.repo_from,
        repo_name: repo_data.repo_name,
        id: repo_data.repo_id
      });
      return resData;
    } catch (ex) {
      console.error("getBranchs - ex :: ", ex);
    }
  },
  setBranchs(props) {
    if (props == null) return;
    this.set("branch_datas", props.return);
  },
  async getPipeline() {
    try {
      let _form_data = this.get("form_data");
      let resData = await PipelineService.getPipeline({
        id: _form_data.pipeline_id
      });
      return resData;
    } catch (ex) {
      console.error("getProjects - ex :: ", ex);
    }
  },
  setPipeline(props) {
    if (props == null) return;
    this.set("pipeline_data", props.return);
  },
})

export default SelectRepoPipelineItem;