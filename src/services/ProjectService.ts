import localStorageDB from "localstoragedb"
import SqlBricks from "sql-bricks";
import { DATABASE_NAME } from "./PipelineItemService";
import SqlService from "./SqlService";

export default {
  addPipeline(props) {


  },
  updatePipeline(props) {

  },
  getPipeline(props) {

  },
  async getPipelines(props) {
    try {
      let resData = await SqlService.select(SqlBricks.select().from("projects").where({
        user_id : props.user_id
      }).orderBy('id',"DESC").toString());
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