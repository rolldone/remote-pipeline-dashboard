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
            component: "step-four-group"
          });
      }
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        // this.fire("listener",action,props,e);
        break;
      case 'CONTINUE':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-two",
        }, e);
        break;
    }
  },
});

export default StepSelectProject;