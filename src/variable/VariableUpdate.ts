import VariableService, { variable } from "services/VariableService";
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
    } catch (ex) {
      console.error("submitVariable - ex :: ", ex);
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
    this.set("variable_groups", JSON.parse(props.data));
    this.set("form_schemes", JSON.parse(props.schema));
    this.setPipelines(await this.getPipelines(props.project_id));
  },
});