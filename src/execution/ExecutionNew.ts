import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";
import template from './ExecutionNewView.html'
import Done from "./step/Done";
import SelectProject from "./step/SelectProject";
import SelectRepoPipelineItem from "./step/SelectRepoPipelineItem";
import SelectVariableHost from "./step/SelectVariableHost";
import SelectExeConfig from "./step/SelectExeConfig";
import StepChooseType from "./step/StepChooseType";
import SelectExeConfigGroup from "./step/group/SelectExeConfigGroup";
import DoneGroup from "./step/group/DoneGroup";

export interface ExecutionNewInterface extends BaseRactiveInterface {
  displayWizardStepPartial?: {
    (props: {
      [key: string]: any
      component: string
    }): void
  }
}
const url: URL = new URL(window.location.href);
const params: URLSearchParams = url.searchParams;

const ExecutionNew = BaseRactive.extend<ExecutionNewInterface>({
  components: {
    "step-group-one": SelectExeConfigGroup,
    "step-group-done": DoneGroup,
    "step-one": StepChooseType,
    "step-two": SelectProject,
    "step-three": SelectRepoPipelineItem,
    "step-four": SelectVariableHost,
    "step-five": SelectExeConfig,
    "done": Done
  },
  template,
  data() {
    return {
      form_data: {
        parent_id: params.get("parent_id")
      },
      pipeline_datas: [],
      host_datas: [],
      variable_datas: [],
    }
  },
  partials: {
    wizard_steps: []
  },
  onconstruct() {
    this.newOn = {
      onStepListener: (object, action, text, c) => {
        switch (action) {
          case 'CONTINUE':
            this.displayWizardStepPartial(text);
            break;
          case 'BACK':
            this.displayWizardStepPartial(text);
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      _super();
      this.displayWizardStepPartial({
        component: "step-one"
      })
      resolve();
    });
  },
  displayWizardStepPartial(props) {
    let _wizard_step_partial = []
    let _wizard_item = Ractive.parse(/* html */`
      <${props.component} form_data={{form_data}} on-listener="onStepListener"></${props.component}>
    `);
    _wizard_step_partial.push({
      ..._wizard_item.t[0]
    })
    this.resetPartial('wizard_steps', _wizard_step_partial);
  },
})

export default ExecutionNew;