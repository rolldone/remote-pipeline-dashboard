import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

/**
 * Execution mode like
 * - duration
 * - with schedule
 * - with trigger webhook
 */

export default BaseRactive.extend<BaseRactiveInterface>({
  template: /* html */`
    <div class="card card-md">
      <div class="card-body text-center py-4 p-sm-5">
      <!-- <img src="./static/illustrations/undraw_sign_in_e6hj.svg" height="128" class="mb-n2" alt=""> -->
      <h1 class="mt-1">Create new Execution!</h1>
      <p class="text-muted">Select the process mode is sequential or parallel</p>
      </div>
      <div class="hr-text hr-text-center hr-text-spaceless">Step 4</div>
      <div class="card-body">
        <div class="form-group mb-3 ">
          <label class="form-label">Execution name</label>
          <div>
            <input type="text" class="form-control" name="name" value="{{form_data.name}}" aria-describedby="emailHelp" placeholder="Executiion one">
            <small class="form-hint">Put the name of this execution process.</small>
          </div>
        </div>
        <label class="form-label">Process Mode</label>
        <div class="form-selectgroup-boxes row mb-3">
          <div class="col-lg-6">
            <label class="form-selectgroup-item">
              <input type="radio" name="{{form_data.process_mode}}" value="sequential" class="form-selectgroup-input" checked="" on-change="@this.handleChange('SELECT_PROCESS',{},@event)">
              <span class="form-selectgroup-label d-flex align-items-center p-3">
                <span class="me-3">
                  <span class="form-selectgroup-check"></span>
                </span>
                <span class="form-selectgroup-label-content">
                  <span class="form-selectgroup-title strong mb-1">Sequential Process</span>
                  <span class="d-block text-muted">Provide only basic data needed for the report</span>
                </span>
              </span>
            </label>
          </div>
          <div class="col-lg-6">
            <label class="form-selectgroup-item">
              <input type="radio" name="{{form_data.process_mode}}" value="parallel" class="form-selectgroup-input" on-change="@this.handleChange('SELECT_PROCESS',{},@event)">
              <span class="form-selectgroup-label d-flex align-items-center p-3">
                <span class="me-3">
                  <span class="form-selectgroup-check"></span>
                </span>
                <span class="form-selectgroup-label-content">
                  <span class="form-selectgroup-title strong mb-1">Prallel Process</span>
                  <span class="d-block text-muted">Insert charts and additional advanced analyses to be inserted in the report</span>
                </span>
              </span>
            </label>
          </div>
        </div>
        {{#if form_data.process_mode == "parallel"}}
        <div class="form-group mb-3 ">
          <label class="form-label">Parallel Process Limit</label>
          <div>
            <input type="number" class="form-control" name="process_limit" value="{{form_data.process_limit}}" aria-describedby="emailHelp" placeholder="Enter number of limit">
            <small class="form-hint">You can set how much limit parallel process every loop process. If you set 0 it mean process all ip hosts at the same time.</small>
          </div>
        </div>
        {{/if}}
      </div>
    </div>
    <div class="row align-items-center mt-3">
      <div class="col-4">
        <div class="progress">
          <div class="progress-bar" style="width: 90%" role="progressbar" aria-valuenow="90" aria-valuemin="0"
            aria-valuemax="100" aria-label="90% Complete">
            <span class="visually-hidden">90% Complete</span>
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
  handleChange(action, props, e) {
    switch (action) {
      case 'SELECT_PROCESS':
        let _form_data = this.get("form_data");
        break;
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener",action,{
          component: "step-three"
        },e);
        break;
      case 'CONTINUE':
        e.preventDefault();
        let _form_data = this.get("form_data");
        console.log(_form_data);
        this.fire("listener", action, {
          component: "done"
        }, e);
        break;
    }
  }
})