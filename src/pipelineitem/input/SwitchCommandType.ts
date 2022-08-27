import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

const SSH_CONNECTION_MENU = [
  {
    label: "Calibrate the task",
    value: "calibrate"
  },
  {
    label: "Repo install location",
    value: "repo-install"
  },
  {
    label: "Remote Command",
    value: "group",
    command_types: [
      {
        label: "Transfer Remote Command",
        value: "transfer-remote"
      },
      {
        label: "Download Remote Command",
        value: "download-remote"
      },
    ]
  },
  {
    label: "Transfer Remote Command",
    value: "transfer-remote"
  },
  {
    label: "Download Remote Command",
    value: "download-remote"
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
    label: "Write transfer",
    value: "write-transfer"
  },
  {
    label: "Write Script",
    value: "write-script"
  },
  {
    label: "Full Download Request",
    value: "download-request"
  },
  {
    label: "Http Request",
    value: "http-request"
  },
  {
    label: "Create new queue",
    value: "new-queue"
  },
  {
    label: "Delete",
    value: "delete"
  },
];

const BASIC_CONNECTION_MENU = [
  {
    label: "Calibrate the task",
    value: "calibrate"
  },
  {
    label: "Http Request",
    value: "http-request"
  },
  {
    label: "Conditional Command",
    value: "conditional-command"
  },
  {
    label: "Delete",
    value: "delete"
  },
];

const SwitchCommandType = BaseRactive.extend<BaseRactiveInterface>({
  template: /* html */`
    <div class="row align-items-center">
      <div class="col-auto">
        <div class="dropdown">
          <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-components" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <desc>Download more icon variants from https://tabler-icons.io/i/components</desc>
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M3 12l3 3l3 -3l-3 -3z"></path>
              <path d="M15 12l3 3l3 -3l-3 -3z"></path>
              <path d="M9 6l3 3l3 -3l-3 -3z"></path>
              <path d="M9 18l3 3l3 -3l-3 -3z"></path>
            </svg>
          </button> 
          <div class="dropdown-menu">
            {{#command_types:i}}
              {{#if value == 'group'}}
              <div class="dropend">
                <a class="dropdown-item dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                  {{label}}
                </a>
                <div class="dropdown-menu" data-bs-popper="none">
                {{#command_types:u}}
                  <a class="dropdown-item" href="#" on-click="@this.handleClick('SWITCH_COMMAND',{ value : value, index: index },@event)">{{label}}</a> 
                {{/command_types}}
                </div>
              </div>
              {{else}}
                <a class="dropdown-item" href="#" on-click="@this.handleClick('SWITCH_COMMAND',{ value : value, index: index },@event)">{{label}}</a> 
              {{/if}}
            {{/command_types}}
          </div>
        </div>
      </div>
      <div class="col text-truncate"></div>
      <div class="col-auto">
        <div class="dropdown">
          <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <svg class="icon icon-tabler icon-tabler-settings" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path> <circle cx="12" cy="12" r="3"></circle></svg> 
          </button> 
          <div class="dropdown-menu" style="">
            {{#index==(length-1)}}
            <a class="dropdown-item" href="#" on-click="@this.handleClick('MOVE_UP',{ newIndex: index-1, oldIndex: index },@event)">Move To Up</a>
            {{elseif index==0}}
            <a class="dropdown-item" href="#" on-click="@this.handleClick('MOVE_DOWN',{ newIndex: index+1, oldIndex: index },@event)">Move To Down</a>
            {{else}}
            <a class="dropdown-item" href="#" on-click="@this.handleClick('MOVE_UP',{ newIndex: index-1, oldIndex: index },@event)">Move To Up</a>
            <a class="dropdown-item" href="#" on-click="@this.handleClick('MOVE_DOWN',{ newIndex: index+1, oldIndex: index },@event)">Move To Down</a>
            {{/if}}
            <a class="dropdown-item" href="#" on-click="@this.handleClick('RESET',{},@event)">Reset</a>
            <a class="dropdown-item" href="#" on-click="@this.handleClick('DELETE',{ index: index },@event)">Delete</a>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      length: null,
      index: null,
      pipeline: {},
      command_types: []
    }
  },
  onconfig() {
    this._super();
    let pipeline = this.get("pipeline");
    if (pipeline.connection_type == "ssh") {
      this.set("command_types", SSH_CONNECTION_MENU);
    } else {
      this.set("command_types", BASIC_CONNECTION_MENU);
    }
  },
  oncomplete() {
    this._super();
    // let dropdowns = document.querySelectorAll('.dropdown-toggle')
    // dropdowns.forEach((dd) => {
    //   dd.addEventListener('click', function (this: any, e) {
    //     var el = this.nextElementSibling
    //     el.style.display = el.style.display === 'block' ? 'none' : 'block'
    //   })
    // })
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'MOVE_UP':
        e.preventDefault();
        this.fire("listener", action, {
          ...props
        }, e)
        break;
      case 'MOVE_DOWN':
        e.preventDefault();
        this.fire("listener", action, {
          ...props
        }, e)
        break;
      case 'RESET':
      case 'DELETE':
        e.preventDefault();
        this.fire("listener", action, {
          ...props
        }, e);
        break;
      case 'SWITCH_COMMAND':
        e.preventDefault();
        this.fire("listener", action, {
          ...props
        }, e);
        break;
    }
  }
});

export default SwitchCommandType;