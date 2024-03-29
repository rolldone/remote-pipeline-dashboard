import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive"
import makeid from "base/MakeID";
import loadjs from 'loadjs';
// Ace editor
// import * as ace from 'brace';
// import 'brace/theme/github';


import { debounce, DebouncedFunc } from "lodash"



export interface SimpleScriptInterface extends BaseRactiveInterface {
  selectLanguage: { (whatLang: string): any }
  loadAceEditor?: { (): void }
}

const SimpleScript = BaseRactive.extend<SimpleScriptInterface>({
  template:/* html */`
    <fieldset class="form-fieldset" style="background:white;">
      <div class="row">
        <div class="col-lg-9">
          <div class="mb-3">
            <label class="form-label">File path</label>
            <input type="text" class="form-control" value="{{form_data.file_name}}" name="file_name">
          </div>
        </div>
        <div class="col-lg-3">
          <div class="mb-3">
            <label class="form-label">Allow environment</label>
            <label class="form-check form-switch">
              <input class="form-check-input" type="checkbox" name="{{allow_var_environment}}" on-change="@this.handleChange('ALLOW_ENVIRONMENT',{},@event)">
              <span class="form-check-label"></span>
            </label>
          </div>
        </div>
      </div>
      <div style="width: 100%; height: 500px; position:relative;border: 1px solid silver;">
        <div id="{{id_code_mirror}}" style="position: absolute; width: 100%; height: 100%;"></div>
      </div>
    </fieldset>
  `,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      id_code_mirror: "code-mirror-" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {},
      allow_var_environment: null
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      let _form_data = this.get("form_data");
      this.set("allow_var_environment", _form_data.allow_var_environment == true ? [null] : []);
      console.log("called");
      this.loadAceEditor();
      resolve();
    })
  },

  loadAceEditor() {
    let self = this;
    // debugger;
    return new Promise((resolve) => {
      let loadAceEditorFunc = () => {
        let _form_data = this.get("form_data");
        let pendingSave: DebouncedFunc<any> = null;
        let editor = window.ace.edit(this.get("id_code_mirror"));
        editor.setTheme('ace/theme/github');
        editor.setValue(_form_data.content || "");
        editor.setOption("tabSize", 2);
        editor.clearSelection();

        let _pendingSave: DebouncedFunc<any> = null;
        editor.on("change", (e) => {
          if (_pendingSave != null) {
            _pendingSave.cancel();
          }
          _pendingSave = debounce(() => {
            let textStr: string = editor.getValue();
            this.set("form_data.content", textStr);
            this.fire("listener", "SAVE", this.get("form_data"), e);
          }, 2000);
          _pendingSave();
        })

        let _pendingCheckTypeFile: DebouncedFunc<any> = null;
        this.observe("form_data.file_name", (val: string) => {
          if (_pendingCheckTypeFile != null) {
            _pendingCheckTypeFile.cancel();
          }
          _pendingCheckTypeFile = debounce(async () => {
            let _ext = val.split('.').pop();
            let language = await this.selectLanguage(_ext);
            if (language != null) {
              editor.getSession().setMode(language);
            }
          }, 2000);
          _pendingCheckTypeFile();
        });
        return window.ace;
      }


      try {
        let randomText = this.get("id_code_mirror");
        loadjs([
          'https://cdnjs.cloudflare.com/ajax/libs/ace/1.6.0/ace.js',
        ], 'ace_editor_' + randomText, {
          before: function (path, scriptEl) { /* execute code before fetch */ },
          async: true,  // load files synchronously or asynchronously (default: true)
          numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
          returnPromise: false  // return Promise object (default: false)
        })
        loadjs.ready('ace_editor_' + randomText, {
          success: function () {
            resolve(loadAceEditorFunc());
          },
          error: function (err) {
          }
        })
        // if (window.ace == null) {
        // }
      } catch (error) {
        resolve(loadAceEditorFunc());
      }
    })
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'ALLOW_ENVIRONMENT':
        this.set("form_data.allow_var_environment", $(e.target).is(":checked"));
        this.fire("listener", "SAVE", this.get("form_data"), e);
        break;
    }
  },
  async selectLanguage(whatLang) {
    // (await import("brace/mode/plain_text"));
    let language = "ace/mode/plain_text";
    switch (whatLang) {
      case 'js':
        // (await import("brace/mode/javascript"));
        language = "ace/mode/javascript";
        break;
      case 'php':
        // (await import("brace/mode/php"));
        language = "ace/mode/php";
        break;
      case 'html':
        // (await import("brace/mode/html"));
        language = "ace/mode/html";
        break;
      case 'py':
        // (await import("brace/mode/python"));
        language = "ace/mode/python";
        break;
      case 'cpp':
        // (await import("brace/mode/c_cpp"));
        language = "ace/mode/c_cpp";
        break;
      case 'rs':
        // (await import("brace/mode/rust"));
        language = "ace/mode/rust";
        break;
      case 'css':
        // (await import("brace/mode/css"));
        language = "ace/mode/css";
        break;
      case 'json':
        // (await import("brace/mode/json"));
        language = "ace/mode/json";
        break;
      case 'yaml':
        // (await import("brace/mode/yaml"));
        language = "ace/mode/yaml";
        break;
      case 'sh':
        // (await import("brace/mode/sh"));
        language = "ace/mode/sh";
        break;
    }
    return language;
  }
})


export default SimpleScript;