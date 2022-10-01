import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { MasterDataInterface } from "base/MasterData";
import Ractive, { ParsedTemplate } from "ractive";
import TokenService from "./services/TokenService";
import DisplayResponse from "./step_client/DisplayReponse";
import SelectFiles from "./step_client/SelectFiles";
import SelectQueue from "./step_client/SelectQueue";
import template from './TestClientView.html';

export interface TestClientInterface extends BaseRactiveInterface {
  displayPartials?: { (): void }
  renderViewComponent?: { (whatComponent: string): ParsedTemplate }
  testApiKey?: { (): void }
}
declare let window: Window;

const TestClient = BaseRactive.extend<TestClientInterface>({
  template,
  components: {
    "select-files": SelectFiles,
    "select-queue": SelectQueue,
    "display-response": DisplayResponse
  },
  css:/* css */``,
  partials: {
    "step_partials": []
  },
  data() {
    return {
      select_step: -1,
      form_data: {
        api_key: ''
      }
    }
  },
  onconstruct() {
    this.newOn = {
      onWhatComponentListener: (c, action, text, e) => {
        switch (action) {
          case 'NEXT':
            this.set("select_step", text);
            break;
        }
        this.displayPartials();
      },
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      this.displayPartials();
      _super();
    })
  },
  displayPartials() {
    try {
      let _what_component = null;
      let _step_partials = []; // this.partials.step_partials;
      let _select_step = this.get("select_step");
      switch (_select_step) {
        case 1:
          _what_component = "select-files";
          break;
        case 2:
          _what_component = "select-queue";
          break;
        case 3:
          _what_component = "display-response";
          break;
        case 4:
          break;
      }
      let viewComponent = this.renderViewComponent(_what_component);
      console.log(viewComponent);
      _step_partials.push({
        ...viewComponent.t[0]
      })
      this.resetPartial("step_partials", _step_partials);
    } catch (ex) {
      console.error("displayPartials - ex :: ", ex);
    }
  },
  renderViewComponent(whatComponent) {
    return Ractive.parse(/* html */`
      <${whatComponent} on-listener="onWhatComponentListener" form_data="{{form_data}}"></${whatComponent}>
    `);
  },
  async handleClick(action, props, e) {
    let _form_data = this.get("form_data");
    switch (action) {
      case 'SUBMIT_API':
        e.preventDefault();
        this.testApiKey();
        break;
    }
  },
  async testApiKey() {
    try {
      let _form_data = this.get("form_data");
      let resData = await TokenService.getTokenByKey(_form_data.api_key);
      resData = resData.return;
      console.log("mvadlfkvm :: ", resData);
      if (resData == null) {
        alert("The api token is not match :(");
        return;
      }
      this.set("select_step", 1);
      let masterData: MasterDataInterface = window.masterData;
      masterData.saveData("api_key", _form_data.api_key);
      this.displayPartials();
    } catch (ex) {
      // alert("The api token is not match :(");
      console.error("testApiKey - ex :: ", ex);
    }
  }
});

export default TestClient;