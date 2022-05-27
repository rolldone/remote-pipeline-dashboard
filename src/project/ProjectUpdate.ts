import ProjectService from "services/ProjectService";
import ProjectNew, { ProjectNewInterface } from "./ProjectNew";
import template from './ProjectNewView.html';
declare var window: Window;

export default ProjectNew.extend<ProjectNewInterface>({
  template,
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await _super();
      this.setProject(await this.getProject());
      resolve();
    })
  },
  async getProject() {
    try {
      let resData = await ProjectService.getProject({
        id: this.req.params.id
      });
      return resData;
    } catch (ex) {
      console.error("getProject - ex :: ", ex);
    }
  },
  setProject(props) {
    if (props == null) return;
    this.set("form_data", props.return);
  },
  async submit() {
    try {
      let form_data = this.get("form_data");
      let resData = await ProjectService.updateProject(form_data);
      resData = resData.return as any;
      window.projectRouter.navigate(window.projectRouter.buildUrl(`/${resData.id}/view`));
    } catch (ex) {
      console.error('submit - ex :: ', ex);
    }
  }
})