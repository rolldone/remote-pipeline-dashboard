import { BrowserHistoryEngine, createRouter } from "routerjs";
import ProjectService from "services/ProjectService";
import BaseRactive, { BaseRactiveInterface } from "../base/BaseRactive";
import template from './ProjectsView.html';

interface ProjectsInterface extends BaseRactiveInterface {
  getProjects: { (): Promise<any> }
  setProjects: { (props: any): void }
}

const Projects = BaseRactive.extend<ProjectsInterface>({
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
    switch (action) {
      case 'PAGE':
        url = this.router.buildUrl(props.url);
        this.router.navigate(url);
        break;
      case 'TO_PIPELINE':
        url = this.router.buildUrl(props.url);
        this.router.navigate(url);
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