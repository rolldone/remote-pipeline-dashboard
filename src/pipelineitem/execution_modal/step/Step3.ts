import { BaseRactiveInterface } from "base/BaseRactive";
import Step4 from "execution/step/Step4"

const Step3 = Step4.extend<BaseRactiveInterface>({
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-two"
        }, e);
        return;
      case 'CONTINUE':
        e.preventDefault();
        this.fire("listener", action, {
          component: "done"
        }, e);
        return;
    }
    this._super(action, props, e);
  }

});

export default Step3;