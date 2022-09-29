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

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/queue-record-scheduler"
    })
      .get("/", async (req, context) => {
        let Excecution = (await import("./queue_record_scheduler/QueueRecordSchedulers")).default;
        new Excecution({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let Excecution = (await import("./queue_record_scheduler/QueueRecordScheluderDetail")).default;
        new Excecution({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.queueRecordSchedulerRouter = this.router;
  }
});