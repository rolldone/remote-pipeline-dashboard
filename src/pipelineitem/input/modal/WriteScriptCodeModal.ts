import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './WriteScriptCodeModalView.html';
import { basicSetup } from "@codemirror/basic-setup"
import { EditorView, keymap } from "@codemirror/view"
import { javascript } from "@codemirror/lang-javascript"
import { indentWithTab } from "@codemirror/commands"
import { EditorSelection, Compartment, EditorState, Text as TextState } from "@codemirror/state"
import { dirname } from "path";

const languageConf = new Compartment

export interface WriteScriptCodeModalInterface extends BaseRactiveInterface {
  show: { (props: any): void }
  hide: { (): void }
  selectLanguage: { (whatLang: string): any }
}

var editor = null;
const WriteScriptCodeModal = BaseRactive.extend<WriteScriptCodeModalInterface>({
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {}
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        this.set("form_data.content", editor.state.doc.toJSON());
        this.fire("listener", action, this.get("form_data"), e);
        // editor = null;
        break;
    }
  },
  async show(props) {
    this.set("form_data", props);
    let _id_element = this.get("id_element");

    var _trrr = document.getElementById(_id_element);
    var myModal = new window.bootstrap.Modal(_trrr, {
      backdrop: 'static',
      keyboard: false
    });
    myModal.show();

    let _ext = props.file_path.split('.').pop();

    let _extentions = [
      basicSetup,
      keymap.of([indentWithTab]),
    ]

    let selectLanguage = await this.selectLanguage(_ext);
    if (selectLanguage != null) {
      _extentions.push(
        languageConf.of(selectLanguage)
      )
    }

    let mySelector = document.getElementById("my-selector");

    mySelector.innerHTML = "";
    editor = null;

    if (props.content == null) {
      props.content = [];
    }

    editor = new EditorView({
      state: EditorState.create({
        extensions: _extentions,
        doc: props.content.join("\r\n")
      }),
      parent: mySelector
    })
    _trrr.addEventListener('hidden.bs.modal', (event) => {
      // do something...
    })
    // editor.dispatch(editor.state.changeByRange(range => ({
    //   changes: [{ from: range.from, insert: "_" }, { from: range.to, insert: "_" }],
    //   range: EditorSelection.range(range.from + 2, range.to + 2)
    // })))
  },
  hide() {
    let _id_element = this.get("id_element");
    var _trrr = document.getElementById(_id_element);
    var myModal = new window.bootstrap.Modal(_trrr, {
      backdrop: 'static',
      keyboard: false
    });
    myModal.hide();
  },
  async selectLanguage(whatLang) {
    let language: any = null;
    switch (whatLang) {
      case 'js':
        language = (await import("@codemirror/lang-javascript"));
        language = language.javascript();
        break;
      case 'php':
        language = (await import("@codemirror/lang-php"));
        language = language.php();
        break;
      case 'html':
        language = (await import("@codemirror/lang-html"));
        language = language.html();
        break;
      case 'py':
        language = (await import("@codemirror/lang-python"));
        language = language.python();
        break;
      case 'cpp':
        language = (await import("@codemirror/lang-cpp"));
        language = language.cpp();
        break;
      case 'rs':
        language = (await import("@codemirror/lang-rust"));
        language = language.rust();
        break;
      case 'css':
        language = (await import("@codemirror/lang-css"));
        language = language.css();
        break;
      case 'json':
        language = (await import("@codemirror/lang-json"));
        language = language.json();
        break;
      case 'yaml':
        break;
    }
    return language;
  }
});

export default WriteScriptCodeModal;