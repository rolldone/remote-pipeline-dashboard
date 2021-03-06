import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import axios from "axios";
import BaseService from "./BaseService";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

export interface PipelineTaskInterface {
  id?: number
  project_id?: number
  pipeline_id?: number
  pipeline_item_id?: number
  type?: string
  description?: string
  name?: string
  order_number?: number
  temp_id?: string
  is_active?: boolean | number
  data?: {
    parent_condition_type?: string
    condition_values?: string
    command?: string
  },
}

export interface PipelineTaskServiceInterface extends PipelineTaskInterface {
  pipeline_item_ids?: Array<number>
  parent_order_temp_ids?: Array<string>
  order_by?: string
}

export default {
  async deletePipelineTaskByPipelineItemId(pipeline_item_id: number) {
    try {
      let formData = new FormData();
      formData.append("pipeline_item_id", pipeline_item_id + "");
      let resData = await axios({
        method: "post",
        url: BaseService.PIPELINE_TASK + '/delete-by-pipeline',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // let resData = await SqlService.delete(SqlBricks.deleteFrom("pipeline_tasks").where({
      //   pipeline_item_id: pipeline_item_id
      // }).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async addPipelineTasks(props: Array<PipelineTaskInterface>) {
    try {
      let _command_data = JSON.stringify(props);
      let formData = new FormData();
      formData.append("command_datas", _command_data);
      let resData = await axios({
        method: "post",
        url: BaseService.PIPELINE_TASK + '/add',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // Delete First
      // let resDeleteData = await SqlService.delete(SqlBricks.deleteFrom("pipeline_tasks").where({
      //   pipeline_item_id: props[0].pipeline_item_id
      // }).toString());
      // let resData = [];
      // for (var a = 0; a < props.length; a++) {
      //   // Insert again
      //   let _command_data = props[a];
      //   let resDataId = await SqlService.insert(SqlBricks.insert("pipeline_tasks", {
      //     pipeline_id: _command_data.pipeline_id,
      //     project_id: _command_data.project_id,
      //     pipeline_item_id: _command_data.pipeline_item_id,
      //     name: _command_data.name,
      //     description: _command_data.description,
      //     type: _command_data.type,
      //     order_number: _command_data.order_number,
      //     temp_id: _command_data.temp_id,
      //     parent_order_temp_ids: _command_data.parent_order_temp_ids == null ? null : JSON.stringify(_command_data.parent_order_temp_ids),
      //     is_active: _command_data.is_active,
      //     data: JSON.stringify(_command_data.data)
      //   }).toString());
      //   // Select the data
      //   resData.push(await SqlService.selectOne(SqlBricks.select("*").from("pipeline_tasks").where("id", resDataId).toString()));
      // }
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async getPipelineTasks(props: PipelineTaskServiceInterface) {
    try {
      for (var key in props) {
        switch (key) {
          case 'pipeline_item_ids':
            props.pipeline_item_ids = JSON.stringify(props.pipeline_item_ids || []) as any;
            break;
          default:
            break;
        }
      }
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE_TASK + '/pipeline-tasks?' + query, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   "pip_task": "pipeline_tasks",
      //   "pip_item": "pipeline_items",
      //   "pip": "pipelines",
      //   "pro": "projects"
      // });

      // let query = SqlBricks.select(
      //   "pip_task.id as id",
      //   "pip_task.name as name",
      //   "pip_task.pipeline_id as pipeline_id",
      //   "pip_task.project_id as project_id",
      //   "pip_task.pipeline_item_id as pipeline_item_id",
      //   "pip_task.type as type",
      //   "pip_task.description as description",
      //   "pip_task.order_number as order_number",
      //   "pip_task.temp_id as temp_id",
      //   "pip_task.parent_order_temp_ids as parent_order_temp_ids",
      //   "pip_task.is_active as is_active",
      //   "pip_task.data as data",
      //   "pip_item.id as pip_item_id",
      //   "pip_item.name as pip_item_name",
      //   "pip_item.is_active as pip_item_is_active",
      //   "pip_item.type as pip_item_type",
      //   "pip_item.order_number as pip_item_order_number",
      //   "pip_item.description as pip_item_description",
      //   "pip.id as pip_id",
      //   "pip.name as pip_name",
      //   "pip.description as pip_description",
      //   "pro.id as pro_id",
      //   "pro.name as pro_name",
      //   "pro.description as pro_description"
      // );

      // query = query.from("pip_task");
      // query = query.leftJoin("pip_item").on("pip_item.id", "pip_task.pipeline_item_id")
      //   .leftJoin("pip").on("pip.id", "pip_item.pipeline_id")
      //   .leftJoin("pro").on("pro.id", "pip.project_id");

      // if (props.pipeline_item_id != null) {
      //   query = query.where("pip_item.id", props.pipeline_item_id);
      // };

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
  async getPipelineTask(props: PipelineTaskServiceInterface) {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE_TASK + '/' + id + "/view?" + query, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   "pip_task": "pipeline_tasks",
      //   "pip_item": "pipeline_items",
      //   "pip": "pipelines",
      //   "pro": "projects"
      // });

      // let query = SqlBricks.select(
      //   "pip_task.id as id",
      //   "pip_task.name as name",
      //   "pip_task.pipeline_id as pipeline_id",
      //   "pip_task.project_id as project_id",
      //   "pip_task.pipeline_item_id as pipeline_item_id",
      //   "pip_task.type as type",
      //   "pip_task.description as description",
      //   "pip_task.order_number as order_number",
      //   "pip_task.temp_id as temp_id",
      //   "pip_task.is_active as is_active",
      //   "pip_task.data as data",
      //   "pip_item.id as pip_item_id",
      //   "pip_item.name as pip_item_name",
      //   "pip_item.is_active as pip_item_is_active",
      //   "pip_item.type as pip_item_type",
      //   "pip_item.order_number as pip_item_order_number",
      //   "pip_item.description as pip_item_description",
      //   "pip.id as pip_id",
      //   "pip.name as pip_name",
      //   "pip.description as pip_description",
      //   "pro.id as pro_id",
      //   "pro.name as pro_name",
      //   "pro.description as pro_description"
      // )

      // query = query.from("pip_task");
      // query = query.leftJoin("pip_item").on("pip_item.id", "pip_task.pipeline_item_id")
      //   .leftJoin("pip").on("pip.id", "pip_item.pipeline_id")
      //   .leftJoin("pro").on("pro.id", "pip.project_id");

      // if (props.id != null) {
      //   query = query.where("pip_task.id", props.id);
      // };

      // query = query.orderBy("pip_task.id ASC");
      // query = query.limit(1);

      // let resData = await SqlService.selectOne(query.toString());

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