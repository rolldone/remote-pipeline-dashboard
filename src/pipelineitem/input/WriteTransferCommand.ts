import Ractive from "ractive";
import BasicCommand, { BasicCommandInterface } from "./BasicCommand";
import FileTransferCommand, { FileTransferCommandInterface } from "./FileTransferCommand";
import template from './WriteTransferCommandView.html';

export interface WriteTransferCommand extends FileTransferCommandInterface {
}

const WriteTransferCommand = FileTransferCommand.extend<WriteTransferCommand>({
  template,
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await _super();
      let _template = null;
      let method_type_partial = [];
      let form_data = this.get("form_data");
      form_data.data = form_data.data || {
        asset_datas: [],
        method_type: null
      };
      form_data.data.asset_datas = form_data.data.asset_datas || [];
      let asset_datas = form_data.data.asset_datas;

      if (asset_datas.length == 0) {
        asset_datas.push({});
      }

      await this.set("form_data.data.asset_datas", [
        ...asset_datas
      ]);

      _template = this.addMoreAssetString();
      method_type_partial.push({
        ..._template.t[0]
      });
      _template = this.addMoreButtonAssetString();
      method_type_partial.push({
        ..._template.t[0]
      });
      await this.resetPartial('method_type_partial', [
        ...method_type_partial
      ]);
      resolve();
    })
  },
  addMoreAssetString() {
    return Ractive.parse(/* html */`
      {{#form_data.data.asset_datas:i}}
      <div class="row">
        <div class="col">
          <div class="form-label">Select your content data</div>
          <select class="form-select" value="{{form_data.data.asset_datas[i].name}}" name="name">
          <option value="-">--</option>
            {{#variable_asset_datas:i}}
            <option value="{{name}}">{{label}}</option>
            {{/variable_asset_datas}}
          </select>
        </div>
        <div class="col">
          <label class="form-label">Put the target file path</label>
          <div class="input-group mb-2">
            <div class="col">
              <input type="text" class="form-control" value={{form_data.data.asset_datas[i].target_path}} name="target_path" placeholder="Target Path" style="width:98%;">
            </div>
            <div class="col-auto align-self-center">
              <span on-click="@this.handleClick('DELETE_ITEM_MORE_TRANSFER',{ index : i },@event)" class="form-help" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="<p>ZIP Code must be US or CDN format. You can use an extended ZIP+4 code to determine address more accurately.</p><p class='mb-0'><a href='#'>USP ZIP codes lookup tools</a></p>" 
                data-bs-html="true" data-bs-original-title="" title="">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      {{/form_data.data.asset_datas}}
    `)
  },
  setVariables(props) {
    if (props == null) return;
    let variable_asset_datas = this.get("variable_asset_datas");
    let _datas: Array<any> = props.return;
    _datas.forEach((resData) => {
      let _schema: Array<any> = resData.schema;
      _schema.forEach((resSchema) => {
        if (resSchema.type == "input-script") {
          variable_asset_datas.push({
            ...resSchema,
            label: resSchema.name + " - " + resData.name
          });
        }
      })
    })
    this.set("variable_asset_datas", variable_asset_datas);
  }
});

export default WriteTransferCommand;