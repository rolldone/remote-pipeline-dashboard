import localStorageDB from "localstoragedb"
import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";

export default {
  async addProject(props): Promise<any> {
    try {
      let id = await SqlService.insert(SqlBricks.insert('projects', {
        name: props.name,
        description: props.description
      }).toString());
      let resData = await SqlService.selectOne(SqlBricks.select("*").from("projects").where("id", id).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async updateProject(props): Promise<any> {
    try {
      let res = await SqlService.update(SqlBricks.update('projects', {
        name: props.name,
        description: props.description
      }).where("id", props.id).toString());
      let resData = await SqlService.selectOne(SqlBricks.select("*").from("projects").where("id", props.id).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getProject(props): Promise<any> {
    try {
      let resData = await SqlService.selectOne(SqlBricks.select("*").from("projects").where("id", props.id).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getProjects(props): Promise<any> {
    try {
      SqlBricks.aliasExpansions({
        "pip_task": "pipeline_tasks",
        "pip_item": "pipeline_items",
        "pip": "pipelines",
        "pro": "projects"
      });
      let query = SqlBricks.select("*").from("pro");
      query = query.where({
        user_id: props.user_id
      })
      query = query.orderBy("id DESC");
      let resData = await SqlService.select(query.toString());
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