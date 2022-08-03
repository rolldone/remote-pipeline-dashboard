import ExecutionService, { ExecutionServiceInterface } from "services/ExecutionService";
import ExecutionNew, { ExecutionNewInterface } from "./base/ExecutionNew";
import ExecutionUpdate, { ExecutionUpdateInterface } from "./base/ExecutionUpdate";
import template from './ExecutionWizardView.html';
import Done from "./step/Done";
import SelectRepoPipelineItem from "./step/SelectRepoPipelineItem";
import SelectVariableHost from "./step/SelectVariableHost";
import SelectExeConfigConfig from "./step/SelectExeConfigConfig";
import StepSelectProject from "./step/StepSelectProject";
import SelectExeConfigConfigGroup from "./step/SelectExeConfigConfigGroup";
import DoneGroup from "./step/DoneGroup";

export const ExecutionWizardNew = ExecutionNew.extend<ExecutionNewInterface>({
  components: {
    "step-one": StepSelectProject,
    "step-two": SelectRepoPipelineItem,
    "step-three": SelectVariableHost,
    "step-four": SelectExeConfigConfig,
    "step-four-group": SelectExeConfigConfigGroup,
    "done": Done,
    "done-group": DoneGroup
  },
  template,
  onconstruct() {
    this.newOn = {
      onStepListener: (object, action, text, c) => {
        switch (action) {
          case 'SUBMIT':
            this.fire("listener", action, text, c);
            break;
          case 'CONTINUE':
            this.displayWizardStepPartial(text);
            break;
          case 'BACK':
            this.displayWizardStepPartial(text);
            break;
        }
      }
    }
    this.reInitializeObserve();
  },
});

export const ExecutionWizardUpdate = ExecutionUpdate.extend<ExecutionUpdateInterface>({
  components: {
    "step-one": StepSelectProject,
    "step-two": SelectRepoPipelineItem,
    "step-three": SelectVariableHost,
    "step-four": SelectExeConfigConfig,
    "step-four-group": SelectExeConfigConfigGroup,
    "done": Done,
    "done-group": DoneGroup
  },
  template,
  onconstruct() {
    this.newOn = {
      onStepListener: (object, action, text, c) => {
        switch (action) {
          case 'SUBMIT':
            this.fire("listener", action, text, c);
            break;
          case 'CONTINUE':
            this.displayWizardStepPartial(text);
            break;
          case 'BACK':
            this.displayWizardStepPartial(text);
            break;
        }
      }
    }
    this.reInitializeObserve();
  },
  async getExecution() {
    let _form_data: ExecutionServiceInterface = this.get("form_data");
    try {
      let resData = await ExecutionService.getExecution({
        id: _form_data.id
      })
      return resData;
    } catch (ex) {
      console.error("getExecution - ex :: ", ex);
    }
  },
});

