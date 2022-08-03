import { DoneInterface } from "execution/step/Done";
import Done from "./Done";

const DoneGroup = Done.extend<DoneInterface>({
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-four-group"
        }, e);
        return;
    }
    this._super(action, props, e);
  }
});

export default DoneGroup