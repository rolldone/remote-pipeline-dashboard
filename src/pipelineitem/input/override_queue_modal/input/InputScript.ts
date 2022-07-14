import VariableInputScript from "variable/input/InputScript";
import { InputTextInterface } from "variable/input/InputText";

const InputScript = VariableInputScript.extend<InputTextInterface>({
  template:/* html */`
    <div class="row align-items-top">
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

export default InputScript;