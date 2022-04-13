import BaseRactive, { BaseRactiveInterface } from "./base/BaseRactive";
import { BrowserHistoryEngine, createRouter, Router } from 'routerjs';
import '@tabler/core/dist/js/tabler';
import "@tabler/core/dist/css/tabler.css";
import "./style.scss";
import template from './indexView.html';
import $ from 'jquery';

declare global {
  interface Window {
    router: Router;
    pipelineRouter: Router,
    projectRouter: Router,
    variableRouter: Router
    $: JQueryStatic
  }
}

export default function () {
  
  window.$ = $;

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
          let Projects = (await import("./project/Projects")).default;
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
        .get("/execution/(.*)?", async (req, context) => {
          let Execution = (await import("./execution/Executions")).default;
          new Execution({
            target: "#index-body"
          })
        })
        .get("/user/(.*)?", async (req, context) => {
          let User = (await import("./user/Users")).default;
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
      setTimeout(() => {
        this.set("test", "aaaaaaaaaaaaaaaa");
        
      }, 4000);
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