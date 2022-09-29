import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './PipeLinesView.html';
import PipelineService, { PipelineInterface, PipelineServiceInterface } from "services/PipelineService";
import DeleteInfoModal, { DeleteInfoModalInterface } from "./delete_info_modal/DeleteInfoModal";

declare let window: Window;

export interface PipelinesInterface extends BaseRactiveInterface {
  getPipelines: { (): Promise<any> }
  setPipelines: { (props: any): void }
}

export default BaseRactive.extend<PipelinesInterface>({
  components: {
    "delete-info-modal": DeleteInfoModal
  },
  template,
  data() {
    return {
      pipeline_datas: []
    }
  },
  onconstruct() {
    this.newOn = {
      onDeleteModalInfoListener: async (c, action, text, e) => {
        switch (action) {
          case 'DELETED':
            this.setPipelines(await this.getPipelines());
            let _deleteModalInfo: DeleteInfoModalInterface = this.findComponent("delete-info-modal");
            _deleteModalInfo.hide();
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setPipelines(await this.getPipelines())
      resolve();
    });
  },
  handleClick(action, props, e) {
    let _pipeline_datas = this.get("pipeline_datas");
    let _pipeline_data : PipelineServiceInterface = null;
    switch (action) {
      case 'DOWNLOAD_PIPELINE_TASK':
        e.preventDefault();
        _pipeline_data = _pipeline_datas[props.index];
        PipelineService.downloadPipelineItems(_pipeline_data.pipeline_items)
        break;
      case 'DELETE':
        e.preventDefault();
        _pipeline_data = _pipeline_datas[props.index];
        let _deleteModalInfo: DeleteInfoModalInterface = this.findComponent("delete-info-modal");
        _deleteModalInfo.show(_pipeline_data);
        break;
    }
  },
  async getPipelines() {
    try {
      let project_id = this.req.query.project_id;
      let resData = await PipelineService.getPipelines({
        project_id
      });
      return resData;
    } catch (ex) {
      console.log("getPipelines - ex :: ", ex);
    }
  },
  setPipelines(props) {
    if (props == null) return;
    this.set("pipeline_datas", props.return);
  }
});