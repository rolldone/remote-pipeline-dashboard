import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { BrowserHistoryEngine, createRouter } from "routerjs";
import MasterData, { MasterDataInterface } from "base/MasterData";
import PubSub from "base/PubSub";
import { Router } from "routerjs";
import $ from 'jquery';
import '@tabler/core/dist/js/tabler';
import "@tabler/core/dist/css/tabler.css";
import "./indexStyle.scss";
import 'simple-notify/dist/simple-notify.min.css'

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

export default BaseRactive.extend<BaseRactiveInterface>({
  async onconfig() { 
    window.pubsub = PubSub;
    window.masterData = MasterData;
    window.$ = $;
    let app = (await import("./TestClient")).default;
    new app({
      target: "#app",
    })
  },
  async oncomplete(){
  }
});