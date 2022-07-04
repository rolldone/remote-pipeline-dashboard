import InputText from "./InputText";

export default InputText.extend({
  template:/* html */`
    <div class="col text-truncate">
      <input type="text" class="form-control" name="name" value="{{schema_data.name}}" placeholder="Input var name">
      <br/>
      <div class="mb-3">
        <label class="form-label">Textarea <span class="form-label-description">56/100</span></label>
        <textarea class="form-control" name="value" rows="6" placeholder="Content..">{{schema_data.value}}</textarea>
      </div>
    </div>
  `
});