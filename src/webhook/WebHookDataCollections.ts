import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import AddWebHookItemModal, { AddWebHookItemModalInterface } from "./modal/AddWebhookItemModal";
import template from './WebHookDataCollectionView.html';

const WebHookDataCollections = BaseRactive.extend<BaseRactiveInterface>({
  components: {
    "add-webhook-item-modal": AddWebHookItemModal
  },
  template,
  onconstruct() {
    this.newOn = {
      onAddWebHookItemListener: (object, action, text, c) => {
        switch (action) {
          case 'SUBMIT':
            let _webhook_datas = this.get("webhook_datas") || [];
            _webhook_datas.push(text);
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
    switch (action) {
      case 'ADD_MORE':
        e.preventDefault();
        addWebhookItemModal = this.findComponent("add-webhook-item-modal");
        addWebhookItemModal.show({});

        break;
      case 'ADD_NEW_WEBHOOK_ITEM':
        e.preventDefault();
        addWebhookItemModal = this.findComponent("add-webhook-item-modal");
        addWebhookItemModal.show({});
        break;
    }
  }
});


export default WebHookDataCollections;