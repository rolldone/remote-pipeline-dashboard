import localStorageDB from "localStorageDB";

const database_name = "remote_pipeline_local";
export default {
  async resetParents() {
    var lib = new localStorageDB(database_name, window.localStorage);
    if (lib.isNew()) {
      return;
    }
    lib.truncate("parents");
  },
  async getParents(index) {
    var lib = new localStorageDB(database_name, window.localStorage);
    lib.queryAll("parents", [
      query: (row) => {
        if (row.id > index) {
          return true;
        }
        return false;
      }
    ]);
  }
}