import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

export default {
  async addProject(props): Promise<any> {
    try {
      let formData = new FormData();
      for (var key in props) {
        formData.append(key, props[key]);
      }
      let resData = await axios({
        method: "post",
        url: BaseService.PROJECT + '/add',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // let id = await SqlService.insert(SqlBricks.insert('projects', {
      //   name: props.name,
      //   description: props.description
      // }).toString());
      // let resData = await SqlService.selectOne(SqlBricks.select("*").from("projects").where("id", id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async updateProject(props): Promise<any> {
    try {
      let formData = new FormData();
      for (var key in props) {
        formData.append(key, props[key]);
      }
      let resData = await axios({
        method: "post",
        url: BaseService.PROJECT + '/update',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // let res = await SqlService.update(SqlBricks.update('projects', {
      //   name: props.name,
      //   description: props.description
      // }).where("id", props.id).toString());
      // let resData = await SqlService.selectOne(SqlBricks.select("*").from("projects").where("id", props.id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async getProject(props): Promise<any> {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PROJECT + '/' + props.id + "/view?" + query, {});
      return resData.data;
      // let resData = await SqlService.selectOne(SqlBricks.select("*").from("projects").where("id", props.id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async getProjects(props): Promise<any> {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PROJECT + '/projects?' + query, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   "pip_task": "pipeline_tasks",
      //   "pip_item": "pipeline_items",
      //   "pip": "pipelines",
      //   "pro": "projects"
      // });
      // let query = SqlBricks.select("*").from("pro");
      // query = query.where({
      //   user_id: props.user_id
      // })
      // query = query.orderBy("id DESC");
      // let resData = await SqlService.select(query.toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  deleteProjects: async function (ids: Array<number>) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids || '[]'));
      let resData = await axios({
        method: "post",
        url: BaseService.PROJECT + '/delete',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
}