import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";

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
      .get("/:id/histories",async(req,context)=>{
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
