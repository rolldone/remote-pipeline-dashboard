import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";

declare let window: Window;

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/host"
    })
      .get("/", async (req, context) => {
        let Host = (await import("./Hosts")).default;
        new Host({
          target: "#index-body",
          req: req
        })
      })
      // Define the route matching a path with a callback
      .get('/new', async (req, context) => {
        // Handle the route here...
        let Host = (await import("./HostNew")).default;
        new Host({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let Host = (await import("./HostUpdate")).default;
        new Host({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.hostRouter = this.router;
  }
});