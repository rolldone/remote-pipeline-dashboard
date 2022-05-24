import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

export interface WebHookItemTestInterface extends BaseRactiveInterface{

}

const WebhookItemTest = BaseRactive.extend<WebHookItemTestInterface>({

});

export default WebhookItemTest;