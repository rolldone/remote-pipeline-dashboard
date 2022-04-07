import localStorageDB from "localstoragedb"
import SqlBricks from "sql-bricks";
import SqlService from "./SqlService";

export default {
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
      SqlBricks.aliasExpansions({ 'pro': "projects" });
      let resData = await SqlService.select(SqlBricks.select(
        "pipelines.name as pip_name",
        "pipelines.id as pip_id",
        "pipelines.description as pip_description",
        "pro.name as pro_name"
      ).from("pipelines").leftJoin("pro").on({
        "pro.id": "pipelines.project_id"
      }).orderBy("pipelines.id DESC").toString());
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