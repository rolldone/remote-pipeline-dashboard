import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import PipelineItemService from "services/PipelineItemService";
import PipelineService from "services/PipelineService";
import ProjectService from "services/ProjectService";


export interface Step2Interface extends BaseRactiveInterface {
  getPipelines?: { (): Promise<any> }
  setPipelines?: { (props: any): void }
  getPipelineItems?: { (): Promise<any> }
  setPipelineItems?: { (props: any): void }
}

export default BaseRactive.extend<Step2Interface>({
  template: /* html */`
    <div class="card card-md">
      <div class="card-body text-center py-4 p-sm-5">
      <!-- <img src="./static/illustrations/undraw_sign_in_e6hj.svg" height="128" class="mb-n2" alt=""> -->
      <h1 class="mt-1">Create new Execution!</h1>
      <p class="text-muted">Select the pipeline, which the pipeline you want run it.</p>
      </div>
      <div class="hr-text hr-text-center hr-text-spaceless">Step 1</div>
      <div class="card-body">
        <div class="mb-3">
          <div class="form-label">Select Pipeline</div>
          <select class="form-select" value="{{form_data.pipeline_id}}" name="pipeline_id" on-change="@this.handleChange('SELECT_PIPELINE',{},@event)">
            <option value="">--</option>
            {{#pipeline_datas:i}}
            <option value="{{id}}">{{name}}</option>
            {{/pipeline_datas}}
          </select>
        </div>
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
                    <input type="checkbox" class="form-check-input">
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
          <a href="#" class="btn btn-link link-secondary">
            Set up later
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
      pipeline_item_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setPipelines(await this.getPipelines());
      resolve();
    });
  },
  async handleChange(action, props, e) {
    switch (action) {
      case 'SELECT_PIPELINE':
        this.setPipelineItems(await this.getPipelineItems());
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
    debugger;
  },
});