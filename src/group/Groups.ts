import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";
import template from './GroupsView.html';

export default BaseRactive.extend<BaseRactiveInterface>({
  template,
  oncomplete() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/group"
    })
      // Define the route matching a path with a callback
      .get('/', (req, context) => {
        // Handle the route here...

      })
      .get('/new', async (req, context) => {
        // Handle the route here...
        let ProjectNew = (await import("./GroupNew")).default;
        new ProjectNew({
          target: "#content",
        })
      })
      .get('/update', async (req, context) => {
        let ProjectNew = (await import("./GroupUpdate")).default;
        new ProjectNew({
          target: "#content",
        })
      })
      .run();
  }
});