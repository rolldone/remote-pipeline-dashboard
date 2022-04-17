import BaseRactive from "base/BaseRactive";
import InputText from "./InputText";

export default InputText.extend({
  template:/* html */`
  <div class="row align-items-top">
    <div class="col-auto">
      <a href="#" class="btn btn-red w-100" aria-label="Facebook" on-click="@this.handleClick('DELETE',{ index : index },@event)">
        <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </a>
    </div>
    <div class="col-auto">
      <switch-type on-listener="setOnSwitchTypeListener" type="{{form_scheme.type}}" index="{{index}}"></switch-type>
    </div>
    <div class="col text-truncate">
      <input type="text" class="form-control" name="name" value="{{form_scheme.name}}" placeholder="Input var name">
      <br/>
      <div class="mb-3">
        <label class="form-label">Textarea <span class="form-label-description">56/100</span></label>
        <textarea class="form-control" name="value" rows="6" placeholder="Content..">{{form_data.value}}</textarea>
      </div>
    </div>
  </div>
  `
});