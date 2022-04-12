import localStorageDB from "localstoragedb"
import { command_data } from "./PipelineTaskService";
import SqlBricks from "./SqlBricks";
import SqlService from "./SqlService";

export interface pipeline_item {
  id?: number
  name: string
  description: string
  pipeline_id: number
  project_id: number
  command_datas?: Array<command_data>
  is_active?: boolean
  type?: string
  order_number?: number
}

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
  async getPipelineItem(props) {
    try {
      SqlBricks.aliasExpansions({
        'pro': "projects",
        'pip': "pipelines",
        'pip_item': "pipeline_items"
      });
      let query = SqlBricks.select(
        "pip_item.name as pip_item_name",
        "pip_item.id as pip_item_id",
        "pip_item.description as pip_item_description",
        "pip_item.is_active as pip_item_is_active",
        "pip_item.order_number as pip_item_order_number",
        "pro.name as pro_name",
        "pro.id as pro_id",
        "pro.description as pro_description",
        "pro.user_id as pro_user_id",
        "pip.name as pip_name",
        "pip.id as pip_id",
        "pip.description as pip_description"
      ).from("pip_item").leftJoin("pro").on({
        "pro.id": "pip_item.project_id"
      }).leftJoin("pip").on({
        "pip.id": "pip_item.pipeline_id"
      });
      query = query.where({
        "pip_item.project_id": props.project_id,
        "pip_item.pipeline_id": props.pipeline_id,
        "pip_item.id": props.id
      });
      query = query.limit(1);
      // return query.toString();
      let resData = await SqlService.selectOne(query.toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getPipelineItems(props) {
    try {
      SqlBricks.aliasExpansions({
        'pro': "projects",
        'pip_item': "pipeline_items",
        'pip': "pipelines"
      });
      let query = SqlBricks.select(
        "pip_item.name as pip_item_name",
        "pip_item.id as pip_item_id",
        "pip_item.description as pip_item_description",
        "pip_item.is_active as pip_item_is_active",
        "pip_item.order_number as pip_item_order_number",
        "pro.name as pro_name",
        "pro.id as pro_id",
        "pro.description as pro_description",
        "pro.user_id as pro_user_id",
        "pip.name as pip_name",
        "pip.id as pip_id",
        "pip.description as pip_description"
      ).from("pip_item").leftJoin("pro").on({
        "pro.id": "pip_item.project_id"
      }).leftJoin("pip").on({
        "pip.id": "pip_item.pipeline_id"
      });
      query = query.where({
        "pip_item.project_id": props.project_id,
        "pip_item.pipeline_id": props.pipeline_id,
      });
      if (props.order_by_name != null) {
        query = query.orderBy("pip_item." + props.order_by_name + " " + props.order_by_value);
      }
      // return query.toString();
      let resData = await SqlService.select(query.toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async addPipelineItem(props: pipeline_item) {
    try {
      SqlBricks.aliasExpansions({
        'pro': "projects",
        'pip': "pipelines",
        'pip_item': "pipeline_items"
      });
      let query = SqlBricks.select("*").from("pip_item");
      query = query.where({
        "pip_item.project_id": props.project_id,
        "pip_item.pipeline_id": props.pipeline_id,
        "pip_item.id": props.id
      });
      query = query.limit(1);
      // return query.toString();
      let existData = await SqlService.selectOne(query.toString());
      let resData = null;
      if (existData == "" || existData == null) {
        resData = await SqlService.insert(SqlBricks.insert('pipeline_items', {
          pipeline_id: props.pipeline_id,
          project_id: props.project_id,
          name: props.name,
          is_active: props.is_active,
          type: props.type,
          order_number: props.order_number,
          description: props.description
        }).toString());
        resData = await SqlService.selectOne(SqlBricks.select("*").from("pipeline_items").where("id", resData).toString());
        return {
          status: 'success',
          status_code: 200,
          return: resData
        }
      } else {
        return this.updatePipelineItem(props);
      }
    } catch (ex) {
      throw ex;
    }
  },
  async updatePipelineItem(props: pipeline_item) {
    try {
      await SqlService.update(SqlBricks.update('pipeline_items', {
        pipeline_id: props.pipeline_id,
        project_id: props.project_id,
        name: props.name,
        is_active: props.is_active,
        type: props.type,
        order_number: props.order_number,
        description: props.description
      }).where("id", props.id).toString());
      let resData = await SqlService.selectOne(SqlBricks.select("*").from("pipeline_items").where("id", props.id).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async deletePipelineItem(ids: Array<number>) {
    try {
      let _in: Array<any> | string = [
        ...ids
      ];
      _in = _in.join(',');
      let resData = await SqlService.delete(SqlBricks.delete('pipeline_items').where(SqlBricks.in("id", _in)).toString());
      // Delete tasks
      await SqlService.delete(SqlBricks.delete("pipeline_tasks").where(SqlBricks.in("pipeline_item_id", _in)).toString());
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