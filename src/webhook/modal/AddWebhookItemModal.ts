import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";
import template from './AddWebHookItemModalView.html';

export interface AddWebHookItemModalInterface extends BaseRactiveInterface {
  show?: { (props: any): void }
  hide?: { (): void }
  importWebHookItem: { (whatHooItem: string): void }
  displayPartial?: { (_selectHook: string): void }
}

let _comp = null;
let myModal = null;
const AddWebHookItemModal = BaseRactive.extend<AddWebHookItemModalInterface>({
  template,
  partials: {
    webhook_type_partials: []
  },
  onconstruct() {
    this.newOn = {
      onWebHookItemListener: (c, action, props, e) => {
        switch (action) {
          case 'SUBMIT':
            this.set("form_data", props);
            this.fire("listener", action, props, e);
            break;
        }
      }
    }
    this._super();
  },
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {}
    }
  },
  handleClick(action, props, e) {
    let _form_data = this.get("form_data");
    switch (action) { }
  },
  async handleChange(action, props, e) {

    switch (action) {
      case 'SELECT_WEBHOOK_TYPE':
        let _selectHook = $(e.target).find(":selected").val();
        this.displayPartial(_selectHook as string);
        break;
    }
  },
  async show(props) {
    this.resetPartial("webhook_type_partials", []);
    this.set("form_data", props);
    if (props.webhook_type != null) {
      await this.displayPartial(props.webhook_type as string);
    }
    let _id_element = this.get("id_element");
    let the_element = document.getElementById(_id_element);
    myModal = new window.bootstrap.Modal(the_element, {
      keyboard: false
    });
    the_element.addEventListener("hidden.bs.modal", (event: any) => {
      // do something...
      if (event.target.id == _id_element) {
        this.hide();
      }
    });
    myModal.show();
  },
  hide() {
    _comp().destroy();
  },
  async displayPartial(_selectHook: string) {
    let _webhook_type_partials = [
      // Reset it
    ]
    let _com = await this.importWebHookItem(_selectHook as string);
    this.components[_selectHook as string] = _com;
    let _template = Ractive.parse(/* html */`
          <${_selectHook} form_data="{{form_data}}" on-listener="onWebHookItemListener"></${_selectHook}>
        `);
    _webhook_type_partials.push({
      ..._template.t[0]
    });
    this.resetPartial('webhook_type_partials', _webhook_type_partials);
  },
  async importWebHookItem(whatHooItem) {
    _comp = null;
    switch (whatHooItem) {
      case 'smtp':
        _comp = (await import("./webhook_item/SmtpHook")).default;
        break;
      case 'discord':
        _comp = (await import("./webhook_item/DiscordHook")).default;
        break;
      case 'slack':
        _comp = (await import("./webhook_item/SlackHook")).default;
        break;
      case 'telegram':
        _comp = (await import("./webhook_item/TelegramHook")).default;
        break;
    }
    return _comp;
  }
});

export default AddWebHookItemModal;