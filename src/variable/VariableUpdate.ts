import VariableService, { variable } from "services/VariableService";
import Notify from "simple-notify";
import VariableNew, { VariableNewInterface } from "./VariableNew";

export interface VariableUpdateInterface extends VariableNewInterface {
  getVariable: { (): Promise<any> }
  setVariable: { (props: any): void }
}

export default VariableNew.extend<VariableUpdateInterface>({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await _super();
      this.setVariable(await this.getVariable());
      resolve();
    });
  },
  async submitVariable() {
    try {
      let form_data = this.get("form_data");
      let _form_schemes = this.get("form_schemes");
      let _variable_groups = this.get("variable_groups");
      let resData = await VariableService.updateVariable({
        id: form_data.id,
        name: form_data.name,
        description: form_data.description,
        project_id: form_data.project_id,
        pipeline_id: form_data.pipeline_id,
        schema: _form_schemes,
        data: _variable_groups
      });
      new Notify({
        status: 'success',
        title: 'Update Variable',
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
  async getVariable() {
    try {
      let resData = await VariableService.getVariable({
        id: this.req.params.id
      });
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  async setVariable(props) {
    if (props == null) return;
    props = props.return;
    this.set("form_data", <variable>{
      id: props.id,
      data: props.data,
      description: props.description,
      name: props.name,
      pipeline_id: props.pipeline_id,
      project_id: props.project_id,
      schema: props.schema
    });
    this.set("variable_groups", props.data);
    this.set("form_schemes", props.schema);

    this.setPipelines(await this.getPipelines(props.project_id));
  },
});