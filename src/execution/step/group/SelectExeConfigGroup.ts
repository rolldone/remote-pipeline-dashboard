import { BaseRactiveInterface } from "base/BaseRactive";
import SelectExeConfigIndex from "../SelectExeConfig";

const SelectExeConfigGroup = SelectExeConfigIndex.extend<BaseRactiveInterface>({

  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-choose-type"
        }, e);
        break;
      case 'CONTINUE':
        e.preventDefault();
        this.set("form_data.host_ids", this.get("host_ids") || []);
        this.fire("listener", action, {
          component: "step-group-done"
        }, e);
        break;
    }
  },
});

export default SelectExeConfigGroup;