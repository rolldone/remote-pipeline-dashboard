import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import ExecutionService, { ExecutionServiceInterface } from "services/ExecutionService";
import Notify from "simple-notify";

export interface DoneInterface extends BaseRactiveInterface {
  submitExecution?: { (): Promise<any> }
}

declare let window: Window

export default BaseRactive.extend<DoneInterface>({
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
  data() {
    return {
      form_data: {}
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-four"
        }, e);
        break;
      case 'DONE':
        e.preventDefault();
        console.log(this.get("form_data"));
        this.submitExecution();
        break;
    }
  },
  async submitExecution() {
    try {
      let resData = null;
      let _form_data: ExecutionServiceInterface = this.get("form_data") as any;
      if (_form_data.id != null) {
        resData = await ExecutionService.updateExecution({
          id: _form_data.id,
          name: _form_data.name,
          branch: _form_data.branch,
          description: _form_data.description || "",
          pipeline_id: _form_data.pipeline_id,
          project_id: _form_data.project_id,
          pipeline_item_ids: _form_data.pipeline_item_ids,
          host_ids: _form_data.host_ids,
          process_limit: _form_data.process_limit || 1,
          process_mode: _form_data.process_mode,
          delay: _form_data.delay,
          variable_id: _form_data.variable_id,
          variable_option: _form_data.variable_option
        });
        new Notify({
          status: 'success',
          title: 'Update Execution',
          text: 'Update successfully :)',
          effect: 'fade',
          speed: 300,
          customClass: null,
          customIcon: null,
          showIcon: true,
          showCloseButton: true,
          autoclose: true,
          autotimeout: 3000,
          gap: 20,
          distance: 20,
          type: 1,
          position: 'right top'
        })
        setTimeout(() => {
          window.executionRouter.back();
        }, 2000);
        return;
      }
      resData = await ExecutionService.addExecution({
        name: _form_data.name,
        description: _form_data.description || "",
        pipeline_id: _form_data.pipeline_id,
        branch: _form_data.branch,
        project_id: _form_data.project_id,
        pipeline_item_ids: _form_data.pipeline_item_ids,
        host_ids: _form_data.host_ids,
        process_limit: _form_data.process_limit || 1,
        process_mode: _form_data.process_mode,
        delay: _form_data.delay,
        variable_id: _form_data.variable_id,
        variable_option: _form_data.variable_option
      });
      new Notify({
        status: 'success',
        title: 'New Execution',
        text: 'Create new successfully :)',
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
      setTimeout(() => {
        window.executionRouter.back();
      }, 2000);
    } catch (ex: any) {
      console.error("submitExecution - ex :: ", ex);
      new Notify({
        status: 'error',
        title: 'Execution Error',
        text: ex.message,
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: false,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
    }
  }
});