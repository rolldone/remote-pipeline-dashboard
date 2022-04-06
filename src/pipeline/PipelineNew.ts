import BaseRactive from "base/BaseRactive";
import PipelineItems from "pipelineitem/PipelineItems";
import { Router } from "routerjs";
import PipelineService from "services/PipelineService";
import template from './PipelineNewView.html';

declare var window: Window;

export default BaseRactive.extend({
  template,
  components: {
    "pipeline-items": PipelineItems
  },
  data() {
    return {
      form_data: {},
      pipelines_items: [],
    }
  },
  onconfig() {

  },
  async handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        let form_data = this.get("form_data");
        let resData = await PipelineService.addPipeline(form_data);
        resData = resData.return;
        window.pipelineRouter.navigate(window.pipelineRouter.buildUrl(`/${resData.id}/view`));
        break;
    }
  }
});