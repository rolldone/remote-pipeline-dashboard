import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { debounce, DebouncedFunc } from "lodash";
import scriptjs from 'scriptjs';
import loadjs from 'loadjs';

export interface SmtpHookInterface extends BaseRactiveInterface {
  listenNameToBeKeySlug?: { (): void }
  loadCkEditor?: { (): any }
  destroy?: { (): void }
}

declare let ClassicEditor: any;
declare let SourceEditing: any;
declare let window: Window;

const SmtpHook = BaseRactive.extend<SmtpHookInterface>({
  template: /* html */`
    <div class="modal-body">
      <div class="card">
        <ul class="nav nav-tabs nav-fill" data-bs-toggle="tabs">
          <li class="nav-item">
            <a href="#tabs-home-15" class="nav-link active" data-bs-toggle="tab">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings-automation" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
              <path d="M10 9v6l5 -3z"></path>
            </svg>
            &nbsp;
            Configuration
            </a>
          </li>
          <li class="nav-item">
            <a href="#tabs-profile-15" class="nav-link" data-bs-toggle="tab">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
            </svg>
            &nbsp;
            To
            </a>
          </li>
          <li class="nav-item">
            <a href="#tabs-profile-16" class="nav-link" data-bs-toggle="tab">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-message-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 20l-3 -3h-2a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-2l-3 3"></path>
              <line x1="8" y1="9" x2="16" y2="9"></line>
              <line x1="8" y1="13" x2="14" y2="13"></line>
            </svg>
            &nbsp;
            Message
            </a>
          </li>
        </ul>
        <div class="card-body">
          <div class="tab-content">
            <div class="tab-pane active show" id="tabs-home-15">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input class="form-control" type="text" placeholder="" value="{{form_data.name}}" name="name">
              </div>
              <div class="mb-3">
                <label class="form-label">Key Tag</label>
                <input class="form-control" type="text" placeholder="" value="{{form_data.key}}" name="key" readonly>
              </div>
              <div class="mb-3">
                <label class="form-label">Smtp Server</label>
                <input class="form-control" type="text" placeholder="xxx.xxx.xxx.xxx" value="{{form_data.host_name}}" name="host_name">
              </div>
              <div class="mb-3">
                <label class="form-label">Port</label>
                <input class="form-control" type="number" placeholder="25" value="{{form_data.port}}" name="port">
              </div>
              <div class="mb-3">
                <label class="form-label">Security</label>
                <select name="sso" class="form-select" value="{{form_data.sso}}">
                  <option value="Auto">Auto</option>
                  <option value="None">None</option>
                  <option value="SslOnConnect">SSL</option>
                  <option value="StartTls">Tls</option>
                  <option value="StartTlsWhenAvailable">Tls when available</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input class="form-control" type="text" placeholder="" value="{{form_data.username}}" name="username">
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input class="form-control" type="password" placeholder="xxx.." value="{{form_data.password}}" name="password">
              </div>
              <div class="mb-3">
                <label class="form-label">From name</label>
                <input class="form-control" type="text" placeholder="xxx.." value="{{form_data.from_name}}" name="from_name">
              </div>
              <div class="mb-3">
                <label class="form-label">From email address</label>
                <input class="form-control" type="email" placeholder="xxx.." value="{{form_data.from_email}}" name="from_email">
              </div>
            </div>
            <div class="tab-pane" id="tabs-profile-15">
              <label class="form-label">Send Mail To</label>
              {{#each form_data.to_datas:i}}
              <div class="row">
                <div class="col-lg-11">
                  <div class="mb-3">
                    <input type="text" class="form-control" name="to_data" value="{{form_data.to_datas[i]}}" placeholder="Input placeholder">
                  </div>
                </div>
                <div class="col-lg-1">
                  <div class="mb-3">
                    <a href="#" class="btn btn-red w-100 btn-icon" aria-label="" on-click="@this.handleClick('REMOVE_TO',{ index : i },@event)">
                      <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-minus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <desc>Download more icon variants from https://tabler-icons.io/i/minus</desc>
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              {{/each}}
              <div class="row">
                <div class="col-lg-11">
                  <div class="mb-3">
                    <input type="email" class="form-control" name="input_to" value="{{input_to}}"  placeholder="Input placeholder">
                  </div>
                </div>
                <div class="col-lg-1">
                  <div class="mb-3">
                    <a href="#" class="btn btn-facebook w-100 btn-icon" aria-label="" on-click="@this.handleClick('ADD_TO',{},@event)">
                      <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
            <div class="tab-pane" id="tabs-profile-16">
              <div class="row">
                <div class="mb-3">
                  <div class="btn-group w-100">
                    <button type="button" on-click="@this.handleClick('SELECT_MESSAGE_TYPE','text',@event)" class="btn {{form_data.message_type=='text'?'btn-primary':''}}">
                      Text
                    </button>
                    <button type="button" on-click="@this.handleClick('SELECT_MESSAGE_TYPE','html',@event)" class="btn {{form_data.message_type=='html'?'btn-primary':''}}">
                      Html
                    </button>
                  </div>
                </div>
                <div class="mb-3">
                  {{#if form_data.message_type == "text"}}
                    <textarea id="message-body" style="visibility:hidden;">

                    </textarea>
                  {{else}}

                  {{/if}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <a class="btn btn-link link-secondary" href="#" data-bs-dismiss="modal">Cancel</a>
      <a class="btn btn-primary ms-auto" href="#" data-bs-dismiss="modal"
        on-click="@this.handleClick('SUBMIT',{},@event)">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg> Update </a>
    </div>
  `,
  data() {
    return {
      input_to: "",
      form_data: {
        to_datas: [],
        message_type: "text"
      }
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      this.listenNameToBeKeySlug();
      _super();

      resolve();
    })
  },
  destroy() {
    if (window.CKEDITOR) {
      for (let name in window.CKEDITOR.instances) {
        window.CKEDITOR.instances[name].destroy()
      }
      window.CKEDITOR.removeAllListeners();
    }
  },
  loadCkEditor() {
    let self = this;
    return new Promise((resolve) => {
      let loadCkEditor = () => {
        let pendingSave: DebouncedFunc<any> = null;
        window.CKEDITOR.replace(document.getElementById('message-body'))
        window.CKEDITOR.on('instanceReady', function (event) {
          event.editor.on("change", function () {
            if (pendingSave != null) {
              pendingSave.cancel();
            }
            pendingSave = debounce((event) => {
              console.log(event.editor.getData());
              self.set("form_data.message", event.editor.getData());
            }, 1000);
            pendingSave(event);
          });
          for (let name in window.CKEDITOR.instances) {
            window.CKEDITOR.instances[name].setData(self.get("form_data.message"))
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
  listenNameToBeKeySlug() {
    this.observe("form_data.name", (val) => {
      if (val == null) return;
      this.set("form_data.key", val.split(" ").join("-"));
    })
  },
  handleClick(action, props, e) {
    let _to_datas = this.get("form_data.to_datas") || [];
    let _form_data = this.get("form_data");
    switch (action) {
      case 'SELECT_MESSAGE_TYPE':
        this.set("form_data.message_type", props);
        switch (props) {
          case 'text':
            setTimeout(() => {
              this.loadCkEditor();
            }, 1000);
            break;
          case 'html':
            if (window.CKEDITOR) {
              for (let name in window.CKEDITOR.instances) {
                window.CKEDITOR.instances[name].destroy()
              }
            }
            break;
        }
        break;
      case 'SUBMIT':
        e.preventDefault();
        this.fire("listener", action, _form_data, e);
        break;
      case 'ADD_TO':
        e.preventDefault();
        let _input_to = this.get("input_to");
        _to_datas.push(_input_to);
        this.set("form_data.to_datas", _to_datas);
        this.set("input_to", "");
        break;
      case 'REMOVE_TO':
        e.preventDefault();
        _to_datas.splice(props.index, 1);
        setTimeout(() => {
          this.set("form_data.to_datas", _to_datas);
        }, 100)
        break;
    }
  }
});

export default SmtpHook;