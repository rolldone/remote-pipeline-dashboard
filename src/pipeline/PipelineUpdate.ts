import PipelineService from "services/PipelineService";
import Notify from "simple-notify";
import PipelineNew, { PipelineNewInterface, SELECT_PIPLINE_PLANNING } from "./PipelineNew";

export default PipelineNew.extend<PipelineNewInterface>({
  data() {
    return {
      page: {
        title_name: 'Edit Pipeline',
        form_name: 'Edit Pipeline form'
      }
    }
  },
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
  async setPipeline(props) {
    if (props == null) return;
    await this.set("form_data", props.return);
    if (this.safeJSON(this.get("form_data"), "repo_data.repo_from", null) != null) {
      this.set("select_pipeline_planning", SELECT_PIPLINE_PLANNING.WITH_REPOSITORY);
      if (this.safeJSON(this.get("form_data"), "repo_data.repo_name", null) == null) {
        this.resetPartial("repo_list_partial", /* html */`<repo-list on-listener="onRepoListListener" form_data={{form_data.repo_data}}></repo-list>`)
      }
    }
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
      new Notify({
        status: 'success',
        title: 'Update Pipeline',
        text: 'Update successfully :)',
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
    } catch (ex: any) {
      console.error("submit - ex :: ", ex);
      new Notify({
        status: 'error',
        title: 'Update Pipeline',
        text: ex.message,
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: false,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
    }
  }
});