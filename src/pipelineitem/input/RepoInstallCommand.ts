import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import BasicCommand, { BasicCommandInterface } from "./BasicCommand";
import template from './RepoInstallCommandView.html';

export interface RepoTransferCommandInterface extends BasicCommandInterface {

}

const RepoTransferCommand = BasicCommand.extend<RepoTransferCommandInterface>({
  template,
  data() {
    return {
      form_data: {
        data: {
          exclude: "*",
          include: "*/",
          method_type: "rsync",
          transfer_mode: "soft"
        }
      }
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'TRANSFER_MODE':
        e.preventDefault();
        this.set("form_data.data.transfer_mode", props.value);
        return;
      case 'METHOD_TYPE':
        e.preventDefault();
        this.set("form_data.data.method_type", props.value);
        break;
    }
  }
});

export default RepoTransferCommand;