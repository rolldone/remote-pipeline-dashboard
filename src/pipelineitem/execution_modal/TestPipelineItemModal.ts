import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import QueueRecordDetailModal, { QueueRecordDetailModalInterface } from "pipelineitem/queuerecord_modal/QueueRecordDetailModal";
import ExecutionService, { ExecutionInterface, ExecutionServiceInterface } from "services/ExecutionService";
import ExecutionTestWizardModal, { ExecutionTestWizardModalInterface } from "./ExecutionTestWizardModal";
import template from './TestPipelineItemModalView.html';

export interface TestPipelineItemModalInterface extends BaseRactiveInterface {
  show: { (props: ExecutionInterface): void }
  hide: { (): void }
  getExecutions: { (): void }
  setExecutions: { (props: any): void }
  submitDelete: { (execution_id: number): void }
};


let myModal = null;

const TestPipelineItemModal = BaseRactive.extend<TestPipelineItemModalInterface>({
  components: {
    "execution-test-wizard-modal": ExecutionTestWizardModal,
    "queue-record-detail-modal": QueueRecordDetailModal
  },
  template,
  data() {
    return {
      execution_index: null,
      form_data: {},
      execution_datas: [],
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
    }
  },
  onconstruct() {
    this.newOn = {
      onQueueRecordDetailModalListener: async (c, action, text, object) => {
        debugger;
      },
      onExecutionTestWizardModalListener: async (c, action, text, object) => {
        switch (action) {
          case 'SUBMIT':
            let _execution_test_wizard_modal: ExecutionTestWizardModalInterface = this.findComponent("execution-test-wizard-modal");
            _execution_test_wizard_modal.hide();
            this.setExecutions(await this.getExecutions());
            break;
        }
      }
    }
    this._super();
  },
  handleClick(action, props, e) {
    let _execution_index = this.get("execution_index");
    let _execution_data: ExecutionServiceInterface = null;
    let _execution_datas: Array<ExecutionServiceInterface> = this.get("execution_datas");
    let _form_data: ExecutionInterface = this.get("form_data");
    let _execution_test_wizard_modal: ExecutionTestWizardModalInterface = null;
    let _queue_record_detail_modal: QueueRecordDetailModalInterface = null;
    switch (action) {
      case 'RUN':
        e.preventDefault();
        _execution_data = _execution_datas[_execution_index];
        if (_execution_data == null) {
          throw new Error("You need select execution first");
        }
        _queue_record_detail_modal = this.findComponent("queue-record-detail-modal");
        _queue_record_detail_modal.show(_execution_data);
        break;
      case 'EDIT':
        e.preventDefault();
        _execution_test_wizard_modal = this.findComponent("execution-test-wizard-modal");
        _execution_test_wizard_modal.show({
          pipeline_id: _form_data.pipeline_id,
          project_id: _form_data.project_id,
          id: props.id
        });
        break;
      case 'DELETE':
        e.preventDefault();
        this.submitDelete(props.id);
        break;
      case 'ADD_NEW_EXECUTION_TEST':
        e.preventDefault();
        _execution_test_wizard_modal = this.findComponent("execution-test-wizard-modal");
        _execution_test_wizard_modal.show({
          pipeline_id: _form_data.pipeline_id,
          project_id: _form_data.project_id,
          id: props.id || null
        });
        break;
    }
  },
  async show(props) {
    this.set("form_data", props);
    let _id_element = this.get("id_element");
    var _trrr = document.getElementById(_id_element);
    myModal = new window.bootstrap.Modal(_trrr, {
      backdrop: 'static',
      keyboard: false
    });
    myModal.show();
    this.setExecutions(await this.getExecutions());
  },
  hide() {
    myModal.hide();
  },
  async getExecutions() {
    try {
      let _form_data: ExecutionInterface = this.get("form_data");
      let resData = await ExecutionService.getExecutions({
        mode: "test",
        project_id: _form_data.project_id,
        pipeline_id: _form_data.pipeline_id
      });
      return resData;
    } catch (ex) {
      console.error("getExecution - ex :: ", ex);
    }
  },
  setExecutions(props) {
    if (props == null) return;
    this.set("execution_datas", props.return);
  },
  async submitDelete(execution_id) {
    try {
      let resData = await ExecutionService.deleteExecution({
        ids: [execution_id],
        force_deleted: false
      });
      this.setExecutions(await this.getExecutions());
    } catch (ex) {
      console.error("submitDelete - ex :: ", ex);
    }
  }
});

export default TestPipelineItemModal;