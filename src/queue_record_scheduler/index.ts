import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";

declare let window: Window;

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/queue-record-scheduler"
    })
      .get("/", async (req, context) => {
        let Excecution = (await import("./QueueRecordSchedulers")).default;
        new Excecution({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let Excecution = (await import("./QueueRecordScheluderDetail")).default;
        new Excecution({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.queueRecordSchedulerRouter = this.router;
  }
});