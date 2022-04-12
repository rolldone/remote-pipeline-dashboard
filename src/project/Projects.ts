import Ractive from "ractive";
import { BrowserHistoryEngine, createRouter } from "routerjs";
import ProjectService from "services/ProjectService";
import BaseRactive, { BaseRactiveInterface } from "../base/BaseRactive";
import template from './ProjectsView.html';

declare let window: Window;

interface ProjectInterface extends BaseRactiveInterface {
  getProjects: { (): Promise<any> }
  setProjects: { (props: any): void }
}

export default BaseRactive.extend<ProjectInterface>({
  template,
  data() {
    return {
      project_datas: []
    }
  },
  oncomplete() {
    return new Promise(async (resolve: Function) => {
      this.router = createRouter({
        engine: BrowserHistoryEngine({ bindClick: false }),
        basePath: "/dashboard/project"
      })
        // Define the route matching a path with a callback
        .get('/', (req, context) => {
          // Handle the route here...

        })
        .get('/new', async (req, context) => {
          // Handle the route here...
          let ProjectNew = (await import("./ProjectNew")).default;
          new ProjectNew({
            target: "#index-body",
            req: req
          })
        })
        .get('/:id/view', async (req, context) => {
          let ProjectNew = (await import("./ProjectUpdate")).default;
          new ProjectNew({
            target: "#index-body",
            req: req
          })
        })
        .run();

      window.projectRouter = this.router;

      this.setProjects(await this.getProjects());
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