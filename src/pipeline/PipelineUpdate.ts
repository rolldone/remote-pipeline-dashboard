import PipelineService from "services/PipelineService";
import PipelineNew, { PipelineNewInterface } from "./PipelineNew";

export default PipelineNew.extend<PipelineNewInterface>({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await _super();
      this.setPipeline(await this.getPipeline());
      resolve();
    });
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
    let parseQuery = this.parseQuery(window.location.search);
    if (parseQuery.oauth_user_id != null) {
      this.set("form_data", {
        ...this.get("form_data"),
        // Set repo_name null it mean you need change repository
        repo_name: null
      })
      this.set("form_data.oauth_user_id", parseQuery.oauth_user_id);
    }
  },
  async handleClick(action, props, e) {
    switch (action) {
      case 'OPEN_REPOSITORY_AUTH':
        break;
    }
    this._super(action, props, e);
  },
  async submit() {
    try {
      let form_data = this.get("form_data");
      let resData = await PipelineService.updatePipeline(form_data);
      resData = resData.return;
      window.pipelineRouter.navigate(window.pipelineRouter.buildUrl(`/${resData.id}/view`));
    } catch (ex) {
      console.error("submit - ex :: ", ex);
    }
  }
});