import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";

declare let window: Window

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/variable"
    })
      .get("/", async (req, context) => {
        let Variable = (await import("./Variables")).default;
        let gg = new Variable({
          target: "#index-body",
          req: req
        })
      })
      // Define the route matching a path with a callback
      .get('/new', async (req, context) => {
        // Handle the route here...
        let Variable = (await import("./VariableNew")).default;
        new Variable({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let Variable = (await import("./VariableUpdate")).default;
        new Variable({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.variableRouter = this.router;
  }
});