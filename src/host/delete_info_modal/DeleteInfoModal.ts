import DeleteInfoModalProject, { DeleteInfoModalInterface as DeleteInfoModalInterfaceProject } from "project/delete_info_modal/DeleteInfoModal";
import HostService from "services/HostService";
import PipelineService from "services/PipelineService";

export interface DeleteInfoModalInterface extends DeleteInfoModalInterfaceProject {

}

const DeleteInfoModal = DeleteInfoModalProject.extend<DeleteInfoModalInterface>({
  data() {
    return {
      display: {
        title: "Delete Host",
        button_submit: "Delete"
      },
    }
  },
  async submitDelete() {
    try {
      let _form_data = this.get("form_data");
      let resData = await HostService.deleteHost({
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