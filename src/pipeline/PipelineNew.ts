import BaseRactive from "base/BaseRactive";
import PipelineItems from "pipelineitem/PipelineItems";
import template from './PipelineNewView.html';

export default BaseRactive.extend({
  template,
  components: {
    "pipeline-items": PipelineItems
  },
  onconfig() {

  }
});