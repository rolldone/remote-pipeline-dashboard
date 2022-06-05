import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './QueueRecordDetailsView.html';

export interface QueueRecordDetailsInterface extends BaseRactiveInterface {

}

const QueueRecordDetails = BaseRactive.extend<QueueRecordDetailsInterface>({
  template
});

export default QueueRecordDetails;