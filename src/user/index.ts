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
      .get('/personal-access-token', async (req, context) => {
        // Handle the route here...
        let User = (await import("./personal_access_token/PersonalAccessTokens")).default;
        new User({
          target: "#index-body",
          req: req
        })
      })
      .get('/personal-access-token/new', async (req, context) => {
        // Handle the route here...
        let User = (await import("./personal_access_token/PersonalAccessTokenNew")).default;
        new User({
          target: "#index-body",
          req: req
        })
      })
      .get('/personal-access-token/:id/view', async (req, context) => {
        // Handle the route here...
        let User = (await import("./personal_access_token/PersonalAccessTokenUpdate")).default;
        new User({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let User = (await import("./UserUpdate")).default;
        new User({
          target: "#index-body",
          req: req
        })
      })
      .get("/self", async (req, context) => {
        // Handle the route here...
        let User = (await import("./UserSelf")).default;
        new User({
          target: "#index-body",
          req: req
        })
      })
      .run();
    window.userRouter = this.router
  }
});
