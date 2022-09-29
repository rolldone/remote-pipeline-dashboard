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

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/variable"
    })
      .get("/", async (req, context) => {
        let Variable = (await import("./variable/Variables")).default;
        let gg = new Variable({
          target: "#index-body",
          req: req
        })
      })
      // Define the route matching a path with a callback
      .get('/new', async (req, context) => {
        // Handle the route here...
        let Variable = (await import("./variable/VariableNew")).default;
        new Variable({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let Variable = (await import("./variable/VariableUpdate")).default;
        new Variable({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.variableRouter = this.router;
  }
});