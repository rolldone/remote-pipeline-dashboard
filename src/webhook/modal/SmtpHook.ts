import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { debounce } from "lodash";

export interface SmtpHookInterface extends BaseRactiveInterface {
  listenNameToBeKeySlug?: { (): void }
}

const SmtpHook = BaseRactive.extend<SmtpHookInterface>({
  template: /* html */`
    <div class="modal-body">
      <div class="card">
        <ul class="nav nav-tabs nav-fill" data-bs-toggle="tabs">
          <li class="nav-item">
            <a href="#tabs-home-15" class="nav-link active" data-bs-toggle="tab">Configuration</a>
          </li>
          <li class="nav-item">
            <a href="#tabs-profile-15" class="nav-link" data-bs-toggle="tab">To</a>
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
                <label class="form-label">From email address</label>
                <input class="form-control" type="email" placeholder="xxx.." value="{{form_data.from_email}}" name="from_email">
              </div>
            </div>
            <div class="tab-pane" id="tabs-profile-15">
              <label class="form-label">Send Mail To</label>
              {{#each to_datas:i}}
              <div class="row">
                <div class="col-lg-11">
                  <div class="mb-3">
                    <input type="text" class="form-control" name="to_data" value="{{to_datas[i]}}" placeholder="Input placeholder">
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
      to_datas: [],
      input_to: "",
      form_data: {}
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
  listenNameToBeKeySlug() {
    this.observe("form_data.name", (val) => {
      if (val == null) return;
      this.set("form_data.key", val.split(" ").join("-"));
    })
  },
  handleClick(action, props, e) {
    let _to_datas = this.get("to_datas");
    let _form_data = this.get("form_data");
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        this.fire("listener", action, _form_data, e);
        break;
      case 'ADD_TO':
        e.preventDefault();
        let _input_to = this.get("input_to");
        _to_datas.push(_input_to);
        this.set("to_datas", _to_datas);
        this.set("form_data", {
          ...this.get("form_data"),
          to_datas: _to_datas
        });
        this.set("input_to", "");
        break;
      case 'REMOVE_TO':
        e.preventDefault();
        _to_datas.splice(props.index, 1);
        setTimeout(() => {
          this.set("to_datas", _to_datas);
          this.set("form_data", {
            ...this.get("form_data"),
            to_datas: _to_datas
          });
        }, 100)
        break;
    }
  }
});

export default SmtpHook;