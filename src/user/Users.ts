import BaseRactive from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";
import template from './UsersView.html';

export default BaseRactive.extend({
  template,
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/user"
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