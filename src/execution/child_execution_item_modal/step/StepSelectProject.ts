import SelectProjectIndex, { SelectProjectInterface } from "execution/step/SelectProject";
import ExecutionService from "services/ExecutionService";


export interface Step1Interface extends SelectProjectInterface { }

const StepSelectProject = SelectProjectIndex.extend<Step1Interface>({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      let _form_data = this.get("form_data");
      switch (_form_data.execution_type) {
        case ExecutionService.EXECUTION_TYPE.GROUP:
          return this.fire("listener", 'CONTINUE', {
            component: "step-four"
          });
      }
      resolve();
    });
  },
});

export default StepSelectProject;