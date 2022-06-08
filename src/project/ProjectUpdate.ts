import ProjectService from "services/ProjectService";
import ProjectNew, { ProjectNewInterface } from "./ProjectNew";
import template from './ProjectNewView.html';
import Notify from 'simple-notify'

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
      new Notify({
        status: 'success',
        title: 'Update Project',
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
      console.error('submit - ex :: ', ex);
      new Notify({
        status: 'error',
        title: 'Update Project',
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
})