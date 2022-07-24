import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './FileModalView.html';
import SelectFIles from "./SelectFiles";

export interface FileModalInterface extends BaseRactiveInterface {
  hide?: { (): void }
  show?: { (props): void }
  submitSelect?: { (): void }
}

let cancelFormDataChecks = null;
let myModal = null;

const FileModals = BaseRactive.extend<FileModalInterface>({
  template,
  components: {
    "file-explorer": SelectFIles
  },
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {}
    }
  },
  onconstruct() {
    this.newOn = {
      onFileExplorerListener: (c, action, props, e) => {
        debugger;
      }
    }
    this._super();
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        this.submitSelect();
        break;
    }
  },
  submitSelect() {
    try {
      let _form_data = this.get("form_data");
      let _select = _form_data.select;
      this.fire("listener", 'SUBMIT', _select, {});
    } catch (ex) {
      console.error("submitSelect - ex :: ", ex);
    }
  },
  hide() {
    myModal.hide();
    if (cancelFormDataChecks == null) return;
    cancelFormDataChecks.cancel();
  },
  async show(props) {
    // await this.set("form_data", {
    //   ...props,
    //   // Just for make sure 
    //   from_provider: props.from_provider,
    //   repo_name: props.repo_name,
    //   source_type: props.source_type
    // });
    cancelFormDataChecks = this.observe("form_data.select", (val) => {
      if (val == null) {
        return;
      }
    });
    let _id_element = this.get("id_element");
    myModal = new window.bootstrap.Modal(document.getElementById(_id_element), {
      keyboard: false
    });
    myModal.show();
  },
});

export default FileModals;