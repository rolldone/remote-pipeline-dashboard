import Ractive, { ParsedTemplate } from 'ractive';
import WriteScriptCodeModal from './modal/WriteScriptCodeModal';
import template from './WriteScriptCodeView.html';
import WriteTransferCommand, { WriteTransferCommandInterface } from "./WriteTransferCommand";

export interface WriteScriptCodeInterface extends WriteTransferCommandInterface {
  displayScriptCollections?: { (): void }
  renderFirstAddTemplate?: { (props?: any): ParsedTemplate }
  renderScriptCollections?: { (props?: any): ParsedTemplate }
}

const WriteSCriptCode = WriteTransferCommand.extend<WriteScriptCodeInterface>({
  components: {
    "write-script-modal": WriteScriptCodeModal
  },
  partials: {
    script_collections: []
  },
  template,
  data() {
    return {
      script_datas: [],
      fill_prompt: null
    }
  },
  onconstruct() {
    this.newOn = {
      onWriteScriptModalListener: (c, action, text, object) => {
        switch (action) {
          case 'SUBMIT':
            // This mutable from modal component so you dont need set value again
            let _script_datas = this.get("script_datas");
            this.set("form_data.data.script_datas", _script_datas);
            console.log("form_data", this.get("form_data"));
            let _write_script_modal = this.findComponent("write-script-modal");
            _write_script_modal.hide();
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await _super();
      this.set("script_datas", this.get("form_data.data.script_datas") || [])
      this.displayScriptCollections();
      resolve();
    });
  },
  handleClick(action, props, e) {
    let _script_datas = this.get("script_datas");
    let _fill_prompt = this.get("fill_prompt");
    let _script_data = this.get("script_data");
    switch (action) {
      case 'FILE_PATH_EDIT':
        e.preventDefault();
        _script_data = _script_datas[props.index];
        let _write_script_modal = this.findComponent("write-script-modal");
        _write_script_modal.show(_script_data);
        break;
      case 'FILE_PATH_DELETE':
        e.preventDefault();
        _script_datas.splice(props.index, 1);
        this.set("script_datas", _script_datas);
        break;
      case 'ADD_NEW':
        e.preventDefault();
        _script_datas.push({
          file_path: _fill_prompt
        });
        this.set("script_datas", _script_datas);
        this.set("fill_prompt", "");
        this.displayScriptCollections();
        break;
    }
  },
  renderScriptCollections(props: {
    index: number
  }) {
    let {
      index
    } = props;
    return Ractive.parse(/* html */`
      <div class="tab-pane active" id="tabs-profile-15">
        <label class="form-label">Absolute File Path</label>
        <div class="row">
          <div class="col-lg-10">
            <div class="input-group mb-2">
              <span class="input-group-text">
                {{form_data.data.working_dir}}
              </span>
              <input type="text" class="form-control" placeholder="" name="file_path" value="{{script_datas[${index}].file_path}}" autocomplete="off">
            </div>
          </div>
          <div class="col-lg-1">
            <div class="dropdown">
              <button class="btn dropdown-toggle align-text-top" data-bs-toggle="dropdown" aria-expanded="false">Actions</button>
              <div class="dropdown-menu dropdown-menu-end" style="">
                <a class="dropdown-item" href="#" on-click="@this.handleClick('FILE_PATH_EDIT',{ index : ${index} },@event)">Edit</a>
                <a class="dropdown-item" href="#" on-click="@this.handleClick('FILE_PATH_DELETE',{ index : ${index} },@event)">Delete</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  },
  renderFirstAddTemplate(props) {
    return Ractive.parse(/* html */`
      <div class="tab-pane active" id="tabs-profile-15">
        <label class="form-label">Absolute File Path</label>
        <div class="row">
          <div class="col-lg-10">
            <div class="input-group mb-2">
              <span class="input-group-text">
                {{form_data.data.working_dir}}
              </span>
              <input type="text" class="form-control" name="fill_prompt" value="{{fill_prompt}}" placeholder="xxx.xx" autocomplete="off">
            </div>
          </div>
          <div class="col-lg-1">
            <div class="mb-3">
              <a class="btn btn-facebook w-20 btn-icon" href="#" aria-label="" on-click="@this.handleClick('ADD_NEW',{},@event)">
                <svg class="icon icon-tabler icon-tabler-plus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <desc>Download more icon variants from https://tabler-icons.io/i/plus</desc>
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `)
  },
  displayScriptCollections() {
    try {
      let _script_datas: Array<any> = this.get("script_datas");
      let _partials = [];// this.partials.script_collections;
      let _template = null;
      for (let a = 0; a < _script_datas.length; a++) {
        _template = this.renderScriptCollections({
          index: a
        });
        _partials.push({
          ..._template.t[0]
        });
      }
      _template = this.renderFirstAddTemplate({});
      _partials.push({
        ..._template.t[0]
      });
      this.resetPartial("script_collections", [
        ..._partials
      ]);
    } catch (ex) {
      console.error("displayScriptCollections - ex :: ", ex);
    }
  }
});

export default WriteSCriptCode;