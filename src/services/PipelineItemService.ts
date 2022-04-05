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
  }
}