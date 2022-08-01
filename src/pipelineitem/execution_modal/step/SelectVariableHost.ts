import SelectVariableHostIndex, { SelectVariableHostInterface } from "execution/step/SelectVariableHost"

const SelectVariableHost = SelectVariableHostIndex.extend<SelectVariableHostInterface>({
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-one"
        }, e);
        return;
      case 'CONTINUE':
        e.preventDefault();
        this.set("form_data.host_ids", this.get("host_ids") || []);
        console.log(this.get("form_data"));
        this.fire("listener", action, {
          component: "step-three"
        }, e);
        return;
    }
    this._super(action, props, e);
  }
});

export default SelectVariableHost;