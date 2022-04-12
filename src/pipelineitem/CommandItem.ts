import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";
import BasicCommand from "./input/BasicCommand";
import ConditionalCommand from "./input/ConditionalCommand";

export default BaseRactive.extend<BaseRactiveInterface>({
  data() {
    return {
      command_data: {
        type: "basic-command",
        temp_id: null
      },
      command_datas: [],
      index: -1
    }
  },
  components: {
    "basic-command": BasicCommand,
    "conditional-command": ConditionalCommand
  },
  template:/* html */`
    {{#if command_data.type == "basic-command"}}
    <basic-command index={{index}} on-listener="onCommandListener" form_data={{command_data}} command_datas={{command_datas}}></basic-command>
    {{elseif command_data.type == "conditional-command"}}
    <conditional-command index={{index}} on-listener="onCommandListener" form_data={{command_data}} command_datas={{command_datas}}></conditional-command>
    {{/if}}
  `,
  onconfig() {
    this.set("command_data", {
      ...this.get("command_data"),
      // Awalys still regenerate
      order_number: this.get("index")
    })
    console.log("command_data", this.get("command_data"));
  },
  newOn: {
    onCommandListener(c, action, text, object) {
      switch (action) {
        case 'FORM_DATA.NAME.TRIGGER':
          this.fire("listener", c, action, text, object);
          break;
      }
    }
  }
})