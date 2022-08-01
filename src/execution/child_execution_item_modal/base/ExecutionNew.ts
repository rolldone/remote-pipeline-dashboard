import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";


export interface ExecutionNewInterface extends BaseRactiveInterface {
  displayWizardStepPartial?: {
    (props: {
      [key: string]: any
      component: string
    }): void
  }
}

const ExecutionNew = BaseRactive.extend<ExecutionNewInterface>({
  template: /* html */`
    {{> wizard_steps}}
  `,
  data() {
    return {
      form_data: {},
      pipeline_datas: [],
      host_datas: [],
      variable_datas: []
    }
  },
  partials: {
    wizard_steps: []
  },
  onconstruct() {
    this.newOn = {
      onStepListener: (object, action, text, c) => {
        switch (action) {
          case 'CONTINUE':
            this.displayWizardStepPartial(text);
            break;
          case 'BACK':
            this.displayWizardStepPartial(text);
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      _super();
      this.displayWizardStepPartial({
        component: "step-one"
      })
      resolve();
    });
  },
  displayWizardStepPartial(props) {
    let _wizard_step_partial = []
    let _wizard_item = Ractive.parse(/* html */`
      <${props.component} form_data={{form_data}} on-listener="onStepListener"></${props.component}>
    `);
    _wizard_step_partial.push({
      ..._wizard_item.t[0]
    })
    this.resetPartial('wizard_steps', _wizard_step_partial);
  },

});

export default ExecutionNew;