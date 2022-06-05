import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './RowCardView.html';

export interface RowCardInterface extends BaseRactiveInterface{

}

const RowCard = BaseRactive.extend<RowCardInterface>({
  template
});

export default RowCard;