import { PipelineTaskInterface } from "./PipelineTaskService";
import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

export interface pipeline_item {
  id?: number
  name?: string
  description?: string
  pipeline_id?: number
  project_id?: number
  command_datas?: Array<PipelineTaskInterface>
  is_active?: boolean
  type?: string
  order_number?: number
  order_by_name?: string
  order_by_value?: any
}

export default {
  async getPipelineItemParents(project_id: number, pipeline_id: number, order_number: number) {
    try {
      let props = {
        project_id,
        pipeline_id,
        order_number
      }
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE_ITEM + '/pipeline-item-parents?' + query, {});
      return resData.data;
      // let resData = await SqlService.select(SqlBricks.select("*").from("pipeline_items")
      //   .where({
      //     "pipeline_id": pipeline_id,
      //     "project_id": project_id
      //   }).where(SqlBricks.gtSome("order_number", order_number)).toString());
      // return resData;
    } catch (ex) {
      throw ex;
    }
  },
  async getPipelineItem(props: pipeline_item) {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE_ITEM + '/' + id + '/view?' + query, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   'pro': "projects",
      //   'pip': "pipelines",
      //   'pip_item': "pipeline_items"
      // });
      // let query = SqlBricks.select(
      //   "pip_item.name as name",
      //   "pip_item.id as id",
      //   "pip_item.description as description",
      //   "pip_item.is_active as is_active",
      //   "pip_item.order_number as order_number",
      //   "pro.name as pro_name",
      //   "pro.id as pro_id",
      //   "pro.description as pro_description",
      //   "pro.user_id as pro_user_id",
      //   "pip.name as pip_name",
      //   "pip.id as pip_id",
      //   "pip.description as pip_description"
      // ).from("pip_item").leftJoin("pro").on({
      //   "pro.id": "pip_item.project_id"
      // }).leftJoin("pip").on({
      //   "pip.id": "pip_item.pipeline_id"
      // });
      // query = query.where({
      //   "pip_item.project_id": props.project_id,
      //   "pip_item.pipeline_id": props.pipeline_id,
      //   "pip_item.id": props.id
      // });
      // query = query.limit(1);
      // // return query.toString();
      // let resData = await SqlService.selectOne(query.toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async getPipelineItems(props: pipeline_item) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE_ITEM + '/pipeline-items?' + query, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   'pro': "projects",
      //   'pip_item': "pipeline_items",
      //   'pip': "pipelines"
      // });
      // let query = SqlBricks.select(
      //   "pip_item.name as name",
      //   "pip_item.id as id",
      //   "pip_item.description as description",
      //   "pip_item.is_active as is_active",
      //   "pip_item.order_number as order_number",
      //   "pro.name as pro_name",
      //   "pro.id as pro_id",
      //   "pro.description as pro_description",
      //   "pro.user_id as pro_user_id",
      //   "pip.name as pip_name",
      //   "pip.id as pip_id",
      //   "pip.description as pip_description"
      // ).from("pip_item").leftJoin("pro").on({
      //   "pro.id": "pip_item.project_id"
      // }).leftJoin("pip").on({
      //   "pip.id": "pip_item.pipeline_id"
      // });
      // query = query.where({
      //   "pip_item.project_id": props.project_id,
      //   "pip_item.pipeline_id": props.pipeline_id,
      // });
      // if (props.order_by_name != null) {
      //   query = query.orderBy("pip_item." + props.order_by_name + " " + props.order_by_value);
      // }
      // // return query.toString();
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
  async addPipelineItem(props: pipeline_item) {
    try {
      let formData = new FormData();
      for (var key in props) {
        if (props[key] != null) {
          formData.append(key, props[key]);
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.PIPELINE_ITEM + '/add',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   'pro': "projects",
      //   'pip': "pipelines",
      //   'pip_item': "pipeline_items"
      // });
      // let query = SqlBricks.select("*").from("pip_item");
      // query = query.where({
      //   "pip_item.project_id": props.project_id,
      //   "pip_item.pipeline_id": props.pipeline_id,
      //   "pip_item.id": props.id
      // });
      // query = query.limit(1);
      // // return query.toString();
      // let existData = await SqlService.selectOne(query.toString());
      // let resData = null;
      // if (existData == "" || existData == null) {
      //   resData = await SqlService.insert(SqlBricks.insert('pipeline_items', {
      //     pipeline_id: props.pipeline_id,
      //     project_id: props.project_id,
      //     name: props.name,
      //     is_active: props.is_active,
      //     type: props.type,
      //     order_number: props.order_number,
      //     description: props.description
      //   }).toString());
      //   resData = await SqlService.selectOne(SqlBricks.select("*").from("pipeline_items").where("id", resData).toString());
      //   return {
      //     status: 'success',
      //     status_code: 200,
      //     return: resData
      //   }
      // } else {
      //   return this.updatePipelineItem(props);
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async updatePipelineItem(props: pipeline_item) {
    try {
      let formData = new FormData();
      for (var key in props) {
        if (props[key] != null) {
          formData.append(key, props[key]);
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.PIPELINE_ITEM + '/update',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // await SqlService.update(SqlBricks.update('pipeline_items', {
      //   pipeline_id: props.pipeline_id,
      //   project_id: props.project_id,
      //   name: props.name,
      //   is_active: props.is_active,
      //   type: props.type,
      //   order_number: props.order_number,
      //   description: props.description
      // }).where("id", props.id).toString());
      // let resData = await SqlService.selectOne(SqlBricks.select("*").from("pipeline_items").where("id", props.id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async deletePipelineItem(ids: Array<number>) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids || '[]'));
      let resData = await axios({
        method: "post",
        url: BaseService.PIPELINE_ITEM + '/delete',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // let _in: Array<any> | string = [
      //   ...ids
      // ];
      // _in = _in.join(',');
      // let resData = await SqlService.delete(SqlBricks.delete('pipeline_items').where(SqlBricks.in("id", _in)).toString());
      // // Delete tasks
      // await SqlService.delete(SqlBricks.delete("pipeline_tasks").where(SqlBricks.in("pipeline_item_id", _in)).toString());
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