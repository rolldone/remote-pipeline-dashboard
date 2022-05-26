import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import PipelineItemService from "services/PipelineItemService";
import PipelineService from "services/PipelineService";
import RepositoryService from "services/RepositoryService";


export interface Step2Interface extends BaseRactiveInterface {
  getPipelines?: { (): Promise<any> }
  setPipelines?: { (props: any): void }
  getPipelineItems?: { (): Promise<any> }
  setPipelineItems?: { (props: any): void }
  getBranchs?: { (): void }
  setBranchs?: { (props: any): void }
}

const Step2 = BaseRactive.extend<Step2Interface>({
  template: /* html */`
    <div class="card card-md">
      <div class="card-body text-center py-4 p-sm-5">
      <!-- <img src="./static/illustrations/undraw_sign_in_e6hj.svg" height="128" class="mb-n2" alt=""> -->
      <h1 class="mt-1">Create new Execution!</h1>
      <p class="text-muted">Select the pipeline, which the pipeline you want run it.</p>
      </div>
      <div class="hr-text hr-text-center hr-text-spaceless">Step 2</div>
      <div class="card-body">
        <div class="mb-3">
          <div class="form-label">Select Pipeline</div>
          <select class="form-select" value="{{form_data.pipeline_id}}" name="pipeline_id" on-change="@this.handleChange('SELECT_PIPELINE',{},@event)">
            <option value="">--</option>
            {{#pipeline_datas:i}}
            <option value="{{id}}" data-index="{{i}}">{{name}}</option>
            {{/pipeline_datas}}
          </select>
        </div>
        {{#if pipeline_data.from_provider != null}}
        <div class="mb-3">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Repository {{pipeline_data.repo_name}} From {{pipeline_data.from_provider}}</h3>
            </div>
            <div class="list-group list-group-flush">
              {{#branch_datas:i}}
              <div class="list-group-item">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <input type="radio" class="form-check-input" name="{{form_data.branch}}" value="{{name}}" checked on-change="@this.handleChange('CHECK_PIPELINE_ITEM',{ id : id, index : i },@event)">
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
              {{/branch_datas}}
            </div>
          </div>
        </div>
        {{/if}}
        <div class="mb-3">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Pipeline Items</h3>
            </div>
            <div class="list-group list-group-flush">
              {{#pipeline_item_datas:i}}
              <div class="list-group-item">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <input type="checkbox" class="form-check-input" name="{{form_data.pipeline_item_ids}}" value="{{id}}" checked on-change="@this.handleChange('CHECK_PIPELINE_ITEM',{ id : id, index : i },@event)">
                  </div>
                  <div class="col-auto">
                    <span class="avatar" style="background-image: url(./static/avatars/003f.jpg)"></span>
                  </div>
                  <div class="col text-truncate">
                    <span class="text-reset d-block">{{name}}</span>
                    <div class="d-block text-muted text-truncate mt-n1">{{description}}</div>
                  </div>
                </div>
              </div>
              {{/pipeline_item_datas}}
              
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row align-items-center mt-3">
      <div class="col-4">
        <div class="progress">
          <div class="progress-bar" style="width: 50%" role="progressbar" aria-valuenow="50" aria-valuemin="0"
            aria-valuemax="100" aria-label="50% Complete">
            <span class="visually-hidden">50% Complete</span>
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
      pipeline_datas: [],
      pipeline_item_datas: [],
      branch_datas: [],
      pipeline_data: {}
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      let _form_data = this.get("form_data");
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
        this.setBranchs(await this.getBranchs());
        this.setPipelineItems(await this.getPipelineItems());
        // await this.handleChange('SELECT_PIPELINE', {}, { preventDefault: () => { } })
      }
      resolve();
    });
  },
  async handleChange(action, props, e) {
    let _pipeline_datas = this.get("pipeline_datas");
    let _pipeline_data = this.get("pipeline_data");
    switch (action) {
      case 'SELECT_PIPELINE':
        let index = $(e.target).find(':selected').attr("data-index");
        _pipeline_data = _pipeline_datas[index];
        await this.set("pipeline_data", _pipeline_data);
        this.setPipelineItems(await this.getPipelineItems());
        this.setBranchs(await this.getBranchs());
        break;
      case 'CHECK_PIPELINE_ITEM':
        console.log(this.get("form_data"));
        break;
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-one"
        }, e);
        break;
      case 'CONTINUE':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-three"
        }, e);
        break;
    }
  },
  async getPipelines() {
    try {
      let _form_data = this.get("form_data");
      let resData = await PipelineService.getPipelines({
        project_id: _form_data.project_id
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
  async getPipelineItems() {
    try {
      let _form_data = this.get("form_data");
      let resData = await PipelineItemService.getPipelineItems({
        project_id: _form_data.project_id,
        pipeline_id: _form_data.pipeline_id
      });
      return resData;
    } catch (ex) {
      console.error("getPipelineItems - ex :: ", ex);
    }
  },
  setPipelineItems(props) {
    if (props == null) return;
    this.set("pipeline_item_datas", props.return);
  },
  async getBranchs() {
    try {
      let _form_data = this.get("form_data");
      let pipeLineData = this.get("pipeline_data");
      let resData = await RepositoryService.getBranchs({
        oauth_user_id: pipeLineData.oauth_user_id,
        from_provider: pipeLineData.from_provider,
        repo_name: pipeLineData.repo_name
      });
      return resData;
    } catch (ex) {
      console.error("getBranchs - ex :: ", ex);
    }
  },
  setBranchs(props) {
    if (props == null) return;
    this.set("branch_datas", props.return);
  }
});

export default Step2;