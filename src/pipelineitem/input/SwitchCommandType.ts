import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";

export default BaseRactive.extend<BaseRactiveInterface>({
  template: /* html */`
    <div class="dropdown">
      <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
        <svg class="icon icon-tabler icon-tabler-settings" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path> <circle cx="12" cy="12" r="3"></circle></svg> 
      </button> 
      <div class="dropdown-menu">
        {{#command_types:i}}
          <a class="dropdown-item" href="#" on-click="@this.handleClick('SWITCH_COMMAND',{ value : value, index: index },@event)">{{label}}</a> 
        {{/command_types}}
      </div>
    </div>
  `,
  data() {
    return {
      index: null,
      command_types: [
        {
          label: "Calibrate the task",
          value: "calibrate"
        },
        {
          label: "Basic Command",
          value: "basic-command"
        },
        {
          label: "Conditional Command",
          value: "conditional-command"
        },
        {
          label: "File transfer",
          value: "file-transfer"
        },
        {
          label: "Delete",
          value: "delete"
        },
      ]
    }
  },
  oncomplete() {

  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SWITCH_COMMAND':
        e.preventDefault();
        this.fire("listener", action, {
          ...props
        }, e);
        break;
    }
  }
});