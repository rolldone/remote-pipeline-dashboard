import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";

declare let window: Window;

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/execution"
    })
      .get("/", async (req, context) => {
        let Excecution = (await import("./Executions")).default;
        new Excecution({
          target: "#index-body",
          req: req
        })
      })
      // Define the route matching a path with a callback
      .get('/new', async (req, context) => {
        // Handle the route here...
        let Excecution = (await import("./ExecutionNew")).default;
        new Excecution({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let Excecution = (await import("./ExecutionUpdate")).default;
        new Excecution({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.executionRouter = this.router;
  }
});