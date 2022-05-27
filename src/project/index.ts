import { BrowserHistoryEngine, createRouter } from "routerjs";
import BaseRactive, { BaseRactiveInterface } from "../base/BaseRactive";
import template from './ProjectsView.html';

declare let window: Window;

interface ProjectInterface extends BaseRactiveInterface {
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
        .get('/', async (req, context) => {
          // Handle the route here...
          let Projects = (await import("./Projects")).default;
          new Projects({
            target: "#index-body",
            req: req
          })
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
      resolve();
    });
  },
});