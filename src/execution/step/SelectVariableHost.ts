import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import HostService from "services/HostService";
import PipelineService from "services/PipelineService";
import VariableService from "services/VariableService";

export interface SelectVariableHostInterface extends BaseRactiveInterface {
  getHosts?: { (): Promise<any> }
  setHOst?: { (props: any): void }
  getVariables?: { (): Promise<any> }
  setVariables?: { (props: any): void }
  getPipelines?: { (): Promise<any> }
  setPipelines?: { (props: any): void }
}

/**
 * Variable and host
 * - Can select multiple host group maybe
 * - Can select multiple variable 
 * - Anything will work with loop
 */
const SelectVariableHost = BaseRactive.extend<SelectVariableHostInterface>({
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
                    <input type="radio" data-value="{{value}}" class="form-check-input" name="{{form_data.variable_option}}" value="{{name}}" checked on-change="@this.handleChange('CHECK_PIPELINE_ITEM',{ id : id, index : i },@event)" disabled={{!is_active}}>
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
        {{#if pipeline_data.connection_type == "ssh"}}
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
                    <input type="checkbox" data-name="host_ids" class="form-check-input" name="{{host_ids}}" value="{{id}}" on-change="@this.handleChange('CHECK_HOST_IDS',{ id : id, index : i },@event)">
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
        {{/if}}
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
          <a href="#" class="btn btn-link link-secondary" on-click="@this.handleClick('BACK',{},@event)">
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
      pipeline_data: {},
      variable_datas: {},
      select_variable_index: null,
      host_datas: [],
      host_ids: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      let _form_data = this.get("form_data");
      this.set("host_ids", _form_data.host_ids || []);
      this.setVariables(await this.getVariables());
      this.setHOst(await this.getHosts());
      if (_form_data.variable_id != null) {
        let e = await $.when($("select[name='variable_id']").get(0));
        await this.handleChange("SELECT_VARIABLE", {}, {
          target: e
        });
      }

      this.setPipelines(await this.getPipelines());
      // Create skenario
      if (_form_data.pipeline_id != null) {
        let _pipeline_datas = this.get("pipeline_datas");
        let _pipeline_data = this.get("pipeline_data");
        for (let a = 0; a < _pipeline_datas.length; a++) {
          if (_pipeline_datas[a].id == _form_data.pipeline_id) {
            _pipeline_data = _pipeline_datas[a];
            break;
          }
        }
        this.set("pipeline_data", _pipeline_data)
      }

      resolve();
    });
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'CHECK_HOST_IDS':
        let host_ids = $("input[data-name=host_ids]");
        let checked = [];
        host_ids.each((i, el) => {
          if ($(el).is(":checked") == true) {
            checked.push($(el).val());
          }
        })
        // this.set("form_data.host_ids", checked);
        break;
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
          component: "step-three"
        }, e);
        break;
      case 'CONTINUE':
        e.preventDefault();
        this.set("form_data.host_ids", this.get("host_ids") || []);
        this.fire("listener", action, {
          component: "step-five"
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
  },
  async getPipelines() {
    try {
      let _form_data = this.get("form_data");
      let resData = await PipelineService.getPipelines({
        project_id: _form_data.project_id,
      });
      return resData;
    } catch (ex) {
      console.error("getProjects - ex :: ", ex);
    }
  },
  setPipelines(props) {
    if (props == null) return;
    this.set("pipeline_datas", props.return)
  },
});

export default SelectVariableHost;