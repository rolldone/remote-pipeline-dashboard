import { BrowserHistoryEngine, createRouter } from "routerjs";
import BaseRactive, { BaseRactiveInterface } from "../base/BaseRactive";
import { MasterDataInterface } from "base/MasterData";
import { Router } from "routerjs";
import $ from 'jquery';

declare let window: Window;

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
      basePath: "/dashboard/webhook"
    }).get('/', async (req, context) => {
      let webhooks = (await import("./Webhooks")).default;
      new webhooks({
        target: "#index-body",
      })
    })
      // Define the route matching a path with a callback
      .get('/new', async (req, context) => {
        // Handle the route here...
        let webhook = (await import("./WebhookNew")).default;
        new webhook({
          target: "#index-body",
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let webhook = (await import("./WebhookUpdate")).default;
        new webhook({
          target: "#index-body",
          req: req
        })
      })
      .get("/:id/histories", async (req, context) => {
        // Handle the route here...
        let webhook = (await import("./WebhookHistories")).default;
        new webhook({
          target: "#index-body",
          req: req
        })
      })
      .run();
    window.webhookRouter = this.router
  }
});
