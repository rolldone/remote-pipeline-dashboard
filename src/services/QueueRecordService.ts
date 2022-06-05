import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import QueueService from "./core/QueueService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

export const QueueRecordStatus = {
  STAND_BY: 0,
  READY: 1,
  COMPLETED: 2,
  FAILED: 3,
  DELAYED: 4
}

export interface QueueRecordInterface {
  id?: number
  queue_key?: string
  execution_id?: number
  status?: number
  data?: string
  type?: string
  exe_process_mode?: string
  exe_process_limit?: number
  exe_delay?: null
}

export interface QueueRecordServiceInterface extends QueueRecordInterface {
  ids?: Array<number>
  limit?: number
  page?: number
  order_by?: string
  offset?: number

  force_deleted?: boolean
}

export default {
  status: QueueRecordStatus,
  async addQueueRecord(props: QueueRecordInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'data':
            formData.append(key, JSON.stringify(props[key] || {}));
            break;
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE_RECORD + '/add',
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
    //   let resDataId = await SqlService.insert(SqlBricks.insert('queue_records', {
    //     queue_key: props.queue_key,
    //     execution_id: props.execution_id,
    //     status: props.status,
    //     data: JSON.stringify(props.data || {}),
    //     type: props.type
    //   }).toString());

    //   SqlBricks.aliasExpansions({
    //     'qrec': "queue_records",
    //     'exe': "executions",
    //   });
    //   // Get again
    //   let query = SqlBricks.select(
    //     'qrec.id as id',
    //     'qrec.queue_key as queue_key',
    //     'qrec.execution_id as execution_id',
    //     'qrec.status as status',
    //     'qrec.data as data',
    //     'exe.id as exe_id',
    //     'exe.name as exe_name',
    //     'exe.process_mode as exe_process_mode',
    //     'exe.process_limit as exe_process_limit',
    //     'exe.pipeline_id as exe_pipeline_id',
    //     'exe.project_id as exe_project_id',
    //     'exe.user_id as exe_user_id',
    //     'exe.variable_id as exe_variable_id',
    //     'exe.variable_option as exe_variable_option',
    //     'exe.pipeline_item_ids as exe_pipeline_item_ids',
    //     'exe.host_ids as exe_host_ids',
    //     'exe.description as exe_description',
    //   ).from("qrec");
    //   query = query.leftJoin('exe').on({
    //     "qrec.execution_id": "exe.id"
    //   });
    //   query = query.orderBy("exe.id DESC");
    //   query = query.limit(1);
    //   query = query.where({
    //     "qrec.id": resDataId
    //   })
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
  async updateQueueRecord(props: QueueRecordInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'data':
            console.log("props[key]", props[key]);
            formData.append(key, JSON.stringify(props[key] || {}));
            break;
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData: any = await axios({
        method: "post",
        url: BaseService.QUEUE_RECORD + '/update',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      resData = resData.data;
      return resData;
    } catch (ex) {
      throw ex;
    }
    // try {
    //   let resData = await SqlService.update(SqlBricks.update('queue_records', {
    //     queue_key: props.queue_key,
    //     execution_id: props.execution_id,
    //     status: props.status,
    //     data: JSON.stringify(props.data || {}),
    //     type: props.type || 'instant'
    //   }).where("id", props.id).toString());
    //   // Get again
    //   SqlBricks.aliasExpansions({
    //     'qrec': "queue_records",
    //     'exe': "executions",
    //   });
    //   let query = SqlBricks.select(
    //     'qrec.id as id',
    //     'qrec.queue_key as queue_key',
    //     'qrec.execution_id as execution_id',
    //     'qrec.status as status',
    //     'qrec.data as data',
    //     'exe.id as exe_id',
    //     'exe.name as exe_name',
    //     'exe.process_mode as exe_process_mode',
    //     'exe.process_limit as exe_process_limit',
    //     'exe.pipeline_id as exe_pipeline_id',
    //     'exe.project_id as exe_project_id',
    //     'exe.user_id as exe_user_id',
    //     'exe.variable_id as exe_variable_id',
    //     'exe.variable_option as exe_variable_option',
    //     'exe.pipeline_item_ids as exe_pipeline_item_ids',
    //     'exe.host_ids as exe_host_ids',
    //     'exe.description as exe_description',
    //   ).from("qrec");
    //   query = query.leftJoin('exe').on({
    //     "qrec.execution_id": "exe.id"
    //   });
    //   query = query.orderBy("exe.id DESC");
    //   query = query.limit(1);
    //   query = query.where({
    //     "qrec.id": props.id
    //   })
    //   resData = await SqlService.selectOne(query.toString());
    //   // And register to the bullmq
    //   let formData = new FormData();
    //   formData.append("id", resData.id);
    //   formData.append("data", resData.data);
    //   formData.append("process_mode", resData.exe_process_mode);
    //   if (resData.exe_process_mode == "parallel") {
    //     formData.append("process_limit", resData.exe_process_limit);
    //   }
    //   if (resData.status == 0) {
    //     resData = await QueueService.delete(formData);
    //   } else {
    //     resData = await QueueService.create(formData);
    //   }
    //   return {
    //     status: 'success',
    //     status_code: 200,
    //     return: resData
    //   }
    // } catch (ex) {
    //   throw ex;
    // }
  },
  async deleteQueueRecord(props: QueueRecordServiceInterface) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(props.ids || '[]'));
      formData.append("force_deleted", props.force_deleted as any || false);
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE_RECORD + '/delete',
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
    //   let resData = await SqlService.delete(SqlBricks.delete('queue_records').where(SqlBricks.in("id", _in)).toString());
    //   return {
    //     status: 'success',
    //     status_code: 200,
    //     return: resData
    //   }
    // } catch (ex) {
    //   throw ex;
    // }
  },
  async getQueueRecords(props: QueueRecordServiceInterface) {
    try {
      let query = new URLSearchParams(props as any);
      let resData = await axios.get(BaseService.QUEUE_RECORD + '/queue-records?' + query, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   'qrec': "queue_records",
      //   'exe': "executions",
      // });
      // let query = SqlBricks.select(
      //   'qrec.id as id',
      //   'qrec.queue_key as queue_key',
      //   'qrec.execution_id as execution_id',
      //   'qrec.status as status',
      //   'qrec.data as data',
      //   'qrec.type as type',
      //   'exe.id as exe_id',
      //   'exe.name as exe_name',
      //   'exe.process_mode as exe_process_mode',
      //   'exe.process_limit as exe_process_limit',
      //   'exe.pipeline_id as exe_pipeline_id',
      //   'exe.project_id as exe_project_id',
      //   'exe.user_id as exe_user_id',
      //   'exe.variable_id as exe_variable_id',
      //   'exe.variable_option as exe_variable_option',
      //   'exe.pipeline_item_ids as exe_pipeline_item_ids',
      //   'exe.host_ids as exe_host_ids',
      //   'exe.description as exe_description',
      // ).from("qrec");
      // query = query.leftJoin('exe').on({
      //   "qrec.execution_id": "exe.id"
      // });
      // if (props.type != null) {
      //   query = query.where("type", props.type);
      // }
      // query = query.orderBy("exe.id DESC");
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
  async getQueueRecord(props: QueueRecordServiceInterface) {
    try {
      let id = props.id;
      delete props.id;
      let queryString = new URLSearchParams(props as any).toString();
      let resData = await axios.get(BaseService.QUEUE_RECORD + '/' + id + "/view?" + queryString, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   'qrec': "queue_records",
      //   'exe': "executions",
      // });
      // let query = SqlBricks.select(
      //   'qrec.id as id',
      //   'qrec.queue_key as queue_key',
      //   'qrec.execution_id as execution_id',
      //   'qrec.status as status',
      //   'qrec.data as data',
      //   'exe.id as exe_id',
      //   'exe.name as exe_name',
      //   'exe.process_mode as exe_process_mode',
      //   'exe.process_limit as exe_process_limit',
      //   'exe.pipeline_id as exe_pipeline_id',
      //   'exe.project_id as exe_project_id',
      //   'exe.user_id as exe_user_id',
      //   'exe.variable_id as exe_variable_id',
      //   'exe.variable_option as exe_variable_option',
      //   'exe.pipeline_item_ids as exe_pipeline_item_ids',
      //   'exe.host_ids as exe_host_ids',
      //   'exe.description as exe_description',
      // ).from("qrec");
      // query = query.leftJoin('exe').on({
      //   "qrec.execution_id": "exe.id"
      // });
      // query = query.orderBy("exe.id DESC");
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
  },
  async getQueueIdsStatus(ids?: Array<number>) {
    try {
      let query = SmartUrlSearchParams({
        ids: JSON.stringify(ids || [])
      });
      let resData = await axios.get(BaseService.QUEUE_RECORD + '/ids/status?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}