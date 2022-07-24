import { BrowserHistoryEngine, createRouter } from "routerjs";
import BaseRactive, { BaseRactiveInterface } from "../base/BaseRactive";

declare let window: Window;

const File = BaseRactive.extend<BaseRactiveInterface>({
  data() {
    return {}
  },
  oncomplete() {
    return new Promise(async (resolve: Function) => {
      this.router = createRouter({
        engine: BrowserHistoryEngine({ bindClick: false }),
        basePath: "/dashboard/file"
      })
        // Define the route matching a path with a callback
        .get('/', async (req, context) => {
          // Handle the route here...
          let Files = (await import("./Files")).default;
          new Files({
            target: "#index-body",
            req: req
          })
        })
        .get('/:id/view', async (req, context) => {
          let FileInfo = (await import("./FileInfo")).default;
          new FileInfo({
            target: "#index-body",
            req: req
          })
        })
        .run();

      window.fileRouter = this.router;
      resolve();
    });
  },
});

export default File;