import VariableInputText, { InputTextInterface } from "variable/input2/InputText";

const InputText = VariableInputText.extend<InputTextInterface>({
  template: /* html */`
    <div class="row align-items-top">
      <div class="col text-truncate">
        <input type="text" class="form-control" name="name" value="{{schema_data.name}}" placeholder="Input var name">
        <br/>
        <input type="text" class="form-control" name="value" value="{{schema_data.value}}" placeholder="Input Value">
      </div>
    </div>
  `,
})

export default InputText;