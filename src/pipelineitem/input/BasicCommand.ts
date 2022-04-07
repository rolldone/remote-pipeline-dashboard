import BaseRactive from "base/BaseRactive";
import template from './BasicCommandView.html'
import Tags from "bootstrap5-tags"
import PipelineItemService from "services/PipelineItemService";

export default BaseRactive.extend({
  template,
  data(){
    return {}
  },
  oncomplete() {
    console.log(this.get("config"))
    Tags.init();
    console.log("this.data",)
  },
  async getParents() {
    try {
      let resData = await PipelineItemService.getPipelineItemParents(0, 0, 0);
    } catch (ex) {
      console.error("getParents :: ex ", ex);
    }
  },
  setParents(props: any) {

  }
});