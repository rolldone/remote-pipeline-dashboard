import localStorageDB from "localstoragedb";

export const DATABASE_NAME = "remote_pipeline_local";
export default {
  async resetParents() {
    var lib = new localStorageDB(DATABASE_NAME, window.localStorage);
    if (lib.isNew()) {
      return;
    }
    lib.truncate("parents");
  },
  async getParents(index) {
    var lib = new localStorageDB(DATABASE_NAME, window.localStorage);
    lib.queryAll("parents", [
      {
        query: (row) => {
          if (row.id > index) {
            return true;
          }
          return false;
        }
      }
    ]);
  },
  async addPipelineItem(props) {
    var lib = new localStorageDB(DATABASE_NAME, window.localStorage);
    if (lib.tableExists("pipeline_items") == false) {
      lib.createTable("pipeline_items", ["pipeline_id", "value"]);
    }
    let id = lib.insert("pipeline_items", { pipeline_id: props.pipeline_id, value: props.value });
    lib.commit();
    return this.getPipeline({ ID: id });
  }
}