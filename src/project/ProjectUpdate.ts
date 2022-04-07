import ProjectService from "services/ProjectService";
import ProjectNew from "./ProjectNew";

declare var window: Window;
const ProjectUpdate = ProjectNew.extend({
  getProject() { },
  setProject(props) { },
})
export default ProjectUpdate.extend({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setProject(await this.getProject());
      resolve();
    })
  },
  handleClick(action, props, e) {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      switch (action) {
        case 'SUBMIT':
          e.preventDefault();
          let form_data = this.get("form_data");
          let resData = await ProjectService.updateProject(form_data);
          resData = resData.return as any;
          window.projectRouter.navigate(window.projectRouter.buildUrl(`/${resData.id}/view`));
          return;
      }
      resolve();
      _super(action, props, e);
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
  }
})