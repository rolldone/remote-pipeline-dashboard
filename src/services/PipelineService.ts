import localStorageDB from "localstoragedb"
import SqlBricks from "sql-bricks";
import { DATABASE_NAME } from "./PipelineItemService";
import SqlService from "./SqlService";

export default {
  async resetPipeline() {
    var lib = new localStorageDB(DATABASE_NAME, window.localStorage);
    if (lib.isNew()) {
      return;
    }
    lib.truncate("pipelines");
  },
  async addPipeline(props): Promise<any> {
    try {
      let id = await SqlService.insert(SqlBricks.insert('pipelines', {
        name: props.name,
        description: props.description,
        project_id: props.project_id
      }).toString());
      let resData = await SqlService.selectOne(SqlBricks.select().from("pipelines").where("id", id).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async updatePipeline(props): Promise<any> {
    try {
      let resData = await SqlService.update(SqlBricks.update('pipelines', {
        name: props.name,
        description: props.description,
        project_id: props.project_id
      }).where("id", props.id).toString());
      resData = await SqlService.selectOne(SqlBricks.select().from("pipelines").where("id", props.id).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getPipeline(props): Promise<any> {
    try {
      let resData = await SqlService.selectOne(SqlBricks.select().from("pipelines").where("id", props.id).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getPipelines(props): Promise<any> {
    try {
      let resData = await SqlService.select(SqlBricks.select().from("pipelines").orderBy("id", "DESC").toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  }
}