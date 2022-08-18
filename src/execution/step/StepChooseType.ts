import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import ChildExecutionItemWizardModal, { ChildExecutionItemWizardModalInterface } from "execution/child_execution_item_modal/ChildExecutionItemWizardModal";
import Ractive, { ParsedTemplate } from "ractive";
import ExecutionService, { ExecutionInterface } from "services/ExecutionService";
import ProjectService from "services/ProjectService";


export interface StepChooseTypeInterface extends BaseRactiveInterface {
  getProjects?: { (): Promise<any> }
  setProjects?: { (props: any): void }
  getExecutions?: { (): Promise<any> }
  setExecutions?: { (props): void }
  submitCloneExecution?: { (exe_id: number): void }
  createNewSubGroup?: { (): void }
  createNewExecution?: { (): void }
  recursiveChildExecutions?: { (parse_child_execution_datas?: Array<ExecutionInterface>): void }
  renderChildExecutionView?: { (props): ParsedTemplate }
}



const StepChooseType = BaseRactive.extend<StepChooseTypeInterface>({
  components: {
    "child-execution-item-wizard-modal": ChildExecutionItemWizardModal
  },
  partials: {
    "child_execution_partials": []
  },
  template:/* html */`
  <div class="card card-md">
    <div class="card-body text-center py-4 p-sm-5">
      <!-- <img src="./static/illustrations/undraw_sign_in_e6hj.svg" height="128" class="mb-n2" alt=""> -->
      <h1 class="mt-1">Create new Execution!</h1>
      <p class="text-muted">Select the type execution first, which the type execution process you want execute it.</p>
    </div>
    <div class="hr-text hr-text-center hr-text-spaceless">Step 1</div>
    <div class="card-body">
      <div class="mb-3">
        <div class="form-selectgroup-boxes row mb-3">
          <div class="col-lg-6">
            <label class="form-selectgroup-item">
              <input type="radio" name="report-type" value="single" name="{{form_data.execution_type}}" class="form-selectgroup-input" checked="">
              <span class="form-selectgroup-label d-flex align-items-center p-3">
                <span class="me-3">
                  <span class="form-selectgroup-check"></span>
                </span>
                <span class="form-selectgroup-label-content">
                  <span class="form-selectgroup-title strong mb-1">Single Process</span>
                  <span class="d-block text-muted">Provide only basic data needed for the report</span>
                </span>
              </span>
            </label>
          </div>
          <div class="col-lg-6">
            <label class="form-selectgroup-item">
              <input type="radio" name="report-type" value="group" name="{{form_data.execution_type}}" class="form-selectgroup-input" disabled>
              <span class="form-selectgroup-label d-flex align-items-center p-3">
                <span class="me-3">
                  <span class="form-selectgroup-check"></span>
                </span>
                <span class="form-selectgroup-label-content">
                  <span class="form-selectgroup-title strong mb-1">Group Process</span>
                  <span class="d-block text-muted">Insert charts and additional advanced analyses to be inserted in the report</span>
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>
      {{#if form_data.execution_type == "single"}}
      
      {{else}}
      <div class="row row-cards" style="display:none;">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              {{#if select_parent_temp_ids.length > 0}}
              <div class="col-6 col-sm-4 col-md-2 col-xl-auto py-3">
                <a href="#" class="btn btn-blue w-100" on-click="@this.handleClick('BACK_PARENT_TEMP_ID',{},@event)">
                  Back
                </a>
              </div>
              &nbsp;
              {{/if}}
              <h3 class="card-title">Execution Items</h3>
              
            </div>
            <div class="list-group list-group-flush list-group-hoverable" id="sort-list-pip-item">
              {{> child_execution_partials}}
            </div>
            <div class="list-group list-group-flush list-group-hoverable">
              <div class="list-group-item">
                <div class="form-label">Create from exist execution as format</div>
                <div class="row">
                  <div class="col">
                    <div class="row">
                      <div class="col-6 col-sm-4 col-md-2 col-xl mb-3">
                        <select class="form-select" name="select_execution_id" value="{{form_data.select_execution_id}}">
                          <option value="new-execution">New Pipeline</option>
                          <option value="new-group">New Group</option>
                          {{#execution_datas:i}}
                            <option value="{{id}}">{{name}}</option>
                          {{/execution_datas}}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-auto">
                    <a href="#" on-click="@this.handleClick('SUBMIT_CLONE_EXECUTION_ITEM',{ id : form_data.select_execution_id }, @event)" class="btn btn-flickr btn-icon" aria-label="Button">
                      <!-- Download SVG icon from http://tabler-icons.io/i/brand-flickr -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {{/if}}
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
        <a href="#" style="visibility:hidden;" class="btn btn-link link-secondary" on-click="@this.handleClick('BACK',{},@event)">
          Back
        </a>
        <a href="#" class="btn btn-primary" on-click="@this.handleClick('CONTINUE',{},@event)">
          Continue
        </a>
      </div>
    </div>
  </div>
  <child-execution-item-wizard-modal on-listener="onChildExecutionItemWizardModalListener"></child-execution-item-wizard-modal>
  `,
  data() {
    return {
      form_data: {},
      project_datas: [],
      execution_datas: [],
      select_execution_child_index: null,
      select_parent_temp_ids: []
    }
  },
  onconstruct() {
    this.newOn = {
      onChildExecutionItemWizardModalListener: (c, action, text, e) => {
        switch (action) {
          case 'SUBMIT':
            let _child_execution_datas = this.get("form_data.child_execution_datas") || [];
            let index = this.get("select_execution_child_index");
            _child_execution_datas[index] = text;
            this.set("child_execution_datas", _child_execution_datas);
            this.set("form_data.child_execution_datas", this.get("child_execution_datas"));

            let _ChildExecutionItemWizardModal: ChildExecutionItemWizardModalInterface = this.findComponent("child-execution-item-wizard-modal");
            _ChildExecutionItemWizardModal.hide();
            break;
        }
      }
    }
    this.reInitializeObserve();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setProjects(await this.getProjects());
      this.observe("form_data.execution_type", async (val) => {
        if (val == null) return;
        if (val == "group") {
          // this.setExecutions(await this.getExecutions());
        }
      })
      resolve();
    });
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'SELECT_EXECUTION_ITEM':
        e.preventDefault();
        break;
    }
  },
  handleClick(action, props, e) {
    let _form_data: ExecutionInterface = this.get("form_data");
    let _child_execution_datas = [];
    let _select_parent_temp_ids = this.get("select_parent_temp_ids") || [];
    switch (action) {
      case 'BACK_PARENT_TEMP_ID':
        e.preventDefault();
        _select_parent_temp_ids.pop();
        this.set("select_parent_temp_ids", _select_parent_temp_ids);
        this.recursiveChildExecutions(_form_data.child_execution_datas);
        break;
      case 'BROWSE_GROUP_CHILD_EXEUCTION_ITEM':
        e.preventDefault();
        console.log(_form_data.child_execution_datas[props.index]);
        _select_parent_temp_ids.push(_form_data.child_execution_datas[props.index].temp_id);
        this.set("select_parent_temp_ids", _select_parent_temp_ids);
        this.recursiveChildExecutions(_form_data.child_execution_datas);
        break;
      case 'DELETE_CHILD_EXEUCTION_ITEM':
        e.preventDefault();
        _child_execution_datas = _form_data.child_execution_datas;
        _child_execution_datas.splice(props.index, 1);
        this.set("form_data.child_execution_datas", _child_execution_datas);
        this.recursiveChildExecutions(_form_data.child_execution_datas);
        break;
      case 'EDIT_CHILD_EXEUCTION_ITEM':
        e.preventDefault();
        this.set("select_execution_child_index", props.index);
        _child_execution_datas = _form_data.child_execution_datas;
        let _ChildExecutionItemWizardModal: ChildExecutionItemWizardModalInterface = this.findComponent("child-execution-item-wizard-modal");
        _ChildExecutionItemWizardModal.show(_child_execution_datas[props.index]);
        break;
      case 'SUBMIT_CLONE_EXECUTION_ITEM':
        e.preventDefault();
        let _select_execution_id = this.get("form_data.select_execution_id");
        switch (_select_execution_id) {
          case 'new-execution':
            // this.createNewExecution();
            return;
          case 'new-group':
            // this.createNewSubGroup();
            return;
        }
        this.submitCloneExecution(props.id);
        break;
      case 'BACK':
        e.preventDefault();
        // this.fire("listener",action,props,e);
        break;
      case 'CONTINUE':
        e.preventDefault();

        let _nextStep = "step-two"
        if (_form_data.execution_type == "group") {
          this.set("form_data", {
            ...this.get("form_data"),
            pipeline_id: null,
            branch: null,
            project_id: null,
            pipeline_item_ids: [],
            host_ids: [],
            process_mode: null,
            variable_id: null,
            variable_option: null,
          })
          _nextStep = "step-group-one";
        }
        this.fire("listener", action, {
          component: _nextStep
        }, e);
        break;
    }
  },
  async getExecutions() {
    try {
      let resDatas = await ExecutionService.getExecutions({});
      return resDatas;
    } catch (ex) {
      console.error("getExecutions - ex :: ", ex);
    }
  },
  setExecutions(props) {
    if (props == null) return;
    this.set("execution_datas", props.return);
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
  createNewSubGroup() {
    try {
      let _child_execution_datas = this.get("form_data.child_execution_datas") || [];
      let _select_parent_temp_ids = this.get("select_parent_temp_ids");
      _child_execution_datas.push({
        temp_id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
        parent_temp_id: _select_parent_temp_ids[_select_parent_temp_ids.length - 1],
        name: `Group - ${_child_execution_datas.length + 1}`,
        description: null,
        pipeline_id: null,
        branch: null,
        project_id: null,
        pipeline_item_ids: [],
        host_ids: [],
        process_limit: 1,
        process_mode: 'sequential',
        delay: 2000,
        variable_id: null,
        variable_option: null,
        execution_type: ExecutionService.EXECUTION_TYPE.GROUP,
        child_execution_datas: []
      })
      this.set("form_data.child_execution_datas", _child_execution_datas);
      this.recursiveChildExecutions(_child_execution_datas);
    } catch (ex) {
      console.error("createNewSubGroup - ex :: ", ex);
    }
  },
  createNewExecution() {
    try {
      let _child_execution_datas = this.get("form_data.child_execution_datas") || [];
      let _select_parent_temp_ids = this.get("select_parent_temp_ids");
      _child_execution_datas.push({
        temp_id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
        parent_temp_id: _select_parent_temp_ids[_select_parent_temp_ids.length - 1],
        name: `Execution - ${_child_execution_datas.length + 1}`,
        description: null,
        pipeline_id: null,
        branch: null,
        project_id: null,
        pipeline_item_ids: [],
        host_ids: [],
        process_limit: 1,
        process_mode: 'sequential',
        delay: 2000,
        variable_id: null,
        variable_option: null,
        execution_type: ExecutionService.EXECUTION_TYPE.SINGLE,
        child_execution_datas: []
      })
      this.set("form_data.child_execution_datas", _child_execution_datas);
      this.recursiveChildExecutions(_child_execution_datas);
    } catch (ex) {
      console.error("createNewExecution - ex :: ", ex);
    }
  },
  async submitCloneExecution(exe_id) {
    try {
      let _select_parent_temp_ids = this.get("select_parent_temp_ids");
      let _child_execution_datas = this.get("form_data.child_execution_datas") || [];
      let resData = await ExecutionService.getExecution({
        id: exe_id
      });
      resData = resData.return;
      delete resData.id;
      _child_execution_datas.push({
        ...resData,
        temp_id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
        parent_temp_id: _select_parent_temp_ids[_select_parent_temp_ids.length - 1],
      });
      this.set("form_data.child_execution_datas", _child_execution_datas);
      this.recursiveChildExecutions(_child_execution_datas);
    } catch (ex) {
      console.error("submitCloneExecution - ex :: ", ex);
    }
  },
  recursiveChildExecutions(parse_child_execution_datas) {
    let _child_execution_partials = [];
    let _select_parent_temp_ids = this.get("select_parent_temp_ids");
    let _child_execution_datas = parse_child_execution_datas || [];
    for (var a = 0; a < _child_execution_datas.length; a++) {
      if (_select_parent_temp_ids[_select_parent_temp_ids.length - 1] == _child_execution_datas[a].parent_temp_id) {
        let _template = this.renderChildExecutionView({
          ..._child_execution_datas[a],
          index: a
        });
        _child_execution_partials.push({
          ..._template.t[0]
        })
      }
    }
    this.resetPartial('child_execution_partials', _child_execution_partials);
  },
  renderChildExecutionView(props) {
    let {
      name,
      execution_type,
      index,
      id
    } = props;
    return Ractive.parse(/* html */`
    <div class="list-group-item">
      <div class="row align-items-center">
        <div class="col-auto">
          <span class="badge bg-red"></span>
        </div>
        <div class="col-auto">
          <a href="#">
            <span style="background-image: url(./static/avatars/000m.jpg);" class="avatar"></span>
          </a>
        </div>
        <div class="col text-truncate">
          <span class="text-reset d-block">${name}</span>
          <div class="d-block text-muted text-truncate mt-n1">Type : ${execution_type}</div>
        </div>
        <div class="col-auto">
          <div class="btn-list flex-nowrap">
            {{#if "${execution_type}" == "group"}}
            <a class="btn" on-click="@this.handleClick('BROWSE_GROUP_CHILD_EXEUCTION_ITEM',{ id : ${id}, index: ${index} }, @event)" href="/dashboard/queue-record/3/view">Browse</a>
            {{/if}}
            <div class="dropdown">
              <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <svg class="icon icon-tabler icon-tabler-settings" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#" on-click="@this.handleClick('EDIT_CHILD_EXEUCTION_ITEM',{ id : id, index: i }, @event)">Edit</a>
                <a class="dropdown-item" href="#" on-click="@this.handleClick('DELETE_CHILD_EXEUCTION_ITEM',{ id : id, index: i }, @event)">Delete</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br>
    </div>
    `)
  }
});

export default StepChooseType;