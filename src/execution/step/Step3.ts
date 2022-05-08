import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import HostService from "services/HostService";
import VariableService from "services/VariableService";

export interface Step3Interface extends BaseRactiveInterface {
  getHosts?: { (): Promise<any> }
  setHOst?: { (props: any): void }
  getVariables?: { (): Promise<any> }
  setVariables?: { (props: any): void }
}

/**
 * Variable and host
 * - Can select multiple host group maybe
 * - Can select multiple variable 
 * - Anything will work with loop
 */
export default BaseRactive.extend<Step3Interface>({
  template: /* html */`
    <div class="card card-md">
      <div class="card-body text-center py-4 p-sm-5">
      <!-- <img src="./static/illustrations/undraw_sign_in_e6hj.svg" height="128" class="mb-n2" alt=""> -->
      <h1 class="mt-1">Create new Execution!</h1>
      <p class="text-muted">Select the host and variable, which the host and variable you want combine it.</p>
      </div>
      <div class="hr-text hr-text-center hr-text-spaceless">Step 3</div>
      <div class="card-body">
        <div class="mb-3">
          <div class="form-label">Select Variable</div>
          <select class="form-select" value="{{form_data.variable_id}}" name="variable_id" on-change="@this.handleChange('SELECT_VARIABLE',{},@event)">
            <option value="">--</option>
            {{#variable_datas:i}}
            <option value="{{id}}" index="{{i}}">{{name}}</option>
            {{/variable_datas}}
          </select>
        </div>
        <div class="mb-3">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Variables</h3>
            </div>
            <div class="list-group list-group-flush">
              {{#variable_datas[select_variable_index].data:i}}
              <div class="list-group-item">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <input type="radio" class="form-check-input" name="{{form_data.variable_option}}" value="{{name}}" checked on-change="@this.handleChange('CHECK_PIPELINE_ITEM',{ id : id, index : i },@event)" disabled={{!is_active}}>
                  </div>
                  <div class="col-auto">
                    <span class="avatar" style="background-image: url(./static/avatars/003f.jpg)"></span>
                  </div>
                  <div class="col text-truncate">
                    <span class="text-reset d-block">{{name}}</span>
                    <div class="d-block text-muted text-truncate mt-n1">--</div>
                  </div>
                </div>
              </div>
              {{/variable_datas[select_variable_index].data}}
            </div>
          </div>
        </div>
        <div class="mb-3">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Hosts</h3>
            </div>
            <div class="list-group list-group-flush">
              {{#host_datas:i}}
              <div class="list-group-item">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <input type="checkbox" class="form-check-input" name="{{form_data.host_ids}}" value="{{id}}" checked on-change="@this.handleChange('CHECK_PIPELINE_ITEM',{ id : id, index : i },@event)">
                  </div>
                  <div class="col-auto">
                    <a href="#">
                      <span class="avatar" style="background-image: url(./static/avatars/003f.jpg)"></span>
                    </a>
                  </div>
                  <div class="col text-truncate">
                    <a href="#" class="text-reset d-block">{{name}}</a>
                    <div class="d-block text-muted text-truncate mt-n1">{{description}}</div>
                  </div>
                </div>
              </div>
              {{/host_datas}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row align-items-center mt-3">
      <div class="col-4">
        <div class="progress">
          <div class="progress-bar" style="width: 80%" role="progressbar" aria-valuenow="80" aria-valuemin="0"
            aria-valuemax="100" aria-label="80% Complete">
            <span class="visually-hidden">80% Complete</span>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="btn-list justify-content-end">
          <a href="#" class="btn btn-link link-secondary">
            Back
          </a>
          <a href="#" class="btn btn-primary" on-click="@this.handleClick('CONTINUE',{},@event)">
            Continue
          </a>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      form_data: {},
      variable_datas: {},
      select_variable_index: null,
      host_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      let _form_data = this.get("form_data");
      this.setVariables(await this.getVariables());
      this.setHOst(await this.getHosts());
      if (_form_data.variable_id != null) {
        let e = await $.when($("select[name='variable_id']").get(0));
        await this.handleChange("SELECT_VARIABLE", {}, {
          target: e
        });
      }
      resolve();
    });
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'SELECT_VARIABLE':
        var element = $(e.target).find('option:selected');
        this.set("select_variable_index", element.attr("index"));
        console.log(element.attr("index"));
        break;
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-two"
        }, e);
        break;
      case 'CONTINUE':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-four"
        }, e);
        break;
    }
  },
  async getHosts() {
    try {
      let _form_data = this.get("form_data");
      let resData = await HostService.getHosts({});
      return resData;
    } catch (ex) {
      console.error("getHosts - ex :: ", ex);
    }
  },
  setHOst(props) {
    if (props == null) return;
    this.set("host_datas", props.return);
  },
  async getVariables() {
    try {
      let _form_data = this.get("form_data");
      let resData = await VariableService.getVariables({
        project_id: _form_data.project_id,
        pipeline_id: _form_data.pipeline_id
      });
      return resData;
    } catch (ex) {
      console.error("getVariables - ex :: ", ex);
    }
  },
  setVariables(props) {
    if (props == null) return;
    let _datas = props.return;
    this.set("variable_datas", _datas);
  }
});