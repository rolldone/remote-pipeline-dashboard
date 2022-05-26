import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive, { ParsedTemplate } from "ractive";
import { ExecutionInterface } from "services/ExecutionService";
import template from './ExecutionTestWizardModalView.html';
import ExecutionWizard from "./ExecutionWizard";

export interface ExecutionTestWizardModalInterface extends BaseRactiveInterface {
  show: { (props: ExecutionInterface): void }
  hide: { (): void }
  displayExecutionPartial?: { (): void }
  renderExecutionPartialView?: { (props: ExecutionInterface): ParsedTemplate }
}

let myModal = null;

const ExecutionTestWizardModal = BaseRactive.extend<ExecutionTestWizardModalInterface>({
  partials: {
    "display_execution_partial": []
  },
  components: {
    "execution-new": ExecutionWizard.ExecutionWizardNew,
    "execution-update": ExecutionWizard.ExecutionWizardUpdate
  },
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {}
    }
  },
  onconstruct() {
    this.newOn = {
      onExecutionWizardListener: (c, action, text, e) => {
        switch (action) {
          case 'SUBMIT':
            this.fire("listener", "SUBMIT", {}, null);
            break;
        }
      }
    }
    this._super();
  },
  show(props) {
    this.set("form_data", props);
    let _id_element = this.get("id_element");
    var _trrr = document.getElementById(_id_element);
    myModal = new window.bootstrap.Modal(_trrr, {
      backdrop: 'static',
      keyboard: false
    });
    myModal.show();
    this.displayExecutionPartial();
  },
  hide() {
    myModal.hide();
  },
  displayExecutionPartial() {
    let _form_data: ExecutionInterface = this.get("form_data");
    let _display_execution_partial = [];
    let _template = this.renderExecutionPartialView(_form_data);
    _display_execution_partial.push({
      ..._template.t[0]
    })
    this.resetPartial("display_execution_partial", [
      ..._display_execution_partial
    ]);
  },
  renderExecutionPartialView(props) {
    if (props.id == null) {
      return Ractive.parse(/* html */`
        <execution-new form_data={{form_data}} on-listener="onExecutionWizardListener"></execution-new>
      `)
    }
    return Ractive.parse(/* html */`
      <execution-update form_data={{form_data}} on-listener="onExecutionWizardListener"></execution-update>
    `);
  }
});

export default ExecutionTestWizardModal;