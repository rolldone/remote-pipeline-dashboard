import DeleteInfoModalProject, { DeleteInfoModalInterface as DeleteInfoModalInterfaceProject } from "project/delete_info_modal/DeleteInfoModal";
import PipelineService from "services/PipelineService";

export interface DeleteInfoModalInterface extends DeleteInfoModalInterfaceProject {

}

const DeleteInfoModal = DeleteInfoModalProject.extend<DeleteInfoModalInterface>({
  data() {
    return {
      display: {
        title: "Delete Pipeline",
        button_submit: "Delete the Pipeline"
      },
    }
  },
  async submitDelete() {
    try {
      let _form_data = this.get("form_data");
      let resData = await PipelineService.deletePipelines({
        ids: [_form_data.id],
        force_deleted: _form_data.delete_option
      })
      this.fire("listener", "DELETED", {}, null);
    } catch (ex) {
      console.error("submitDelete - ex :: ", ex);
    }
  }
});

export default DeleteInfoModal;