import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/user"
    }).get('/', async (req, context) => {
      let User = (await import("./Users")).default;
      new User({
        target: "#index-body",
      })
    })
      // Define the route matching a path with a callback
      .get('/new', async (req, context) => {
        // Handle the route here...
        let User = (await import("./UserNew")).default;
        new User({
          target: "#index-body",
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let User = (await import("./UserUpdate")).default;
        new User({
          target: "#index-body",
        })
      })
      .run();
  }
});
