import PipelineService from "services/PipelineService";
import PipelineNew from "./PipelineNew";

const PipelineUpdate = PipelineNew.extend({
  getPipeline() { },
  setPipeline(props) { }
})

export default PipelineUpdate.extend({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setPipeline(await this.getPipeline());
      let pipelineItems = (await import("../pipelineitem/PipelineItems")).default;
      new pipelineItems({
        target: "#pipelineitem"
      });
      resolve();
    });
  },
  async handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        let form_data = this.get("form_data");
        let resData = await PipelineService.updatePipeline(form_data);
        resData = resData.return;
        window.pipelineRouter.navigate(window.pipelineRouter.buildUrl(`/${resData.id}/view`));
        return;
    }
    this._super(action, props, e);
  },
  async getPipeline() {
    try {
      let resData = await PipelineService.getPipeline({
        id: this.req.params.id
      });
      return resData;
    } catch (ex) {
      console.error("getPipeline - ex :: ", ex);
    }
  },
  setPipeline(props) {
    if (props == null) return;
    this.set("form_data", props.return);
  }
});