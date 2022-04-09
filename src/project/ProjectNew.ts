import ProjectService from "services/ProjectService";
import BaseRactive from "../base/BaseRactive";
import template from './ProjectNewView.html';

declare var window: Window;
const ProjectNew = BaseRactive.extend({});
export default ProjectNew.extend({
  template: template,
  data() {
    return {
      form_data: {}
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        this.submit();
        break;
    }
  },
  async submit() {
    try {
      let form_data = this.get("form_data");
      let resData = await ProjectService.addProject(form_data);
      resData = resData.return as any;
      window.projectRouter.navigate(window.projectRouter.buildUrl(`/${resData.id}/view`));
    } catch (ex) {
      console.error('submit - ex :: ', ex);
    }
  }
});