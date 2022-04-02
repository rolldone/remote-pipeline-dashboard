import BaseRactive from "base/BaseRactive";
import Ractive from "ractive";
import template from './ConditionalCommandView.html';

export default BaseRactive.extend({
  template,
  data() {
    return {
      method_type: null
    }
  },
  partials: {
    method_type_partial: [],
    parent_condition_type: null,
    method_type: null
  },
  oncomplete() {
    console.log(this.get("config"))
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'PARENT_CONDITION':
        this.set("parent_condition_type", props.value)
        break;
      case 'METHOD_TYPE':
        this.set("method_type", props.value);
        let method_type_partial = [];
        let _template = null;
        switch (props.value) {
          case 'sftp':
          case 'rsync':
            _template = Ractive.parse(/* html */`
            <div class="row">
              <div class="col">
                <div class="form-label">Select your attachment file</div>
                <select class="form-select">
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Put the target path</label>
                <div class="input-group mb-2">
                  <div class="col">
                    <input type="text" class="form-control" placeholder="Target Path" style="width:98%;">
                  </div>
                  <div class="col-auto align-self-center">
                    <span class="form-help" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="<p>ZIP Code must be US or CDN format. You can use an extended ZIP+4 code to determine address more accurately.</p>
                    <p class='mb-0'><a href='#'>USP ZIP codes lookup tools</a></p>
                    " data-bs-html="true" data-bs-original-title="" title="">
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
          `)
            method_type_partial.push({
              ..._template.t[0]
            });
            _template = Ractive.parse(/* html */`
              <div class="row">
                <div class="col-6 col-sm-4 col-md-2 col-xl-auto mb-3">
                  <a href="#" class="btn btn-twitter w-100 btn-icon" aria-label="Twitter">
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
            method_type_partial.push({
              ..._template.t[0]
            });
            break;
          case 'command':
            _template = Ractive.parse(/* html */`
              <div class="mb-3">
                <label class="form-label">Command</label>
                <input type="text" class="form-control" name="example-text-input" placeholder="Input command">
              </div>
            `) as any;
            method_type_partial.push({
              ..._template.t[0]
            });
            break;
          case 'sftp':

            break;
        }
        this.resetPartial('method_type_partial', method_type_partial);
        break;
    }
  }
});