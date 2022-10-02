import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";
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

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig(){
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/pipeline"
    })
      .get("/", async (req, context) => {
        let Pipeline = (await import("./Pipelines")).default;
        new Pipeline({
          target: "#index-body",
          req: req
        })
      })
      // Define the route matching a path with a callback
      .get('/new', async (req, context) => {
        // Handle the route here...
        let Pipeline = (await import("./PipelineNew")).default;
        new Pipeline({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view/(.*)?', async (req, context) => {
        // Handle the route here...
        let Pipeline = (await import("./PipelineUpdate")).default;
        new Pipeline({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.pipelineRouter = this.router;
  }
})