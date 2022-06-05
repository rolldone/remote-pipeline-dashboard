import DeleteInfoModalProject, { DeleteInfoModalInterface as DeleteInfoModalInterfaceProject } from "project/delete_info_modal/DeleteInfoModal";
import QueueRecordService from "services/QueueRecordService";

export interface DeleteInfoModalInterface extends DeleteInfoModalInterfaceProject {

}

const DeleteInfoModal = DeleteInfoModalProject.extend<DeleteInfoModalInterface>({
  data() {
    return {
      display: {
        title: "Delete Queue Record",
        button_submit: "Delete the Queue Record"
      },
    }
  },
  async submitDelete() {
    try {
      let _form_data = this.get("form_data");
      let resData = await QueueRecordService.deleteQueueRecord({
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