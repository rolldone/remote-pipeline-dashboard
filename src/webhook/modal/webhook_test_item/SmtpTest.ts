import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import WebHookService from "services/WebHookService";
import loadjs from 'loadjs';
import { debounce, DebouncedFunc } from "lodash";
import yamlJSON from 'json-to-pretty-yaml';
import yaml from 'yaml';

export interface SmtpTestInterface extends BaseRactiveInterface {
  submit?: { (): void }
  loadCkEditor?: { (): any }
  loadAceEditor?: { (): any }
}

export interface SubmitDataInterface {
  id?: number
  data?: any
  type?: string
  key?: string
}

export interface HookDataInterface {
  hook_id?: string
  webhook_type?: string
  key?: string
}

export interface FormDataInterface {
  subject?: string
  message?: string
  message_type?: string
  message_text?: string
  message_object?: string
}

const SmtpTest = BaseRactive.extend<SmtpTestInterface>({
  template: /* html */`
    <div class="modal-body">
      <div class="mb-3">
        <label class="form-label">Subject</label>
        <input type="text" class="form-control" name="subject" value="{{form_data.subject}}" placeholder="Subject...">
      </div>
      <div class="mb-3">
        <div class="row">
          <div class="mb-3">
            <div class="btn-group w-100">
              <button type="button" on-click="@this.handleClick('SELECT_MESSAGE_TYPE','text',@event)" class="btn {{form_data.message_type=='text'?'btn-primary':''}}">
                Text
              </button>
              <button type="button" on-click="@this.handleClick('SELECT_MESSAGE_TYPE','yaml',@event)" class="btn {{form_data.message_type=='yaml'?'btn-primary':''}}">
                Yaml
              </button>
            </div>
          </div>
          <div class="mb-3">
            {{#if form_data.message_type == "text"}}
              <textarea id="test-message-23423" style="visibility:hidden;"></textarea>
            {{else}}
              <div style="position:relative; height:500px;">
                <div id="test-editor-mvadmv" style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;"></div>
              </div>
            {{/if}}
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <a class="btn btn-link link-secondary" href="#" data-bs-dismiss="modal">Cancel</a> 
      <a class="btn btn-primary ms-auto" href="#" on-click="@this.handleClick('SUBMIT',{},@event)">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line></svg> 
        Submit
      </a>
    </div>
  `,
  data() {
    return {
      form_data: {
        message_type: "text",
        message_text: "Oh! Come and see the violence inherent in the system! Help, help, I'm being repressed! We shall say 'Ni' again to you, if you do not appease us. I'm not a witch. I'm not a witch. Camelot!"
      },
      hook_data: {}
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      console.log(this.get("hook_data"));
      _super();
      let _form_data = this.get("form_data");
      switch (_form_data.message_type) {
        default:
          this.set("form_data.message_type", "text");
        // without break;
        case 'text':
          this.loadCkEditor();
          break;
        case 'html':
          this.loadAceEditor();
          break;
      }
      resolve();
    });
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SELECT_MESSAGE_TYPE':
        this.set("form_data.message_type", props);
        switch (props) {
          case 'text':
            setTimeout(() => {
              this.loadCkEditor();
            }, 1000);
            break;
          case 'yaml':
            if (window.CKEDITOR) {
              for (let name in window.CKEDITOR.instances) {
                window.CKEDITOR.instances[name].destroy()
              }
            }
            setTimeout(() => {
              this.loadAceEditor();
            }, 1000)
            break;
        }
        break;
      case 'SUBMIT':
        e.preventDefault();
        this.submit();
        break;
    }
  },
  loadAceEditor() {
    let self = this;
    return new Promise((resolve) => {
      let loadAceEditorFunc = () => {
        let pendingSave: DebouncedFunc<any> = null;
        var editor = window.ace.edit("test-editor-mvadmv");
        editor.setTheme("ace/theme/github");
        editor.session.setMode("ace/mode/yaml");
        self.set("form_data.message_object", self.get("message_object") || {
          "link": "http://your-link.com/xxx",
          "name": "John",
          "email": "john@mail.com"
        });
        editor.setValue(yamlJSON.stringify(self.get("form_data.message_object")));
        editor.getSession().on('change', debounce(function () {
          self.set("form_data.message_object", yaml.parse(editor.getValue()));
        }, 1000))
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
  loadCkEditor() {
    let self = this;
    return new Promise((resolve) => {
      let loadCkEditor = () => {
        let pendingSave: DebouncedFunc<any> = null;
        window.CKEDITOR.replace(document.getElementById('test-message-23423'))
        window.CKEDITOR.on('instanceReady', function (event) {
          event.editor.on("change", function () {
            if (pendingSave != null) {
              pendingSave.cancel();
            }
            pendingSave = debounce((event) => {
              self.set("form_data.message_text", event.editor.getData());
            }, 1000);
            pendingSave(event);
          });
          for (let name in window.CKEDITOR.instances) {
            window.CKEDITOR.instances[name].setData(self.get("form_data.message_text"))
          }
        })
        return window.CKEDITOR;
      }
      if (window.CKEDITOR == null) {
        loadjs([
          'https://cdn.ckeditor.com/4.19.0/standard-all/ckeditor.js',
        ], 'foobar', {
          before: function (path, scriptEl) { /* execute code before fetch */ },
          async: true,  // load files synchronously or asynchronously (default: true)
          numRetries: 3, // see caveats about using numRetries with async:false (default: 0),
          returnPromise: false  // return Promise object (default: false)
        })
        loadjs.ready('foobar', {
          success: function () {
            resolve(loadCkEditor());
          },
          error: function (err) {
          }
        })
      } else {
        resolve(loadCkEditor());
      }
    })
  },
  async submit() {
    try {
      let _form_data: FormDataInterface = this.get("form_data");
      let _hook_data: HookDataInterface = this.get("hook_data");
      let _props: any = {};
      
      switch (_form_data.message_type) {
        case 'text':
          _form_data.message = _form_data.message_text;
          break;
        case 'yaml':
          console.log(_form_data.message_object);
          _form_data.message = _form_data.message_object;
          break;
      }
      
      // delete _form_data.message_object;
      // delete _form_data.message_text;

      _props.webhook_id = _hook_data.hook_id;
      _props.data = _form_data;
      _props.type = _hook_data.webhook_type;
      _props.key = _hook_data.key;
      let resData = await WebHookService.executeItemTest(_props);
      console.log(resData);
    } catch (ex) {
      console.error("submit - ex :: ", ex);
    }
  }
});

export default SmtpTest;