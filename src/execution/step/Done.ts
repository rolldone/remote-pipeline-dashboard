import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

export default BaseRactive.extend<BaseRactiveInterface>({
  template:/* html */`
    <div class="card card-md">
      <div class="card-body text-center py-4 p-sm-5">
      <!-- <img src="./static/illustrations/undraw_sign_in_e6hj.svg" height="128" class="mb-n2" alt=""> -->
      <h1 class="mt-1">Create new Execution!</h1>
      <p class="text-muted">You have finish the create execution</p>
      </div>
      <div class="hr-text hr-text-center hr-text-spaceless">Done</div>
      <div class="card-body">
        
      </div>
    </div>
    <div class="row align-items-center mt-3">
      <div class="col-4">
        <div class="progress">
          <div class="progress-bar" style="width: 100%" role="progressbar" aria-valuenow="100" aria-valuemin="0"
            aria-valuemax="100" aria-label="100% Complete">
            <span class="visually-hidden">100% Complete</span>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="btn-list justify-content-end">
          <a href="#" class="btn btn-link link-secondary" on-click="@this.handleClick('BACK',{},@event)">
            Back
          </a>
          <a href="#" class="btn btn-primary" on-click="@this.handleClick('DONE',{},@event)">
            Finish
          </a>
        </div>
      </div>
    </div>
  `,
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-four"
        }, e);
        break;
      case 'DONE':
        break;
    }
  }
});