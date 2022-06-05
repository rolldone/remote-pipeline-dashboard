import DeleteInfoModalProject, { DeleteInfoModalInterface as DeleteInfoModalInterfaceProject } from "project/delete_info_modal/DeleteInfoModal";
import ExecutionService from "services/ExecutionService";

export interface DeleteInfoModalInterface extends DeleteInfoModalInterfaceProject {

}

const DeleteInfoModal = DeleteInfoModalProject.extend<DeleteInfoModalInterface>({
  data() {
    return {
      display: {
        title: "Delete Execution",
        button_submit: "Delete the Execution"
      },
    }
  },
  async submitDelete() {
    try {
      let _form_data = this.get("form_data");
      let resData = await ExecutionService.deleteExecution({
        ids: [_form_data.id],
        force_deleted: _form_data.delete_option
      })
      this.fire("listener", "DELETED", {}, null);
      debugger;
    } catch (ex) {
      console.error("submitDelete - ex :: ", ex);
    }
  }
});

export default DeleteInfoModal;