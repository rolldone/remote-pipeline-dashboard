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
import UserService from "services/UserService";
import ConfigurationService from "services/ConfigurationService";
import loadjs from 'loadjs';

declare global {
  interface Window {
    router: Router
    fileRouter: Router
    pipelineRouter: Router
    projectRouter: Router
    variableRouter: Router
    hostRouter: Router
    executionRouter: Router
    queueRecordRouter: Router
    webhookRouter: Router
    credentialRouter: Router
    queueRecordSchedulerRouter: Router
    userRouter: Router
    authRouter: Router
    testClientRouter: Router
    bootstrap: any
    websocket: WebSocket
    masterData: MasterDataInterface
    pubsub: any
    CKEDITOR: any
    ace: any
    $: JQueryStatic
    oo: any
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


export interface IndexInterface extends BaseRactiveInterface {
  getConfig?: { (): Promise<any> }
  setConfig?: { (props: any): void }
}

export default function (props?: IndexInterface) {
  window.pubsub = PubSub;
  window.masterData = MasterData;
  window.$ = $;
  sideMenuSelected();
  const App = BaseRactive.extend<IndexInterface>({
    template,
    target: "#app",
    data() {
      return {
        test: "Hellow word",
        auth: {}
      }
    },
    css: /* css */``,
    router: null,
    onconfig() {
      let _super = this._super.bind(this);
      return new Promise((resolve: Function) => {
        Promise.all([
          this.getConfig(),
          createRouter({
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
            .get('/file/(.*)?', async (req, context) => {
              // let Files = (await import("./file")).default;
              // new Files({
              //   target: "#index-body"
              // })
              loadjs([
                '/public/dashboard/file/FileApp.js',
              ], 'FileApp', {
                before: function (path, scriptEl) { /* execute code before fetch */ },
                async: true,  // load files synchronously or asynchronously (default: true)
                numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
                returnPromise: false  // return Promise object (default: false)
              })
              loadjs.ready('FileApp', {
                success: function () {
                  // resolve(client());
                },
                error: function (err) {
                }
              })
            })
            .get('/project/(.*)?', async (req, context) => {
              // let Projects = (await import("./project")).default;
              // new Projects({
              //   target: "#index-body",
              // })
              loadjs([
                '/public/dashboard/project/ProjectApp.js',
              ], 'ProjectApp', {
                before: function (path, scriptEl) { /* execute code before fetch */ },
                async: true,  // load files synchronously or asynchronously (default: true)
                numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
                returnPromise: false  // return Promise object (default: false)
              })
              loadjs.ready('ProjectApp', {
                success: function () {
                  // resolve(client());
                },
                error: function (err) {
                }
              })
            })
            .get("/group/(.*)?", async (req, context) => {
              let Groups = (await import("./group/Groups")).default;
              new Groups({
                target: "#index-body"
              })
            })
            .get("/pipeline/(.*)?", async (req, context) => {
              // let Pipelines = (await import("./pipeline")).default;
              // new Pipelines({
              //   target: "#index-body"
              // })
              loadjs([
                '/public/dashboard/pipeline/PipelineApp.js',
              ], 'PipelineApp', {
                before: function (path, scriptEl) { /* execute code before fetch */ },
                async: true,  // load files synchronously or asynchronously (default: true)
                numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
                returnPromise: false  // return Promise object (default: false)
              })
              loadjs.ready('PipelineApp', {
                success: function () {
                  // resolve(client());
                },
                error: function (err) {
                }
              })
            })
            .get("/variable/(.*)?", async (req, context) => {
              // let Variables = (await import("./variable")).default;
              // new Variables({
              //   target: "#index-body"
              // })
              loadjs([
                '/public/dashboard/variable/VariableApp.js',
              ], 'VariableApp', {
                before: function (path, scriptEl) { /* execute code before fetch */ },
                async: true,  // load files synchronously or asynchronously (default: true)
                numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
                returnPromise: false  // return Promise object (default: false)
              })
              loadjs.ready('VariableApp', {
                success: function () {
                  // resolve(client());
                },
                error: function (err) {
                }
              })
            })
            .get('/host/(.*)?', async (req, context) => {
              // let Host = (await import("./host")).default;
              // new Host({
              //   target: "#index-body",
              // })
              loadjs([
                '/public/dashboard/host/HostApp.js',
              ], 'HostApp', {
                before: function (path, scriptEl) { /* execute code before fetch */ },
                async: true,  // load files synchronously or asynchronously (default: true)
                numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
                returnPromise: false  // return Promise object (default: false)
              })
              loadjs.ready('HostApp', {
                success: function () {
                  // resolve(client());
                },
                error: function (err) {
                }
              })
            })
            .get("/execution/(.*)?", async (req, context) => {
              // let Execution = (await import("./execution")).default;
              // new Execution({
              //   target: "#index-body"
              // })
              loadjs([
                '/public/dashboard/execution/ExecutionApp.js',
              ], 'ExecutionApp', {
                before: function (path, scriptEl) { /* execute code before fetch */ },
                async: true,  // load files synchronously or asynchronously (default: true)
                numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
                returnPromise: false  // return Promise object (default: false)
              })
              loadjs.ready('ExecutionApp', {
                success: function () {
                  // resolve(client());
                },
                error: function (err) {
                }
              })
            })
            .get("/queue-record/(.*)?", async (req, context) => {
              // let queue_record = (await import("./queue_record")).default;
              // new queue_record({
              //   target: "#index-body"
              // })
              loadjs([
                '/public/dashboard/queue_record/QueueRecordApp.js',
              ], 'QueueRecordApp', {
                before: function (path, scriptEl) { /* execute code before fetch */ },
                async: true,  // load files synchronously or asynchronously (default: true)
                numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
                returnPromise: false  // return Promise object (default: false)
              })
              loadjs.ready('QueueRecordApp', {
                success: function () {
                  // resolve(client());
                },
                error: function (err) {
                }
              })
            })
            .get("/queue-record-scheduler/(.*)?", async (req, context) => {
              // let queue_record = (await import("./queue_record_scheduler")).default;
              // new queue_record({
              //   target: "#index-body"
              // })
              loadjs([
                '/public/dashboard/queue_record/QueueRecordSchedulerApp.js',
              ], 'QueueRecordSchedulerApp', {
                before: function (path, scriptEl) { /* execute code before fetch */ },
                async: true,  // load files synchronously or asynchronously (default: true)
                numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
                returnPromise: false  // return Promise object (default: false)
              })
              loadjs.ready('QueueRecordSchedulerApp', {
                success: function () {
                  // resolve(client());
                },
                error: function (err) {
                }
              })
            })
            .get("/webhook/(.*)?", async (req, context) => {
              // let webhook = (await import("./webhook")).default;
              // new webhook({
              //   target: "#index-body"
              // })
              loadjs([
                '/public/dashboard/webhook/WebhookApp.js',
              ], 'WebhookApp', {
                before: function (path, scriptEl) { /* execute code before fetch */ },
                async: true,  // load files synchronously or asynchronously (default: true)
                numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
                returnPromise: false  // return Promise object (default: false)
              })
              loadjs.ready('WebhookApp', {
                success: function () {
                  // resolve(client());
                },
                error: function (err) {
                }
              })
            })
            .get("/credential/(.*)?", async (req, context) => {
              let credential = (await import("./credential")).default;
              new credential({
                target: "#index-body"
              })
            })
            .get("/user/(.*)?", async (req, context) => {
              let User = (await import("./user/index")).default;
              new User({
                target: "#index-body"
              })
            })
            .get("/test-queue", async (req, context) => {
              // let Auth = (await import("./test_queue")).default;
              // new Auth({
              //   target: "#index-body",
              //   req: req
              // })
              loadjs([
                '/public/dashboard/test_queue/TestQueueApp.js',
              ], 'TestQueueApp', {
                before: function (path, scriptEl) { /* execute code before fetch */ },
                async: true,  // load files synchronously or asynchronously (default: true)
                numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
                returnPromise: false  // return Promise object (default: false)
              })
              loadjs.ready('TestQueueApp', {
                success: function () {
                  // resolve(client());
                },
                error: function (err) {
                }
              })
            })
            .get("/login", async (req, context) => {
              let Auth = (await import("./auth/Login")).default;
              new Auth({
                target: "#app",
                req: req
              })
            })
            .get("/login-page-publisher", async (req, context) => {
              let Auth = (await import("./auth/LoginPagePublisher")).default;
              new Auth({
                target: "#app",
                req: req
              })
            })
            .get("/logout", async (req, context) => {
              let Auth = (await import("./auth/Logout")).default;
              new Auth({
                target: "#app",
                req: req
              })
            })
            .get("/register", async (req, context) => {
              let Auth = (await import("./auth/Register")).default;
              new Auth({
                target: "#app",
                req: req
              })
            })
            .get("/profile", async (req, context) => {
              let Auth = (await import("./auth/Profile")).default;
              new Auth({
                target: "#app",
                req: req
              })
            })
            .get("/forgot-password", async (req, context) => {
              let Auth = (await import("./auth/ForgotPassword")).default;
              new Auth({
                target: "#app",
                req: req
              })
            })
            // Calling "run" will execute handlers immediately for the current url.
            // You can avoid calling it and wait for the next route change instead.
            .run()])
          .then((props: Array<any>) => {
            // Save the configuration
            window.masterData.saveData("configuration", props[0].return);
            // Create the instance of your router
            window.router = props[1];
          });

        _super();
        resolve();
      })

    },
    handleClick(action, props, e) {
      switch (action) {
        case 'PAGE':
          this.router.navigate(this.router.buildUrl(props.url));
          break;
      }
    },
    async getConfig() {
      try {
        let resData = await ConfigurationService.getConfiguration();
        return resData;
      } catch (ex) {
        console.error("getConfig - ex :: ", ex);
      }
    },
    setConfig(props: any) {
      if (props == null) return;
      return props.return;
    },
    on: {
    }
  });

  return App.extend(props);
}