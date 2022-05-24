import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import AddWebHookItemModal, { AddWebHookItemModalInterface } from "./modal/AddWebhookItemModal";
import WebhookItemTest from "./modal/WebHookItemTestModal";
import template from './WebHookDataCollectionView.html';

const WebHookDataCollections = BaseRactive.extend<BaseRactiveInterface>({
  components: {
    "add-webhook-item-modal": AddWebHookItemModal,
    "webhook-item-test-modal": WebhookItemTest
  },
  template,
  data() {
    return {
      hook_data: {},
      webhook_datas: [],
      select_index: null
    }
  },
  onconstruct() {
    this.newOn = {
      onAddWebHookItemListener: (object, action, text, c) => {
        switch (action) {
          case 'SUBMIT':
            let _select_index = this.get("select_index");
            let _webhook_datas = this.get("webhook_datas") || [];
            if (_webhook_datas[_select_index] != null) {
              _webhook_datas[_select_index] = text;
            } else {
              _webhook_datas.push(text);
            }
            this.set("webhook_datas", _webhook_datas);
            debugger;
            break;
        }
      }
    }
    this._super();
  },
  handleClick(action, props, e) {
    let addWebhookItemModal: AddWebHookItemModalInterface = null;
    let _form_data = this.get("hook_data");
    let _webhook_datas = this.get("webhook_datas");
    let _webhook_data = null;
    switch (action) {
      case 'TEST':
        e.preventDefault();
        this.set("select_index", props.index);
        _webhook_data = _webhook_datas[props.index];
        addWebhookItemModal = this.findComponent("webhook-item-test-modal");
        addWebhookItemModal.show({
          ..._webhook_data,
          hook_id: _form_data.id
        });
        break;
      case 'DELETE':
        e.preventDefault();
        _webhook_datas.splice(props.index, 1);
        this.set("webhook_datas", _webhook_datas);
        break;
      case 'EDIT':
        e.preventDefault();
        this.set("select_index", props.index);
        _webhook_data = _webhook_datas[props.index];
        addWebhookItemModal = this.findComponent("add-webhook-item-modal");
        addWebhookItemModal.show(_webhook_data);
        break;
      case 'ADD_MORE':
        e.preventDefault();
        this.set("select_index", null);
        addWebhookItemModal = this.findComponent("add-webhook-item-modal");
        addWebhookItemModal.show({});
        break;
      case 'ADD_NEW_WEBHOOK_ITEM':
        e.preventDefault();
        this.set("select_index", null);
        addWebhookItemModal = this.findComponent("add-webhook-item-modal");
        addWebhookItemModal.show({});
        break;
    }
  }
});


export default WebHookDataCollections;