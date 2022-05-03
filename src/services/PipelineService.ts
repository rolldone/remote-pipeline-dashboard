import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";

export default {
  async addPipeline(props): Promise<any> {
    try {
      let id = await SqlService.insert(SqlBricks.insert('pipelines', {
        name: props.name,
        description: props.description,
        project_id: props.project_id
      }).toString());
      let resData = await SqlService.selectOne(SqlBricks.select("*").from("pipelines").where("id", id).toString());
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
      resData = await SqlService.selectOne(SqlBricks.select("*").from("pipelines").where("id", props.id).toString());
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
      let resData = await SqlService.selectOne(SqlBricks.select("*").from("pipelines").where("id", props.id).toString());
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
      SqlBricks.aliasExpansions({
        'pro': "projects",
        "pip": "pipelines"
      });
      let query = SqlBricks.select(
        "pip.id as id",
        "pip.name as name",
        "pro.id as pro_id",
        "pro.name as pro_name"
      ).from("pip");
      query = query.leftJoin("pro").on("pro.id", "pip.project_id");
      if (props.project_id != null) {
        query = query.where("pro.id", props.project_id);
      }
      query = query.orderBy("pip.id DESC");
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