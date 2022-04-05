import BaseRactive from "base/BaseRactive";
import template from './BasicCommandView.html'
import Tags from "bootstrap5-tags"
import PipelineItemService from "services/PipelineItemService";

export default BaseRactive.extend({
  template,
  oncomplete() {
    console.log(this.get("config"))
    Tags.init();
  },
  async getParents() {
    try {
      let resData = await PipelineItemService.getParents(0);
    } catch (ex) {
      console.error("getParents :: ex ", ex);
    }
  },
  setParents(props: any) {

  }
});