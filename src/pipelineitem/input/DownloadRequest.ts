import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive, { ParsedTemplate } from "ractive";
import VariableService from "services/VariableService";
import BasicCommand, { BasicCommandInterface } from "./BasicCommand";
import template from './DownloadRequestView.html';

declare let window: Window;

export interface DownloadRequestInterface extends BasicCommandInterface {
  getVariables?: { (): Promise<any> }
  setVariables?: { (props: any): void }
  addMoreAssetString?: { (): ParsedTemplate }
  addMoreButtonAssetString?: { (): ParsedTemplate }
  initAssetPartial?: { (): void }
}

const DownloadRequest = BasicCommand.extend<DownloadRequestInterface>({
  template,
  data() {
    return {
      variable_asset_datas: [],
      form_data: {
        data: {
          method_type: null,
          asset_datas: []
        }
      },
    }
  },
  partials: {
    method_type_partial: [],
    parent_order_number_commands_partial: [],
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setVariables(await this.getVariables());
      this.initAssetPartial();
      resolve();
    });
  },
  async initAssetPartial() {
    let _template = null;
    let _sync_action = null;
    let method_type_partial = [];
    let sync_action_partial = [];
    let form_data = this.get("form_data");
    form_data.data = form_data.data || {
      asset_datas: [],
      method_type: null
    };
    if (form_data.data.method_type == null) return;
    form_data.data.asset_datas = form_data.data.asset_datas || [];
    let asset_datas = form_data.data.asset_datas;
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
  },
  async handleClick(action, props, e) {
    let _template = null;
    let _sync_action = null;
    let method_type_partial = [];
    let sync_action_partial = [];
    let form_data = this.get("form_data");
    form_data.data = form_data.data || {
      asset_datas: [],
      method_type: null
    };
    form_data.data.asset_datas = form_data.data.asset_datas || [];
    let asset_datas = form_data.data.asset_datas;
    switch (action) {
      case 'METHOD_TYPE':
        this.set("form_data.data.method_type", props.value);
        switch (props.value) {
          case 'sftp':
          case 'rsync':
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
            break;
        }
        break;
      case 'DELETE_ITEM_MORE_TRANSFER':
        asset_datas.splice(props.index, 1);
        this.set("form_data.data.asset_datas", [
          ...asset_datas
        ]);
        break;
      case 'ADD_MORE_TRANSFER':
        e.preventDefault();
        method_type_partial = [];
        asset_datas.push({});
        _template = this.addMoreAssetString();
        method_type_partial.push({
          ..._template.t[0]
        });
        _template = this.addMoreButtonAssetString();
        method_type_partial.push({
          ..._template.t[0]
        });
        await this.set("form_data.data.asset_datas", [
          ...asset_datas
        ]);
        await this.resetPartial('method_type_partial', [
          ...method_type_partial
        ]);
        break;
    }
  },
  addMoreAssetString() {
    return Ractive.parse(/* html */`
      {{#form_data.data.asset_datas:i}}
      <div class="row">
        <div class="col">
          <label class="form-label">Put the route source path</label>
          <div class="input-group mb-2">
            <div class="col">
              <input type="text" class="form-control" value={{form_data.data.asset_datas[i].source_path}} name="source_path" placeholder="Source Path" style="width:98%;">
            </div>
          </div>
        </div>
        <div class="col">
          <label class="form-label">Save as new name</label>
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
          <small class="form-hint">Download process will store at queue record detail as assets. You can check on Queue Record -> Detail Queue Record</small>
        </div>
        
      </div>
      {{/form_data.data.asset_datas}}
    `)
  },
  addMoreButtonAssetString() {
    return Ractive.parse(/* html */`
      <div class="row">
        <div class="col-6 col-sm-4 col-md-2 col-xl-auto mb-3">
          <a href="#" class="btn btn-twitter w-100 btn-icon" aria-label="Twitter" on-click="@this.handleClick('ADD_MORE_TRANSFER',{},@event)">
            <!-- Download SVG icon from http://tabler-icons.io/i/brand-twitter -->
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </a>
        </div>
      </div>
    `);
  },
  async getVariables() {
    try {
      let resDatas = await VariableService.getVariables({
        pipeline_id: this.parent.parent.parent.parent.req.params.id
      });
      return resDatas;
    } catch (ex) {
      console.error("getVariables - ex :: ", ex);
    }
  },
  setVariables(props) {
    if (props == null) return;
    let variable_asset_datas = this.get("variable_asset_datas");
    let _datas: Array<any> = props.return;
    _datas.forEach((resData) => {
      let _schema: Array<any> = resData.schema;
      _schema.forEach((resSchema) => {
        if (resSchema.type == "input-asset") {
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

export default DownloadRequest;