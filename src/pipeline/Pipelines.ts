import BaseRactive from "base/BaseRactive";
import template from './PipeLinesView.html';
import { BrowserHistoryEngine, createRouter, Router } from "routerjs";
import PipelineService from "services/PipelineService";

declare let window: Window;

const Pipelines = BaseRactive.extend({
  getPipelines() { },
  setPipelines(props) { }
});

export default Pipelines.extend({
  template,
  data() {
    return {
      pipeline_datas: []
    }
  },
  onconfig() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/pipeline"
    })
      .get("/", async (req, context) => { })
      // Define the route matching a path with a callback
      .get('/new', async (req, context) => {
        // Handle the route here...
        let Pipeline = (await import("./PipelineNew")).default;
        new Pipeline({
          target: "#index-body",
          req: req
        })
      })
      .get('/:id/view', async (req, context) => {
        // Handle the route here...
        let Pipeline = (await import("./PipelineUpdate")).default;
        new Pipeline({
          target: "#index-body",
          req: req
        })
      })
      .run();

    window.pipelineRouter = this.router;
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setPipelines(await this.getPipelines())
      resolve();
    });
  },
  async getPipelines() {
    try {
      let resData = await PipelineService.getPipelines({});
      return resData;
    } catch (ex) {
      console.log("getPipelines - ex :: ", ex);
    }
  },
  setPipelines(props) {
    if (props == null) return;
    this.set("pipeline_datas", props.return);
  }
});