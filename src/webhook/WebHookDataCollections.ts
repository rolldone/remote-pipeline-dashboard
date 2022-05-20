import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import AddWebHookItemModal, { AddWebHookItemModalInterface } from "./modal/AddWebhookItemModal";
import template from './WebHookDataCollectionView.html';

const WebHookDataCollections = BaseRactive.extend<BaseRactiveInterface>({
  components: {
    "add-webhook-item-modal": AddWebHookItemModal
  },
  template,
  data() {
    return {
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
    let _webhook_datas = this.get("webhook_datas");
    let _webhook_data = null;
    switch (action) {
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