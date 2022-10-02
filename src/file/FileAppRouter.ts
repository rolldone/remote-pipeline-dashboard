import { BrowserHistoryEngine, createRouter } from "routerjs";
import BaseRactive, { BaseRactiveInterface } from "../base/BaseRactive";
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

const File = BaseRactive.extend<BaseRactiveInterface>({
  data() {
    return {}
  },
  onconfig() {
    return new Promise(async (resolve: Function) => {
      this.router = createRouter({
        engine: BrowserHistoryEngine({ bindClick: false }),
        basePath: "/dashboard/file"
      })
        // Define the route matching a path with a callback
        .get('/', async (req, context) => {
          // Handle the route here...
          let Files = (await import("./Files")).default;
          new Files({
            target: "#index-body",
            req: req
          })
        })
        .get('/:id/view', async (req, context) => {
          let FileInfo = (await import("./FileInfo")).default;
          new FileInfo({
            target: "#index-body",
            req: req
          })
        })
        .run();

      window.fileRouter = this.router;
      resolve();
    });
  },
});

export default File;