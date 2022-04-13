import BaseRactive from "base/BaseRactive";
import InputText from "./InputText";

export default InputText.extend({
  template:/* html */`
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
      <div class="mb-3">
        <label class="form-label">Textarea <span class="form-label-description">56/100</span></label>
        <textarea class="form-control" name="example-textarea-input" rows="6" placeholder="Content..">Oh! Come and see the violence inherent in the system! Help, help, I'm being repressed! We shall say 'Ni' again to you, if you do not appease us. I'm not a witch. I'm not a witch. Camelot!</textarea>
      </div>
    </div>
  </div>
  `
});