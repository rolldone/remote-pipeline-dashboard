import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";
declare let window: Window;

export default BaseRactive.extend<BaseRactiveInterface>({
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/test-queue"
    })
      .get("/", async (req, context) => {
        let app = (await import("./test_queue/TestClient")).default;
        new app({
          target: "#index-body",
          req: req
        })
      })
      .get("/guest-side", async (req, context) => {
        let app = (await import("./test_queue/TestGuest")).default;
        new app({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.testClientRouter = this.router;
  }
});