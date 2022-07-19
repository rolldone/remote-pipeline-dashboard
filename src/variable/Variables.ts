import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import VariableService from "services/VariableService";
import Notify from "simple-notify";
import ImportVariableModal, { ImportVariableModalInterface } from "./import_variable_modal/ImportVariableModal";
import template from './VariablesView.html';

export interface VariablesInterface extends BaseRactiveInterface {
  getVariables: { (): Promise<any> }
  setVariables: { (props: any): void }
  submitImportVariable?: { (): void }
  submitDeleteVariable?: { (id: number): void }
}

export default BaseRactive.extend<VariablesInterface>({
  template,
  components: {
    "import-variable-modal": ImportVariableModal
  },
  data() {
    return {
      variable_datas: [],
      form_data: {}
    }
  },
  onconstruct() {
    this.newOn = {
      onImportVariableModalListener: (c, action, props, e) => {
        switch (action) {
          case 'SUBMIT':
            let _importVariableModal: ImportVariableModalInterface = this.findComponent("import-variable-modal");
            _importVariableModal.hide();
            this.set("form_data", props);
            this.submitImportVariable();
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setVariables(await this.getVariables());
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    let _variable_datas = this.get("variable_datas");
    switch (action) {
      case 'IMPORT_VARIABLE':
        e.preventDefault();
        let _importVariableModal: ImportVariableModalInterface = this.findComponent("import-variable-modal");
        _importVariableModal.show({});
        break;
      case 'TO_VARIABLE':
        break;
      case 'DELETE':
        this.submitDeleteVariable(props.id);
        break;
      case 'DOWNLOAD':
        e.preventDefault();
        let _variable_data = _variable_datas[props.index];
        VariableService.downloadVariable(_variable_data);
        break;
    }
  },
  async submitImportVariable() {
    try {
      let form_data = this.get("form_data");
      let resData = await VariableService.addVariable({
        name: form_data.name,
        description: form_data.description,
        project_id: form_data.project_id,
        pipeline_id: form_data.pipeline_id,
        data: form_data.data,
        schema: form_data.schema
      });
      resData = resData.return;

      window.variableRouter.navigate(window.variableRouter.buildUrl(`/${resData.id}/view`));
      new Notify({
        status: 'success',
        title: 'New Variable',
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
    } catch (ex: any) {
      console.error("submitVariable - ex :: ", ex);
      new Notify({
        status: 'error',
        title: 'Variable Error',
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
  },
  async submitDeleteVariable(id) {
    try {
      let resData = await VariableService.deleteVariable([id]);
      this.setVariables(await this.getVariables());
      new Notify({
        status: 'success',
        title: 'Delete Variable',
        text: 'Delete successfully :)',
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
      
    } catch (ex: any) {
      console.error("getVariables - ex :: ", ex);
      new Notify({
        status: 'error',
        title: 'Update Pipeline',
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
  },
  async getVariables() {
    try {
      // console.log(this.req);
      let _pipeline_id = this.req.query.pipeline_id
      let resData = await VariableService.getVariables({
        pipeline_id: _pipeline_id || null
      });
      return resData;
    } catch (ex) {
      console.error("getVariables - ex :: ", ex);
    }
  },
  setVariables(props) {
    if (props == null) return;
    this.set("variable_datas", props.return);
  }
});