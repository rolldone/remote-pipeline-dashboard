import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

export default {
  async addPipeline(props): Promise<any> {
    try {
      let formData = new FormData();
      for (var key in props) {
        formData.append(key, props[key]);
      }
      let resData = await axios({
        method: "post",
        url: BaseService.PIPELINE + '/add',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;

      // let id = await SqlService.insert(SqlBricks.insert('pipelines', {
      //   name: props.name,
      //   description: props.description,
      //   project_id: props.project_id
      // }).toString());
      // let resData = await SqlService.selectOne(SqlBricks.select("*").from("pipelines").where("id", id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async updatePipeline(props): Promise<any> {
    try {
      let formData = new FormData();
      for (var key in props) {
        formData.append(key, props[key]);
      }
      let resData = await axios({
        method: "post",
        url: BaseService.PIPELINE + '/update',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // let resData = await SqlService.update(SqlBricks.update('pipelines', {
      //   name: props.name,
      //   description: props.description,
      //   project_id: props.project_id
      // }).where("id", props.id).toString());
      // resData = await SqlService.selectOne(SqlBricks.select("*").from("pipelines").where("id", props.id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async getPipeline(props): Promise<any> {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE + '/' + props.id + "/view?" + query, {});
      return resData.data;
      // let resData = await SqlService.selectOne(SqlBricks.select("*").from("pipelines").where("id", props.id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async getPipelines(props): Promise<any> {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE + '/pipelines?' + query, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   'pro': "projects",
      //   "pip": "pipelines"
      // });
      // let query = SqlBricks.select(
      //   "pip.id as id",
      //   "pip.name as name",
      //   "pro.id as pro_id",
      //   "pro.name as pro_name"
      // ).from("pip");
      // query = query.leftJoin("pro").on("pro.id", "pip.project_id");
      // if (props.project_id != null) {
      //   query = query.where("pro.id", props.project_id);
      // }
      // query = query.orderBy("pip.id DESC");
      // let resData = await SqlService.select(query.toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  }
}