import BaseRactive, { BaseRactiveInterface } from "./base/BaseRactive";
import { BrowserHistoryEngine, createRouter, Router } from 'routerjs';
import '@tabler/core/dist/js/tabler';
import "@tabler/core/dist/css/tabler.css";
import "./indexStyle.scss";
import 'simple-notify/dist/simple-notify.min.css'
import template from './indexView.html';
import $ from 'jquery';
import MasterData, { MasterDataInterface } from "base/MasterData";
import PubSub from "base/PubSub";
import 'url-change-event';

declare global {
  interface Window {
    router: Router
    pipelineRouter: Router
    projectRouter: Router
    variableRouter: Router
    hostRouter: Router
    executionRouter: Router
    queueRecordRouter: Router
    webhookRouter: Router
    queueRecordSchedulerRouter: Router
    userRouter: Router
    authRouter: Router
    bootstrap: any
    websocket: WebSocket
    masterData: MasterDataInterface
    pubsub: any
    CKEDITOR: any
    ace: any
    $: JQueryStatic
  }
}

const sideMenuSelected = () => {
  setTimeout(() => {
    var els = document.querySelectorAll(`a[href='${window.location.pathname}']`);
    for (var a = 0; a < els.length; a++) {
      els[a].classList.add("active");
      let _parentNode = els[a].parentElement;
      let stop = false;
      while (stop == false) {
        _parentNode = _parentNode.parentElement;
        if (_parentNode.className.includes("navbar-nav") == true) {
          stop = true;
        } else {
          _parentNode.classList.add("active");
          stop = false
        }
      }
      // _parentNode.classList.add("active");
      // _parentNode.parentElement.parentElement.parentElement.classList.add("active");
    }
  }, 1000);
}

addEventListener('urlchangeevent', function (e: any) {
  // your code here
  // debugger;
  setTimeout(() => {
    console.log("Back detected use urlchangeevent for reload the location")
    // window.location.reload();
    console.log(e);
    if (e.newURL == null) {
      window.masterData.saveData("backstateevent", e.oldURL);
    }
    sideMenuSelected();
  }, 100);
})

export default function () {
  window.pubsub = PubSub;
  window.masterData = MasterData;
  window.$ = $;
  sideMenuSelected();
  const App = BaseRactive.extend<BaseRactiveInterface>({
    template,
    target: "#app",
    data() {
      return {
        test: "Hellow word",
        auth: {}
      }
    },
    router: null,
    onconfig() {
      // Create the instance of your router
      this.router = createRouter({
        engine: BrowserHistoryEngine({ bindClick: false }),
        basePath: "/dashboard"
      })
        // Define the route matching a path with a callback
        .get('', async (req, context) => {
          // Handle the route here...
          let Dashboard = (await import("./dashboard/Dashboard")).default;
          new Dashboard({
            target: "#index-body",
          })
        })
        .get('/project/(.*)?', async (req, context) => {
          let Projects = (await import("./project")).default;
          new Projects({
            target: "#index-body",
          })
        })
        .get("/group/(.*)?", async (req, context) => {
          let Groups = (await import("./group/Groups")).default;
          new Groups({
            target: "#index-body"
          })
        })
        .get("/pipeline/(.*)?", async (req, context) => {
          let Pipelines = (await import("./pipeline")).default;
          new Pipelines({
            target: "#index-body"
          })
        })
        .get("/variable/(.*)?", async (req, context) => {
          let Variables = (await import("./variable")).default;
          new Variables({
            target: "#index-body"
          })
        })
        .get('/host/(.*)?', async (req, context) => {
          let Host = (await import("./host")).default;
          new Host({
            target: "#index-body",
          })
        })
        .get("/execution/(.*)?", async (req, context) => {
          let Execution = (await import("./execution")).default;
          new Execution({
            target: "#index-body"
          })
        })
        .get("/queue-record/(.*)?", async (req, context) => {
          let queue_record = (await import("./queue_record")).default;
          new queue_record({
            target: "#index-body"
          })
        })
        .get("/queue-record-scheduler/(.*)?", async (req, context) => {
          let queue_record = (await import("./queue_record_scheduler")).default;
          new queue_record({
            target: "#index-body"
          })
        })
        .get("/webhook/(.*)?", async (req, context) => {
          let webhook = (await import("./webhook")).default;
          new webhook({
            target: "#index-body"
          })
        })
        .get("/user/(.*)?", async (req, context) => {
          let User = (await import("./user/index")).default;
          new User({
            target: "#index-body"
          })
        })
        .get("/login", async (req, context) => {
          let Auth = (await import("./auth/Login")).default;
          new Auth({
            target: "#app"
          })
        })
        .get("/logout", async (req, context) => {
          let Auth = (await import("./auth/Logout")).default;
          new Auth({
            target: "#app"
          })
        })
        .get("/register", async (req, context) => {
          let Auth = (await import("./auth/Register")).default;
          new Auth({
            target: "#app"
          })
        })
        .get("/profile", async (req, context) => {
          let Auth = (await import("./auth/Profile")).default;
          new Auth({
            target: "#app"
          })
        })
        .get("/forgot-password", async (req, context) => {
          let Auth = (await import("./auth/ForgotPassword")).default;
          new Auth({
            target: "#app"
          })
        })
        // Calling "run" will execute handlers immediately for the current url.
        // You can avoid calling it and wait for the next route change instead.
        .run();

      window.router = this.router;



    },
    handleClick(action, props, e) {
      switch (action) {
        case 'PAGE':
          this.router.navigate(this.router.buildUrl(props.url));
          break;
      }
    },
    on: {
    }
  });

  return new App();
}