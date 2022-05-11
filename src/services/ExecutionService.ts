import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import QueueService from "./core/QueueService";
import BaseService from "./BaseService";
import axios from "axios";

export interface Execution {
  id?: number
  name?: string
  process_mode?: string
  process_limit?: number
  pipeline_id?: number
  project_id?: number
  user_id?: number
  variable_id?: number
  variable_option?: string
  pipeline_item_ids?: Array<number>
  host_ids?: Array<number>
  description?: string
}

export default {
  async addExecution(props: Execution) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'pipeline_item_ids':
            formData.append(key, JSON.stringify(props[key]));
            break;
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.EXECUTION + '/add',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // try {
    //   let resData = await SqlService.insert(SqlBricks.insert('executions', {
    //     id: props.id,
    //     name: props.name,
    //     process_mode: props.process_mode,
    //     process_limit: props.process_limit,
    //     pipeline_id: props.pipeline_id,
    //     project_id: props.project_id,
    //     user_id: props.user_id,
    //     variable_id: props.variable_id,
    //     variable_option: props.variable_option,
    //     pipeline_item_ids: JSON.stringify(props.pipeline_item_ids),
    //     host_ids: JSON.stringify(props.host_ids),
    //     description: props.description,
    //   }).toString());
    //   resData = await SqlService.selectOne(SqlBricks.select("*").from("executions").where("id", resData).toString());
    //   return {
    //     status: 'success',
    //     status_code: 200,
    //     return: resData
    //   }
    // } catch (ex) {

    // }
  },
  async updateExecution(props: Execution) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'pipeline_item_ids':
            formData.append(key, JSON.stringify(props[key]));
            break;
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.EXECUTION + '/update',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // try {
    //   let resData = await SqlService.update(SqlBricks.update('executions', {
    //     name: props.name,
    //     process_mode: props.process_mode,
    //     process_limit: props.process_limit,
    //     pipeline_id: props.pipeline_id,
    //     project_id: props.project_id,
    //     user_id: props.user_id,
    //     variable_id: props.variable_id,
    //     variable_option: props.variable_option,
    //     pipeline_item_ids: JSON.stringify(props.pipeline_item_ids),
    //     host_ids: JSON.stringify(props.host_ids),
    //     description: props.description,
    //   }).where("id", props.id).toString());
    //   resData = await SqlService.selectOne(SqlBricks.select("*").from("executions").where("id", props.id).toString());
    //   return {
    //     status: 'success',
    //     status_code: 200,
    //     return: resData
    //   }
    // } catch (ex) {

    // }
  },
  async deleteExecutions(ids: Array<number>) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids || '[]'));
      let resData = await axios({
        method: "post",
        url: BaseService.EXECUTION + '/delete',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // try {
    //   let _in: Array<any> | string = [
    //     ...ids
    //   ];
    //   _in = _in.join(',');
    //   let resData = await SqlService.delete(SqlBricks.delete('executions').where(SqlBricks.in("id", _in)).toString());
    //   return {
    //     status: 'success',
    //     status_code: 200,
    //     return: resData
    //   }
    // } catch (ex) {
    //   throw ex;
    // }
  },
  async getExecutions(props: any) {
    try {
      let query = new URLSearchParams(props as any);
      let resData = await axios.get(BaseService.EXECUTION + '/executions?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // try {
    //   SqlBricks.aliasExpansions({
    //     'pro': "projects",
    //     "pip": "pipelines",
    //     "pip_item": "pipeline_items",
    //     "var": "variables",
    //     'usr': "users",
    //     'exe': "executions",
    //   });
    //   let query = SqlBricks.select(
    //     'exe.id as id',
    //     'exe.name as name',
    //     'exe.process_mode as process_mode',
    //     'exe.process_limit as process_limit',
    //     'exe.pipeline_id as pipeline_id',
    //     'exe.project_id as project_id',
    //     'exe.user_id as user_id',
    //     'exe.variable_id as variable_id',
    //     'exe.variable_option as variable_option',
    //     'exe.pipeline_item_ids as pipeline_item_ids',
    //     'exe.host_ids as host_ids',
    //     'exe.description as description',
    //     'pro.name as pro_name',
    //     'pip.name as pip_name',
    //     'var.name as var_name'
    //   ).from("exe");
    //   query = query.leftJoin('pro').on({
    //     "pro.id": "exe.project_id"
    //   });
    //   query = query.leftJoin('pip').on({
    //     "pip.id": "exe.pipeline_id"
    //   });
    //   query = query.leftJoin("usr").on({
    //     "usr.id": "exe.user_id"
    //   });
    //   query = query.leftJoin("var").on({
    //     "var.id": "exe.variable_id"
    //   });
    //   if (props.user_id != null) {
    //     query = query.where("usr.id", props.user_id);
    //   }
    //   query = query.orderBy("exe.id DESC");
    //   let resData = await SqlService.select(query.toString());
    //   return {
    //     status: 'success',
    //     status_code: 200,
    //     return: resData
    //   }
    // } catch (ex) {
    //   throw ex;
    // }
  },
  async getExecution(props: any) {
    try {
      let id = props.id;
      delete props.id;
      let query = new URLSearchParams(props as any);
      let resData = await axios.get(BaseService.EXECUTION + '/' + id + '/view?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // try {
    //   SqlBricks.aliasExpansions({
    //     'pro': "projects",
    //     "pip": "pipelines",
    //     "pip_item": "pipeline_items",
    //     "var": "variables",
    //     'usr': "users",
    //     'exe': "executions",
    //   });
    //   let query = SqlBricks.select(
    //     'exe.id as id',
    //     'exe.name as name',
    //     'exe.process_mode as process_mode',
    //     'exe.process_limit as process_limit',
    //     'exe.pipeline_id as pipeline_id',
    //     'exe.project_id as project_id',
    //     'exe.user_id as user_id',
    //     'exe.variable_id as variable_id',
    //     'exe.variable_option as variable_option',
    //     'exe.pipeline_item_ids as pipeline_item_ids',
    //     'exe.host_ids as host_ids',
    //     'exe.description as description',
    //     'pro.name as pro_name',
    //     'pip.name as pip_name',
    //     'var.name as var_name'
    //   ).from("exe");
    //   query = query.leftJoin('pro').on({
    //     "pro.id": "exe.project_id"
    //   });
    //   query = query.leftJoin('pip').on({
    //     "pip.id": "exe.pipeline_id"
    //   });
    //   query = query.leftJoin("usr").on({
    //     "usr.id": "exe.user_id"
    //   });
    //   query = query.leftJoin("var").on({
    //     "var.id": "exe.variable_id"
    //   });
    //   if (props.user_id != null) {
    //     query = query.where("usr.id", props.user_id);
    //   }
    //   query = query.where("exe.id", props.id);
    //   query = query.orderBy("exe.id DESC");
    //   query = query.limit(1);
    //   let resData = await SqlService.selectOne(query.toString());
    //   return {
    //     status: 'success',
    //     status_code: 200,
    //     return: resData
    //   }
    // } catch (ex) {
    //   throw ex;
    // }
  },
  async runExecution(props) {
    try {
      let formData = new FormData();
      formData.append("id", props.id);
      let resData = await axios({
        method: "post",
        url: BaseService.EXECUTION + '/run',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // try {
    //   /* Get the execution data first */
    //   SqlBricks.aliasExpansions({
    //     'pro': "projects",
    //     "pip": "pipelines",
    //     "pip_item": "pipeline_items",
    //     "var": "variables",
    //     'usr': "users",
    //     'exe': "executions",
    //   });
    //   let query = SqlBricks.select(
    //     'exe.id as id',
    //     'exe.name as name',
    //     'exe.process_mode as process_mode',
    //     'exe.process_limit as process_limit',
    //     'exe.pipeline_id as pipeline_id',
    //     'exe.project_id as project_id',
    //     'exe.user_id as user_id',
    //     'exe.variable_id as variable_id',
    //     'exe.variable_option as variable_option',
    //     'exe.pipeline_item_ids as pipeline_item_ids',
    //     'exe.host_ids as host_ids',
    //     'exe.description as description',
    //     'pro.name as pro_name',
    //     'pip.name as pip_name',
    //     'var.name as var_name'
    //   ).from("exe");
    //   query = query.leftJoin('pro').on({
    //     "pro.id": "exe.project_id"
    //   });
    //   query = query.leftJoin('pip').on({
    //     "pip.id": "exe.pipeline_id"
    //   });
    //   query = query.leftJoin("usr").on({
    //     "usr.id": "exe.user_id"
    //   });
    //   query = query.leftJoin("var").on({
    //     "var.id": "exe.variable_id"
    //   });
    //   if (props.user_id != null) {
    //     query = query.where("usr.id", props.user_id);
    //   }
    //   query = query.where("exe.id", props.id);
    //   query = query.orderBy("exe.id DESC");
    //   query = query.limit(1);
    //   let resData = await SqlService.selectOne(query.toString());
    //   /* Generate the on bull queue */
    //   let resDataQueue = await QueueService.queue(resData.id);
    //   if (resDataQueue == "") {
    //     let _form_data = new FormData();
    //     _form_data.append("id", resData.id);
    //     _form_data.append("data", "{}");
    //     _form_data.append("process_mode_path", resData.process_mode == "sequential" ? "queue.request.basic" : "queue.request.parallel");
    //     resDataQueue = await QueueService.create(_form_data);
    //     debugger;
    //   }
    // } catch (ex) {
    //   throw ex;
    // }
  }
}