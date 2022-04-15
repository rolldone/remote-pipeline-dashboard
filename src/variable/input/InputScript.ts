import BaseRactive from "base/BaseRactive";
import InputText from "./InputText";

export default InputText.extend({
  template:/* html */`
  <div class="row align-items-top">
    <div class="col-auto">
      <input type="checkbox" class="form-check-input">
    </div>
    <div class="col-auto">
      <switch-type on-listener="setOnSwitchTypeListener" type="{{form_data.type}}" index="{{index}}"></switch-type>
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