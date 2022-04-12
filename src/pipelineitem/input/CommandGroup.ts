import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";
import AddCommand from "./AddCommand";
import BasicCommand from "./BasicCommand";
import template from './CommandGroupView.html';
import ConditionalCommand from "./ConditionalCommand";
import SwitchCommandType from "./SwitchCommandType";

export default BaseRactive.extend<BaseRactiveInterface>({
  template,
  isolated: false,
  components: {
    "command-group-dynamic": null,
    "basic-command": BasicCommand,
    "conditional-command": ConditionalCommand,
    "add-command": AddCommand,
    "switch-command-type": SwitchCommandType
  },
  data() {
    return {
      parts: [],
      state: "vfdvkdvdfkvm"
    }
  },
  partials: {
    test: null,
    content: null
  },
  oncomplete() {
    let newCOntents = [];
    let contents = this.partials.content as any;
    debugger;
    const recursiveSearch = (obj, searchKey, results = []) => {
      const r = results;
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (key === searchKey && typeof value !== 'object') {
          r.push(obj);
        } else if (typeof value === 'object') {
          recursiveSearch(value, searchKey, r);
        }
      });
      return r;
    };
    contents = recursiveSearch(contents, 'e');
    let partialsContents = contents;
    for (var a = 0; a < partialsContents.length; a++) {
      let partialItem = partialsContents[a];
      console.log('content :: ', partialItem);
      switch (partialItem) {
        case " ":
          break;
        default:
          if (this.components[partialItem.e] == null) {
            console.error("This component <" + partialItem.e + "> is not register yet on CommandGroup Component !");
          }
          let wrapperContent = Ractive.parse(/* html */`
            <div class='list-group-item'>
              <switch-command-type on-listener="onSwitchCommandTypeListener"></switch-command-type>
              <br>
            </div>
          `);
          console.log('ractive-parse :: ', wrapperContent.t[0]);
          newCOntents.push({
            ...wrapperContent.t[0],
            // Content must array
            f: [
              ...wrapperContent.t[0].f,
              partialItem
            ]
          });
          break;
      }
    }
    let wrapperContent = Ractive.parse(/* html */`
        <div class='list-group-item'>
          <add-command on-listener="onAddMoreListener" button_text="Add Command"></add-command>
        </div>
      `
    );
    newCOntents.push({
      ...wrapperContent.t[0]
    });
    this.resetPartial("content", newCOntents);
  },
  observe: {},
  newOn: {
    onAddMoreListener(c, action, text, object) {
      this.fire("listener", c, action, {
        value: "basic-command"
      }, object);
    },
    onSwitchCommandTypeListener(c, action, text, object) {
      switch (action) {
        case 'SWITCH_COMMAND':
          break;
      }
    }
  }
});