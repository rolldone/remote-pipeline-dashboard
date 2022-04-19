import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import ProjectService from "services/ProjectService";


export interface Step1Interface extends BaseRactiveInterface {
  getProjects?: { (): Promise<any> }
  setProjects?: { (props: any): void }
}

export default BaseRactive.extend<Step1Interface>({
  template: /* html */`
  <div class="card card-md">
    <div class="card-body text-center py-4 p-sm-5">
      <!-- <img src="./static/illustrations/undraw_sign_in_e6hj.svg" height="128" class="mb-n2" alt=""> -->
      <h1 class="mt-1">Create new Execution!</h1>
      <p class="text-muted">Select the project first, which the project you want execute it.</p>
    </div>
    <div class="hr-text hr-text-center hr-text-spaceless">Step 1</div>
    <div class="card-body">
      <div class="mb-3">
        <div class="form-label">Select Project</div>
        <select class="form-select" value="{{form_data.project_id}}" name="project_id">
          <option value="">--</option>
          {{#project_datas:i}}
          <option value="{{id}}">{{name}}</option>
          {{/project_datas}}
        </select>
      </div>
    </div>
  </div>
  <div class="row align-items-center mt-3">
    <div class="col-4">
      <div class="progress">
        <div class="progress-bar" style="width: 25%" role="progressbar" aria-valuenow="25" aria-valuemin="0"
          aria-valuemax="100" aria-label="25% Complete">
          <span class="visually-hidden">25% Complete</span>
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
      project_datas: [],
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setProjects(await this.getProjects());
      resolve();
    });
  },
  async getProjects() {
    try {
      let resData = await ProjectService.getProjects({});
      return resData;
    } catch (ex) {
      console.error("getProjects - ex :: ", ex);
    }
  },
  setProjects(props) {
    if (props == null) return;
    this.set("project_datas", props.return)
  },

  handleClick(action, props, e) {
    switch (action) {
      case 'CONTINUE':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-two",
        }, e);
        break;
    }
  }
});