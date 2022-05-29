import { BrowserHistoryEngine, createRouter } from "routerjs";
import ProjectService from "services/ProjectService";
import BaseRactive, { BaseRactiveInterface } from "../base/BaseRactive";
import DeleteInfoModal, { DeleteInfoModalInterface } from "./delete_info_modal/DeleteInfoModal";
import template from './ProjectsView.html';

interface ProjectsInterface extends BaseRactiveInterface {
  getProjects: { (): Promise<any> }
  setProjects: { (props: any): void }
}

declare let window: Window;

const Projects = BaseRactive.extend<ProjectsInterface>({
  components: {
    "delete-info-modal": DeleteInfoModal
  },
  template,
  data() {
    return {
      project_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setProjects(await this.getProjects());
      _super();
      resolve();
    });
  },

  handleClick(action, props, e) {
    let url = null;
    let _project_data = null;
    let _project_datas = this.get("project_datas");
    switch (action) {
      case 'DELETE_PROJECT':
        e.preventDefault();
        _project_data = _project_datas[props.index];
        let _deleteModalInfo: DeleteInfoModalInterface = this.findComponent("delete-info-modal");
        _deleteModalInfo.show(_project_data);
        break;
      case 'PAGE':
        url = window.projectRouter.buildUrl(props.url);
        window.projectRouter.navigate(url);
        break;
      case 'TO_PIPELINE':
        url = window.projectRouter.buildUrl(props.url);
        window.projectRouter.navigate(url);
        break;
    }
  },
  async getProjects() {
    try {
      let resData = await ProjectService.getProjects({});
      return resData;
    } catch (ex) {
      console.error("getProjects - ex :: ", ex);
    }
  },
  setProjects(props: any) {
    if (props == null) return;
    this.set("project_datas", props.return);
  }
});

export default Projects;