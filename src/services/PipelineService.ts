import localStorageDB from "localstoragedb"
import { DATABASE_NAME } from "./PipelineItemService";

export default {
  async resetPipeline() {
    var lib = new localStorageDB(DATABASE_NAME, window.localStorage);
    if (lib.isNew()) {
      return;
    }
    lib.truncate("pipelines");
  },
  addPipeline(props: { project_name: string, description?: string }) {
    var lib = new localStorageDB(DATABASE_NAME, window.localStorage);
    if (lib.tableExists("pipelines") == false) {
      lib.createTable("pipelines", ["project_name", "description"]);
    }
    let id = lib.insert("pipelines", { project_name: props.project_name, description: props.description });
    lib.commit();
    return this.getPipeline({ ID: id });
  },
  updatePipeline(props) {
    var lib = new localStorageDB(DATABASE_NAME, window.localStorage);
    if (lib.tableExists("pipelines") == false) {
      lib.createTable("pipelines", ["project_name", "description"]);
    }
    lib.update("pipelines", {
      ID: props.ID
    }, (row) => {
      row = {
        ...props
      }
      return row;
    });
    lib.commit();
    return this.getPipeline({ ID: props.ID });
  },
  getPipeline(props) {
    var lib = new localStorageDB(DATABASE_NAME, window.localStorage);
    let gg = lib.queryAll("pipelines", {
      query: props
    });
    return {
      status: 'success',
      status_code: 200,
      return: gg[0] || null
    };
  },
  getPipelines(props) {
    var lib = new localStorageDB(DATABASE_NAME, window.localStorage);
    let gg = lib.queryAll("pipelines", {
      query: props,
      sort: [["ID", "DESC"]]
    });
    return {
      status: 'success',
      status_code: 200,
      return: gg
    };
  }
}