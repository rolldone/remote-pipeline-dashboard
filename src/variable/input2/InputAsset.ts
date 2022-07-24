
import { cloneDeep } from "lodash";
import VariableService from "services/VariableService";
import InputText, { InputTextInterface } from "./InputText";

export interface InputAssetInterface extends InputTextInterface {
  createNewAttachment?: { (): void }
  deleteAttachment?: { (index: number): void }
  submitFile?: { (): void }
}

const InputAsset = InputText.extend<InputAssetInterface>({
  template: /* html */`
    <div class="col text-truncate">
      <input type="text" class="form-control" name="name" value="{{schema_data.name}}" placeholder="Input var name">
      <br/>
      {{#schema_data.attachment_datas:i}}
      <div class="mb-3">
        <div class="row">
          <div class="col">
            <input type="file" style="display:none" value="{{schema_data.attachment_datas[i].file}}" name="attatchment-{{i}}" on-change="@this.handleChange('CHOOSED_FILE',{ index : i },@event)" class="form-control" placeholder="{{schema_data.attachment_datas.file[0].name}}">
            <input type="text" class="form-control" value="{{schema_data.attachment_datas[i].file[0].name}}" on-click="@this.handleClick('CHOOSE_FILE',{ name : 'attatchment-'+i },@event)" placeholder="Choose a file" readonly="readyonly">
          </div>
          <div class="col-auto">
            {{#if (schema_data.attachment_datas.length - 1) == i}}
            <a href="#" class="btn btn-facebook w-100 btn-icon" aria-label="Facebook" on-click="@this.handleClick('MOREE_UPLOAD',{},@event)">
              <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </a>
            {{else}}
            <a href="#" class="btn btn-facebook w-100 btn-icon" aria-label="Facebook" on-click="@this.handleClick('DELETE_FILE',{ index : i },@event)">
              <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-minus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </a>
            {{/if}}
          </div>
        </div>
      </div>
      {{/schema_data.attachment_datas}}
      {{#if schema_data.attachment_datas.length > 0}}
      <div class="mb-3">
        <div class="row">
          <div class="col-1">
            <a href="#" class="btn btn-blue w-100" on-click="@this.handleClick('SUBMIT_FILE',{},@event)">
              Uploads
            </a>
          </div>
        </div>
      </div>
      {{/if}}
    </div>
  `,
  data() {
    return {
      schema_data: {}
    }
  },
  oncomplete() {
    return new Promise((resolve: Function) => {
      let _schema_data = this.get("schema_data");
      _schema_data = {
        name: _schema_data.name,
        type: _schema_data.type,
        attachment_datas: _schema_data.attachment_datas
      }
      this.set("schema_data", _schema_data);
      let _attachment_datas = _schema_data.attachment_datas || [];
      if (_attachment_datas.length == 0) {
        this.createNewAttachment();
      }
      resolve();
    })
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'CHOOSE_FILE':
        $(e.target).siblings(`input[name=${props.name}]`).trigger("click");
        break;
      case 'SUBMIT_FILE':
        e.preventDefault();
        this.submitFile();
        break;
      case 'MOREE_UPLOAD':
        e.preventDefault();
        this.createNewAttachment();
        return;
      case 'DELETE_FILE':
        e.preventDefault();
        this.deleteAttachment(props.index);
        break;
    }
    this._super(action, props, e)
  },
  handleChange(action, props, e) {
    let _schema_data = this.get("schema_data");
    let _attachment_datas = [];
    switch (action) {
      case 'CHOOSED_FILE':
        const file = e.target.files[0]
        console.log("file change :: ", file);
        if (file == null) {
          _attachment_datas = _schema_data.attachment_datas;
          _attachment_datas[props.index] = {
            files: []
          }
        }
        this.set("schema_data", _schema_data);
        break;
    }
  },
  async submitFile() {
    try {
      let _schema_data = this.get("schema_data");
      let _variable_id = this.get("variable_id");
      let _attachment_datas = _schema_data.attachment_datas || [];
      let _id_variable = _variable_id;
      let resData = await VariableService.uploadAsset({
        id_variable: _id_variable,
        var_name: _schema_data.name,
        file_datas: _attachment_datas
      })
      let _resAttachmentDatas = resData.return;
      for (let a in _resAttachmentDatas) {
        for (let b in _schema_data.attachment_datas) {
          if (_schema_data.attachment_datas[b].file[0].name == _resAttachmentDatas[a].originalname) {
            _schema_data.attachment_datas[b] = {
              file: []
            }
            _schema_data.attachment_datas[b].file[0] = {
              ..._resAttachmentDatas[a],
              name: _resAttachmentDatas[a].originalname,
              temp_name: _resAttachmentDatas[a].filename
            }
          }
        }
      }
      this.set("schema_data", _schema_data);
    } catch (ex) {
      throw ex;
    }
  },
  deleteAttachment(index) {
    let _schema_data = this.get("schema_data");
    let _attachment_datas_form_data = _schema_data.attachment_datas;
    // Then you can delete the attachement
    _attachment_datas_form_data.splice(index, 1);
    this.set("schema_data", _schema_data);
  },
  createNewAttachment() {
    let _schema_data = this.get("schema_data");
    let _attachment_datas = _schema_data.attachment_datas || [];
    _attachment_datas.push({
      file: "",
    });
    _schema_data.attachment_datas = _attachment_datas;
    setTimeout(() => {
      this.set("schema_data", _schema_data);
    }, 100)
  }
})

export default InputAsset;