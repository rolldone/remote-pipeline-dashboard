import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";

declare let window: Window;

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig(){
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/pipeline"
    })
      .get("/", async (req, context) => {
        let Pipeline = (await import("./Pipelines")).default;
        new Pipeline({
          target: "#index-body",
          req: req
        })
      })
      // Define the route matching a path with a callback
      .get('/new', async (req, context) => {
        // Handle the route here...
        let Pipeline = (await import("./PipelineNew")).default;
        new Pipeline({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view/(.*)?', async (req, context) => {
        // Handle the route here...
        let Pipeline = (await import("./PipelineUpdate")).default;
        new Pipeline({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.pipelineRouter = this.router;
  }
})