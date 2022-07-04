import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './WriteScriptCodeModalView.html';
import loadjs from 'loadjs';
// Ace Editor
// import * as ace from 'brace';
// import 'brace/theme/github';

import { debounce, DebouncedFunc } from "lodash";

let myModal = null;

export interface WriteScriptCodeModalInterface extends BaseRactiveInterface {
  show: { (props: any): void }
  hide: { (): void }
  selectLanguage: { (whatLang: string): any }
  loadAceEditor?: { (): any }

}

var editor = null;
const WriteScriptCodeModal = BaseRactive.extend<WriteScriptCodeModalInterface>({
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      id_code_mirror: "code-mirror-" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {},
      allow_var_environment: null
    }
  },
  handleClick(action, props, e) {
    let _form_data = this.get("form_data");
    let _allow_var_environment = this.get("allow_var_environment");
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        _form_data.allow_var_environment = _allow_var_environment.length > 0 ? true : false;
        _form_data.content = editor.getValue().split(/\r?\n/);
        this.set("form_data", _form_data);
        console.log(this.get("form_data"));
        this.fire("listener", action, this.get("form_data"), e);
        editor = null;
        break;
    }
  },
  loadAceEditor() {
    let self = this;
    return new Promise((resolve) => {
      let loadAceEditorFunc = () => {
        let props = this.get("form_data");
        let pendingSave: DebouncedFunc<any> = null;
        editor = window.ace.edit(this.get("id_code_mirror"));
        editor.setTheme('ace/theme/github');
        editor.setOption("tabSize", 2);
        let _content = props.content == null ? [] : props.content;
        editor.setValue(_content.join("\r\n"));
        editor.clearSelection();

        let _pendingCheckTypeFile: DebouncedFunc<any> = null;
        this.observe("form_data.file_path", (val: string) => {
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
      if (window.ace == null) {
        loadjs([
          'https://cdnjs.cloudflare.com/ajax/libs/ace/1.6.0/ace.js',
        ], 'ace_editor', {
          before: function (path, scriptEl) { /* execute code before fetch */ },
          async: true,  // load files synchronously or asynchronously (default: true)
          numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
          returnPromise: false  // return Promise object (default: false)
        })
        loadjs.ready('ace_editor', {
          success: function () {
            resolve(loadAceEditorFunc());
          },
          error: function (err) {
          }
        })
      } else {
        resolve(loadAceEditorFunc());
      }
    })
  },
  async show(props) {
    this.set("form_data", props);
    this.set("allow_var_environment", props.allow_var_environment == true ? [null] : []);
    let _id_element = this.get("id_element");

    var _trrr = document.getElementById(_id_element);
    myModal = new window.bootstrap.Modal(_trrr, {
      backdrop: 'static',
      keyboard: false
    });
    myModal.show();


  },
  hide() {
    myModal.hide();
  },
  async selectLanguage(whatLang) {
    (await import("brace/mode/plain_text"));
    let language = "ace/mode/plain_text";
    switch (whatLang) {
      case 'js':
        (await import("brace/mode/javascript"));
        language = "ace/mode/javascript";
        break;
      case 'php':
        (await import("brace/mode/php"));
        language = "ace/mode/php";
        break;
      case 'html':
        (await import("brace/mode/html"));
        language = "ace/mode/html";
        break;
      case 'py':
        (await import("brace/mode/python"));
        language = "ace/mode/python";
        break;
      case 'cpp':
        (await import("brace/mode/c_cpp"));
        language = "ace/mode/c_cpp";
        break;
      case 'rs':
        (await import("brace/mode/rust"));
        language = "ace/mode/rust";
        break;
      case 'css':
        (await import("brace/mode/css"));
        language = "ace/mode/css";
        break;
      case 'json':
        (await import("brace/mode/json"));
        language = "ace/mode/json";
        break;
      case 'yaml':
        (await import("brace/mode/yaml"));
        language = "ace/mode/yaml";
        break;
      case 'sh':
        (await import("brace/mode/sh"));
        language = "ace/mode/sh";
        break;
    }
    return language;
  }
});

export default WriteScriptCodeModal;