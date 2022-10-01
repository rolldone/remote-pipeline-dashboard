import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";
import './Style.scss';
declare let window: Window;

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/queue-record"
    })
      // .get("/", async (req, context) => {
      //   let app = (await import("./QueueGroupRecords")).default;
      //   new app({
      //     target: "#index-body",
      //     req: req
      //   })
      // })
      // .get('/:id/view', async (req, context) => {
      //   // Handle the route here...
      //   let app = (await import("./QueueGroupRecordDetail")).default;
      //   new app({
      //     target: "#index-body",
      //     req: req
      //   })
      // })
      // .get("/job/:job_id", async (req, context) => {
      //   // Handle the route here...
      //   let app = (await import("./QueueRecordDetailDisplayData")).default;
      //   new app({
      //     target: "#index-body",
      //     req: req
      //   })
      // })
      .run();

    window.queueRecordRouter = this.router;
  }
});