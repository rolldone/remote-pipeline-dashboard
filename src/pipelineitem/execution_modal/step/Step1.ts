import Step2Execution, { Step2Interface } from "execution/step/Step2";
import PipelineService from "services/PipelineService";


export interface Step1Interface extends Step2Interface {
  getPipeline?: { (): void }
  setPipeline?: { (props: any): void }
}

/**
 * Step1 extends Step2 from execution
 * Because we dont need select pipeline again
 */
const Step1 = Step2Execution.extend<Step1Interface>({
  template:/* html */`
  <div class="card card-md">
    <div class="card-body text-center py-4 p-sm-5">
    <!-- <img src="./static/illustrations/undraw_sign_in_e6hj.svg" height="128" class="mb-n2" alt=""> -->
    <h1 class="mt-1">Create new Execution!</h1>
    <p class="text-muted">Select the pipeline, which the pipeline you want run it.</p>
    </div>
    <div class="hr-text hr-text-center hr-text-spaceless">Step 1</div>
    <div class="card-body">
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
        <a href="#" class="btn btn-primary" on-click="@this.handleClick('CONTINUE',{},@event)">
          Continue
        </a>
      </div>
    </div>
  </div>
  `,
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      let _form_data = this.get("form_data");
      console.log("form_data ::: ", _form_data);
      // Create skenario
      if (_form_data.pipeline_id != null) {
        this.setPipeline(await this.getPipeline());
        this.setBranchs(await this.getBranchs());
        this.setPipelineItems(await this.getPipelineItems());
        // await this.handleChange('SELECT_PIPELINE', {}, { preventDefault: () => { } })
      }
      resolve();
    });
  },

  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        // this.fire("listener", action, {
        //   component: "step-one"
        // }, e);
        return;
      case 'CONTINUE':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-two"
        }, e);
        return;
    }
    this._super(action, props, e);
  },
  async getPipeline() {
    try {
      let _form_data = this.get("form_data");
      let resData = await PipelineService.getPipeline({
        id: _form_data.pipeline_id
      });
      return resData;
    } catch (ex) {
      console.error("getProjects - ex :: ", ex);
    }
  },
  setPipeline(props) {
    if (props == null) return;
    this.set("pipeline_data", props.return)
  },
})

export default Step1;