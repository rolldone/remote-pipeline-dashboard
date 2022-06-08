import DeleteInfoModalProject, { DeleteInfoModalInterface as DeleteInfoModalInterfaceProject } from "project/delete_info_modal/DeleteInfoModal";
import QueueRecordService, { QueueRecordStatus } from "services/QueueRecordService";
import Notify from "simple-notify";

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
    let _form_data = this.get("form_data");
    try {
      let resData = await QueueRecordService.deleteQueueRecord({
        ids: [_form_data.id],
        force_deleted: _form_data.delete_option
      })
      new Notify({
        status: "success",
        autoclose: true,
        autotimeout: 3000,
        title: "Queue " + _form_data.queue_key,
        text: "Queue deleted!",
      });
      this.fire("listener", "DELETED", {}, null);
    } catch (ex: any) {
      console.error("submitDelete - ex :: ", ex);
      new Notify({
        status: "error",
        autoclose: true,
        autotimeout: 3000,
        title: "Queue " + _form_data.queue_key,
        text: ex.message,
      });
    }
  }
});

export default DeleteInfoModal;