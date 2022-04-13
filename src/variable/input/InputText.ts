import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

export interface InputTextInterface extends BaseRactiveInterface {
  testo?:any
}

export default BaseRactive.extend<InputTextInterface>({
  template: /* html */`
  <div class="row align-items-top">
    <div class="col-auto">
      <input type="checkbox" class="form-check-input">
    </div>
    <div class="col-auto">
      <select type="text" class="form-select tomselected ts-hidden-accessible" placeholder="Select a date" id="select-users" value="" tabindex="-1">
        <option value="3">Paweł Kuna</option>
        <option value="4">Nikola Tesla</option>
        <option value="1">Chuck Tesla</option>
        <option value=""></option>
        <option value="2">Elon Musk</option>
      </select>
    </div>
    <div class="col text-truncate">
      <input type="text" class="form-control" name="example-text-input" placeholder="Input var name">
      <br/>
      <input type="text" class="form-control" name="example-text-input" placeholder="Input Value">
      
    </div>
  </div>
  `
});