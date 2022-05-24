import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";
import template from './WebHookItemTestModalView.html';

export interface WebHookItemTestModalInterface extends BaseRactiveInterface {
  show?: { (props?: any): void }
  displayPartial?: { (_selectHook: string): void }
  importTestWebHookItem?: { (testWebHookItem: string): void }
}

const WebhookItemTestModal = BaseRactive.extend<WebHookItemTestModalInterface>({
  template,
  partials: {
    webhook_type_partials: []
  },
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      hook_data: {}
    }
  },
  async show(props) {
    this.resetPartial("webhook_type_partials", []);
    this.set("hook_data", props);
    if (props.webhook_type != null) {
      await this.displayPartial(props.webhook_type as string);
    }
    let _id_element = this.get("id_element");
    var myModal = new window.bootstrap.Modal(document.getElementById(_id_element), {
      keyboard: false
    });
    myModal.show();
  },
  async displayPartial(_selectHook: string) {
    let _webhook_type_partials = [
      // Reset it
    ]
    let _com = await this.importTestWebHookItem(_selectHook as string);
    this.components[_selectHook as string] = _com;
    let _template = Ractive.parse(/* html */`
          <${_selectHook} hook_data="{{hook_data}}" on-listener="onWebHookItemListener"></${_selectHook}>
        `);
    _webhook_type_partials.push({
      ..._template.t[0]
    });
    this.resetPartial('webhook_type_partials', _webhook_type_partials);
  },
  async importTestWebHookItem(testWebHookItem) {
    let _comp = null;
    switch (testWebHookItem) {
      case 'smtp':
        _comp = (await import("./webhook_test_item/SmtpTest")).default;
        break;
      case 'discord':
        _comp = (await import("./webhook_test_item/DiscordTest")).default;
        break;
      case 'slack':
        _comp = (await import("./webhook_test_item/SlackTest")).default;
        break;
      case 'telegram':
        _comp = (await import("./webhook_test_item/TelegramTest")).default;
        break;
    }
    return _comp;
  }
});

export default WebhookItemTestModal;