import { BaseRactiveInterface } from "base/BaseRactive";
import SelectExeConfigIndex from "execution/step/SelectExeConfig"

const SelectExeConfig = SelectExeConfigIndex.extend<BaseRactiveInterface>({
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-three"
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

export default SelectExeConfig;