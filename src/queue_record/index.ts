import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";

declare let window: Window;

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/queue-record"
    })
      .get("/", async (req, context) => {
        let Excecution = (await import("./QueueRecords")).default;
        new Excecution({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let Excecution = (await import("./QueueRecordDetail")).default;
        new Excecution({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.queueRecordRouter = this.router;
  }
});