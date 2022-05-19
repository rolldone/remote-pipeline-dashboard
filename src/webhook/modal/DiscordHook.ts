import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

const DiscordHook = BaseRactive.extend<BaseRactiveInterface>({
  template:/* html */`
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
              <label class="form-label">Webhook url</label>
              <input class="form-control" type="text" placeholder="https://discord.com/api/webhooks/xxx..." value="{{form_data.webhook_url}}" name="webhook_url">
            </div>
          </div>
          <div class="tab-pane" id="tabs-profile-15">
            <label class="form-label">Message post data</label>
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
  `
});

export default DiscordHook;