import { BrowserHistoryEngine, createRouter } from "routerjs";
import BaseRactive from "../base/BaseRactive";
import template from './ProjectsView.html';

export default BaseRactive.extend({
  template: template,
  oncomplete() {
    this.router = createRouter({
      engine: BrowserHistoryEngine({ bindClick: false }),
      basePath: "/dashboard/project"
    })
      // Define the route matching a path with a callback
      .get('/', (req, context) => {
        // Handle the route here...

      })
      .get('/new', async (req, context) => {
        // Handle the route here...
        let ProjectNew = (await import("./ProjectNew")).default;
        new ProjectNew({
          target: "#index-body",
        })
      })
      .get('/update', async (req, context) => {
        let ProjectNew = (await import("./ProjectUpdate")).default;
        new ProjectNew({
          target: "#index-body",
        })
      })
      .run();
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'PAGE':
        let url = this.router.buildUrl(props.url);
        this.router.navigate(url);
        break;
    }
  },
});