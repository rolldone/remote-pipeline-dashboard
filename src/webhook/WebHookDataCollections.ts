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
        debugger;
      }
    }
    this._super();
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'ADD_NEW_WEBHOOK_ITEM':
        e.preventDefault();
        let addWebhookItemModal: AddWebHookItemModalInterface = this.findComponent("add-webhook-item-modal");
        addWebhookItemModal.show({});
        break;
    }
  }
});


export default WebHookDataCollections;