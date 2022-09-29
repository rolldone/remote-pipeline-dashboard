import { BrowserHistoryEngine, createRouter } from "routerjs";
import BaseRactive, { BaseRactiveInterface } from "./base/BaseRactive";
import { MasterDataInterface } from "base/MasterData";
import { Router } from "routerjs";
import $ from 'jquery';

declare let window : Window;

declare global {
  interface Window {
    router: Router
    fileRouter: Router
    pipelineRouter: Router
    projectRouter: Router
    variableRouter: Router
    hostRouter: Router
    executionRouter: Router
    queueRecordRouter: Router
    webhookRouter: Router
    credentialRouter: Router
    queueRecordSchedulerRouter: Router
    userRouter: Router
    authRouter: Router
    testClientRouter: Router
    bootstrap: any
    websocket: WebSocket
    masterData: MasterDataInterface
    pubsub: any
    CKEDITOR: any
    ace: any
    $: JQueryStatic
    oo: any
  }
}

interface ProjectInterface extends BaseRactiveInterface {
}

export default BaseRactive.extend<ProjectInterface>({
  data() {
    return {
      project_datas: []
    }
  },
  onconfig(){
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/project"
    })
      // Define the route matching a path with a callback
      .get('/', async (req, context) => {
        // Handle the route here...
        let Projects = (await import("./project/Projects")).default;
        new Projects({
          target: "#index-body",
          req: req
        })
      })
      .get('/new', async (req, context) => {
        // Handle the route here...
        let ProjectNew = (await import("./project/ProjectNew")).default;
        new ProjectNew({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view', async (req, context) => {
        let ProjectNew = (await import("./project/ProjectUpdate")).default;
        new ProjectNew({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.projectRouter = this.router;
  }
});