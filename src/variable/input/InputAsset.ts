import BaseRactive from "base/BaseRactive";
import { cloneDeep } from "lodash";
import VariableService from "services/VariableService";
import InputText, { InputTextInterface } from "./InputText";

export interface InputAssetInterface extends InputTextInterface {
  createNewAttachment: { (): void }
  deleteAttachment: { (index: number): void }
  submitFile: { (): void }
}

export default InputText.extend<InputAssetInterface>({
  template: /* html */`
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
        {{#form_scheme.attachment_datas:i}}
        <div class="mb-3">
          <div class="row">
            <div class="col">
              <input type="file" style="display:none" value="{{form_data.attachment_datas[i].file}}" name="attatchment-{{i}}" class="form-control" placeholder="{{form_data.attachment_datas.file[0].name}}">
              <input type="text" class="form-control" value="{{form_data.attachment_datas[i].file[0].name}}" on-click="@this.handleClick('CHOOSE_FILE',{ name : 'attatchment-'+i },@event)" placeholder="Choose a file" readonly="readyonly">
            </div>
            <div class="col-auto">
              {{#if (form_scheme.attachment_datas.length - 1) == i}}
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
        {{/form_scheme.attachment_datas}}
        {{#if form_scheme.attachment_datas.length > 0}}
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
    </div>
  `,
  data() {
    return {
      form_data: {
        attachment_datas: {}
      },
      form_scheme: {}
    }
  },
  onconfig() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      let _form_scheme = this.get("form_scheme");
      let _attachment_datas = _form_scheme.attachment_datas || [];
      if (_attachment_datas.length == 0) {
        this.createNewAttachment();
      }
      _super();
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
  async submitFile() {
    try {
      let _form_scheme = this.get("form_scheme");
      let _form_data = this.get("form_data");
      let _attachment_datas = _form_data.attachment_datas || {};
      let _id_variable = this.parent.parent.req.params.id;
      let resData = await VariableService.uploadAsset({
        id_variable: _id_variable,
        var_name: _form_scheme.name,
        file_datas: _attachment_datas
      })
      let _resAttachmentDatas = resData.return;
      for (let a in _resAttachmentDatas) {
        if (_resAttachmentDatas[a] instanceof Object){
          _form_data.attachment_datas[a] = {
            file: []
          }
        _form_data.attachment_datas[a].file[0] = {
          ..._resAttachmentDatas[a],
          name: _resAttachmentDatas[a].originalname,
          temp_name: _resAttachmentDatas[a].filename
        }
      }else{
        // This is file exist before and if had exist the return just string like
        // [Object object] so ignore it.
      }
}
      this.set("form_data", _form_data);
    } catch (ex) {
  throw ex;
}
  },
deleteAttachment(index) {
  let _attachment_datas_deleted = [];
  let _form_data = this.get("form_data");
  let _attachment_datas_form_data = _form_data.attachment_datas;
  // Add to deleted datas attachement
  _attachment_datas_deleted.push(cloneDeep(_attachment_datas_form_data[index]));
  _form_data.attachment_datas_deleted = _attachment_datas_deleted;
  // Then you can delete the attachement
  _attachment_datas_form_data.splice(index, 1);

  let _form_scheme = this.get("form_scheme");
  let _attachment_datas = _form_scheme.attachment_datas || []
  _form_scheme.attachment_datas = _attachment_datas;
  _attachment_datas.splice(index, 1);
  setTimeout(() => {
    this.set("form_scheme", _form_scheme);
    this.set("form_data", _form_data);
  }, 100)
},
createNewAttachment() {
  let _form_scheme = this.get("form_scheme");
  let _attachment_datas = _form_scheme.attachment_datas || [];
  _attachment_datas.push({
    file: "",
  });
  _form_scheme.attachment_datas = _attachment_datas;
  setTimeout(() => {
    this.set("form_scheme", _form_scheme);
  }, 100)
}
})