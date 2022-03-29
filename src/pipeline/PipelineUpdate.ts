import PipelineNew from "./PipelineNew";

export default PipelineNew.extend({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      let pipelineItems = (await import("../pipelineitem/PipelineItems")).default;
      new pipelineItems({
        target: "#pipelineitem"
      });
      resolve();
    });
  }
});