import { BaseRactiveInterface } from "base/BaseRactive";
import { MasterDataInterface } from "base/MasterData";
import { Router } from "routerjs";
import $ from 'jquery';

declare let window : Window;

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

var app = async () => {
  var index = (await import("./TestQueueAppRouter")).default;
  let theApp = new index({
    css: /* css */``,
  })
  // let gg = new theApp();
  // console.log("aaaaaaaaaaaaaaa :: ",gg.toHTML());
  // console.log("aaaaaaaaaaaaaaa :: ",gg.toCSS());
  return {
    css: theApp.toCSS(),
    html: theApp.toHTML(),
    theApp
  }
}

app().then((result) => {
  // console.log(result.html);
  // console.log(result.css);
});

