import ExecutionService, { ExecutionServiceInterface } from "services/ExecutionService";
import ExecutionNew, { ExecutionNewInterface } from "./ExecutionNew";

export interface ExecutionUpdateInterface extends ExecutionNewInterface {
  getExecution?: { (): Promise<any> }
  setExecution?: { (props: any): void }
}

export default ExecutionNew.extend<ExecutionUpdateInterface>({
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setExecution(await this.getExecution());
      await _super();
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
    let _form_data: ExecutionServiceInterface = props.return as any;
    this.set("form_data", _form_data);
  }
})