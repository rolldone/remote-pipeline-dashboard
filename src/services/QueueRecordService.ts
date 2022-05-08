import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import QueueService from "./core/QueueService";
import BaseService from "./BaseService";
import axios from "axios";

export interface QueueRecordInterface {
  id?: number
  queue_key?: string
  execution_id?: number
  status?: number
  data?: string
  type?: string
}

export default {
  async addQueueRecord(props: QueueRecordInterface) {
    try {
      let resDataId = await SqlService.insert(SqlBricks.insert('queue_records', {
        queue_key: props.queue_key,
        execution_id: props.execution_id,
        status: props.status,
        data: JSON.stringify(props.data || {}),
        type: props.type
      }).toString());

      SqlBricks.aliasExpansions({
        'qrec': "queue_records",
        'exe': "executions",
      });
      // Get again
      let query = SqlBricks.select(
        'qrec.id as id',
        'qrec.queue_key as queue_key',
        'qrec.execution_id as execution_id',
        'qrec.status as status',
        'qrec.data as data',
        'exe.id as exe_id',
        'exe.name as exe_name',
        'exe.process_mode as exe_process_mode',
        'exe.process_limit as exe_process_limit',
        'exe.pipeline_id as exe_pipeline_id',
        'exe.project_id as exe_project_id',
        'exe.user_id as exe_user_id',
        'exe.variable_id as exe_variable_id',
        'exe.variable_option as exe_variable_option',
        'exe.pipeline_item_ids as exe_pipeline_item_ids',
        'exe.host_ids as exe_host_ids',
        'exe.description as exe_description',
      ).from("qrec");
      query = query.leftJoin('exe').on({
        "qrec.execution_id": "exe.id"
      });
      query = query.orderBy("exe.id DESC");
      query = query.limit(1);
      query = query.where({
        "qrec.id": resDataId
      })
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
  async updateQueueRecord(props: QueueRecordInterface) {
    try {
      let resData = await SqlService.update(SqlBricks.update('queue_records', {
        queue_key: props.queue_key,
        execution_id: props.execution_id,
        status: props.status,
        data: JSON.stringify(props.data || {}),
        type: props.type || 'instant'
      }).where("id", props.id).toString());
      // Get again
      SqlBricks.aliasExpansions({
        'qrec': "queue_records",
        'exe': "executions",
      });
      let query = SqlBricks.select(
        'qrec.id as id',
        'qrec.queue_key as queue_key',
        'qrec.execution_id as execution_id',
        'qrec.status as status',
        'qrec.data as data',
        'exe.id as exe_id',
        'exe.name as exe_name',
        'exe.process_mode as exe_process_mode',
        'exe.process_limit as exe_process_limit',
        'exe.pipeline_id as exe_pipeline_id',
        'exe.project_id as exe_project_id',
        'exe.user_id as exe_user_id',
        'exe.variable_id as exe_variable_id',
        'exe.variable_option as exe_variable_option',
        'exe.pipeline_item_ids as exe_pipeline_item_ids',
        'exe.host_ids as exe_host_ids',
        'exe.description as exe_description',
      ).from("qrec");
      query = query.leftJoin('exe').on({
        "qrec.execution_id": "exe.id"
      });
      query = query.orderBy("exe.id DESC");
      query = query.limit(1);
      query = query.where({
        "qrec.id": props.id
      })
      resData = await SqlService.selectOne(query.toString());
      // And register to the bullmq
      let formData = new FormData();
      formData.append("id", resData.id);
      formData.append("data", resData.data);
      formData.append("process_mode", resData.exe_process_mode);
      if (resData.exe_process_mode == "parallel") {
        formData.append("process_limit", resData.exe_process_limit);
      }
      if (resData.status == 0) {
        resData = await QueueService.delete(formData);
      } else {
        resData = await QueueService.create(formData);
      }
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async deleteQueueRecord(ids: Array<number>) {
    try {
      let _in: Array<any> | string = [
        ...ids
      ];
      _in = _in.join(',');
      let resData = await SqlService.delete(SqlBricks.delete('queue_records').where(SqlBricks.in("id", _in)).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getQueueRecords(props) {
    try {
      let query = new URLSearchParams(props);
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
  async getQueueRecord(props) {
    try {
      let id = props.id;
      delete props.id;
      let queryString = new URLSearchParams(props).toString();
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
  }
}