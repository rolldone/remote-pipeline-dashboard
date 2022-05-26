import Step3, { Step3Interface } from "execution/step/Step3"

const Step2 = Step3.extend<Step3Interface>({
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

export default Step2;