import localStorageDB from "localstoragedb"
import SqlBricks from "sql-bricks";
import SqlService from "./SqlService";

export default {
  async getPipelineItemParents(project_id: number, pipeline_id: number, order_number: number) {
    try {
      let resData = await SqlService.select(SqlBricks.select("*").from("pipeline_items")
        .where({
          "pipeline_id": pipeline_id,
          "project_id": project_id
        }).where(SqlBricks.gtSome("order_number", order_number)).toString());
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  async addPipelineItem(props) {
    try {

    } catch (ex) {
      throw ex;
    }
  }
}