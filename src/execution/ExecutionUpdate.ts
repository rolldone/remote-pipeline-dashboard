import ExecutionService, { Execution } from "services/ExecutionService";
import ExecutionNew, { ExecutionNewInterface } from "./ExecutionNew";

export interface ExecutionUpdateInterface extends ExecutionNewInterface {
  getExecution: { (): Promise<any> }
  setExecution: { (props: any): void }
}

export default ExecutionNew.extend<ExecutionUpdateInterface>({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      await _super();
      this.setExecution(await this.getExecution());
      resolve();
    })
  },
  async getExecution() {
    try {
      let resData = await ExecutionService.getExecution({
        id: this.req.params.id
      })
      return resData;
    } catch (ex) {
      console.error("getExecution - ex :: ", ex);
    }
  },
  setExecution(props) {
    if (props == null) return;
    let _form_data: Execution = props.return as any;
    _form_data.host_ids = JSON.parse(props.return.host_ids);
    _form_data.pipeline_item_ids = JSON.parse(props.return.pipeline_item_ids);
    this.set("form_data", _form_data);
  }
})