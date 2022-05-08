import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './RegisterView.html';

export interface RegisterInterface extends BaseRactiveInterface {
  submit: { (): void }
}

export default BaseRactive.extend<RegisterInterface>({
  template
});