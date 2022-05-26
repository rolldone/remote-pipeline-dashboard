import ExecutionNew, { ExecutionNewInterface } from "execution/ExecutionNew"
import ExecutionUpdate, { ExecutionUpdateInterface } from "execution/ExecutionUpdate";
import ExecutionService, { ExecutionServiceInterface } from "services/ExecutionService";
import template from './ExecutionWizardView.html';
import Done from "./step/Done";
import Step1 from "./step/Step1";
import Step2 from "./step/Step2";
import Step3 from "./step/Step3";

const ExecutionWizardNew = ExecutionNew.extend<ExecutionNewInterface>({
  components: {
    "step-one": Step1,
    "step-two": Step2,
    "step-three": Step3,
    "done": Done
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

const ExecutionWizardUpdate = ExecutionUpdate.extend<ExecutionUpdateInterface>({
  components: {
    "step-one": Step1,
    "step-two": Step2,
    "step-three": Step3,
    "done": Done
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

export default {
  ExecutionWizardNew,
  ExecutionWizardUpdate
};