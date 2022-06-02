import DoneExecution, { DoneInterface } from "execution/step/Done";
import ExecutionService, { ExecutionServiceInterface } from "services/ExecutionService";

const Done = DoneExecution.extend<DoneInterface>({
  handleClick(action, props, e) {
    switch (action) {
      case 'BACK':
        e.preventDefault();
        this.fire("listener", action, {
          component: "step-three"
        }, e);
        return;
    }
    this._super(action, props, e);
  },
  async submitExecution() {
    try {
      let resData = null;
      let _form_data: ExecutionServiceInterface = this.get("form_data") as any;
      _form_data.pipeline_item_ids = _form_data.pipeline_item_ids.sort();
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
          variable_option: _form_data.variable_option,
          mode: "test"
        });
        this.fire("listener", 'SUBMIT', {}, null);
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
        variable_option: _form_data.variable_option,
        mode: "test"
      });
      this.fire("listener", 'SUBMIT', {}, null);
    } catch (ex) {
      console.error("submitExecution - ex :: ", ex);
    }
  }
});

export default Done;