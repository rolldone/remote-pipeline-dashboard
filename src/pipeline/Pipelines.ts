import BaseRactive from "base/BaseRactive";
import template from './PipeLinesView.html';
import { BrowserHistoryEngine, createRouter } from "routerjs";

export default BaseRactive.extend({
  template,
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/pipeline"
    })
      // Define the route matching a path with a callback
      .get('/new', async (req, context) => {
        // Handle the route here...
        let Pipeline = (await import("./PipelineNew")).default;
        new Pipeline({
          target: "#index-body",
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let Pipeline = (await import("./PipelineUpdate")).default;
        new Pipeline({
          target: "#index-body",
        })
      })
      .run();
  }
});