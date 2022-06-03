import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import QueueService from "./core/QueueService";
import { QueueRecordInterface } from "./QueueRecordService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

export interface QueueRecordDetailInterface {
  id?: any
  queue_record_id?: number
  queue_name?: string
  job_id?: number
  data?: any
  status?: number
  limit?: number
  offset?: number
  order_by?: string
}

export interface QueueItemInterface {
  id?: any
  data?: any
  process_mode?: string
  host_id?: any
}

export default {
  async retryQueueDetail(props: QueueRecordDetailInterface) {
    try {
      let formData = new FormData();
      formData.append("id", props.id);
      let resData = await QueueService.createItem(formData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  async stopQueueDetail(props: QueueRecordDetailInterface) {
    try {
      let formData = new FormData();
      formData.append("id", props.id);
      let resData = await QueueService.deleteItem(formData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  async addQueueRecordDetail(props: QueueRecordDetailInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        formData.append(key, props[key]);
      }
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE_RECORD_DETAIL + '/add',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // let query = SqlBricks.insert("queue_record_details", {
      //   queue_record_id: props.queue_record_id,
      //   queue_name: props.queue_name,
      //   job_id: props.job_id,
      //   data: props.data,
      //   status: props.status,
      // }).toString();
      // let resDataId = await SqlService.insert(query);
      // SqlBricks.aliasExpansions({
      //   'qrec_detail': "queue_record_details",
      //   'qrec': "queue_records",
      // });
      // // Get again
      // let querySelect = SqlBricks.select(
      //   'qrec_detail.id as id',
      //   'qrec_detail.queue_record_id as queue_record_id',
      //   'qrec_detail.queue_name as queue_name',
      //   'qrec_detail.job_id as job_id',
      //   'qrec_detail.data as data',
      //   'qrec_detail.status as status',
      //   'qrec.id as qrec_id',
      //   'qrec.queue_key as qrec_queue_key',
      //   'qrec.execution_id as qrec_execution_id',
      //   'qrec.status as qrec_status',
      //   'qrec.data as qrec_data',
      // ).from("qrec_detail");
      // querySelect = querySelect.leftJoin('qrec').on({
      //   "qrec.id": "qrec_detail.queue_record_id"
      // });
      // querySelect = querySelect.orderBy("qrec_detail.id DESC");
      // querySelect = querySelect.limit(1);
      // querySelect = querySelect.where({
      //   "qrec_detail.id": resDataId
      // })
      // let resData = await SqlService.selectOne(querySelect.toString());

      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async updateQueueRecordDetail(props: QueueRecordDetailInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        formData.append(key, props[key]);
      }
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE_RECORD_DETAIL + '/update',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // let query = SqlBricks.update("queue_record_details", {
      //   queue_record_id: props.queue_record_id,
      //   queue_name: props.queue_name,
      //   job_id: props.job_id,
      //   data: props.data,
      //   status: props.status,
      // }).where("id", props.id).toString();
      // let resDataUpdate = await SqlService.update(query);
      // SqlBricks.aliasExpansions({
      //   'qrec_detail': "queue_record_details",
      //   'qrec': "queue_records",
      //   'exe': "executions"
      // });
      // // Get again
      // let querySelect = SqlBricks.select(
      //   'qrec_detail.id as id',
      //   'qrec_detail.queue_record_id as queue_record_id',
      //   'qrec_detail.queue_name as queue_name',
      //   'qrec_detail.job_id as job_id',
      //   'qrec_detail.data as data',
      //   'qrec_detail.status as status',
      //   'qrec.id as qrec_id',
      //   'qrec.queue_key as qrec_queue_key',
      //   'qrec.execution_id as qrec_execution_id',
      //   'qrec.status as qrec_status',
      //   'qrec.data as qrec_data',
      // ).from("qrec_detail");
      // querySelect = querySelect.leftJoin('qrec').on({
      //   "qrec.id": "qrec_detail.queue_record_id"
      // });
      // querySelect = querySelect.orderBy("qrec_detail.id DESC");
      // querySelect = querySelect.limit(1);
      // querySelect = querySelect.where({
      //   "qrec_detail.id": props.id
      // })
      // let resData = await SqlService.selectOne(querySelect.toString());

      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async getQueueRecordDetails(props: QueueRecordDetailInterface) {
    try {
      let queryString = SmartUrlSearchParams(props).toString();
      let resData = await axios.get(BaseService.QUEUE_RECORD_DETAIL + '/queue-record-details?' + queryString, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   'qrec_detail': "queue_record_details",
      //   'qrec': "queue_records",
      //   'exe': "executions"
      // });
      // // Get again
      // let query = SqlBricks.select(
      //   'qrec_detail.id as id',
      //   'qrec_detail.queue_record_id as queue_record_id',
      //   'qrec_detail.queue_name as queue_name',
      //   'qrec_detail.job_id as job_id',
      //   'qrec_detail.data as data',
      //   'qrec_detail.status as status',
      //   'qrec.id as qrec_id',
      //   'qrec.queue_key as qrec_queue_key',
      //   'qrec.execution_id as qrec_execution_id',
      //   'qrec.status as qrec_status',
      //   'qrec.data as qrec_data',
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
      // ).from("qrec_detail");
      // query = query.leftJoin('qrec').on({
      //   "qrec.id": "qrec_detail.queue_record_id"
      // });
      // query = query.leftJoin('exe').on({
      //   "qrec.execution_id": "exe.id"
      // });
      // if (props.queue_record_id != null) {
      //   query = query.where("qrec_detail.queue_record_id", props.queue_record_id);
      // }
      // if (props.limit != null) {
      //   query = query.limit(props.limit);
      //   if(props.offset != null){
      //     query = query.offset(props.offset * props.limit);
      //   }
      // }

      // query = query.orderBy("qrec_detail.id DESC");
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
  async getQueueRecordDetail(props: QueueRecordDetailInterface) {
    try {
      let id = props.id;
      delete props.id;
      let queryString = SmartUrlSearchParams(props).toString();
      let resData = await axios.get(BaseService.QUEUE_RECORD_DETAIL + '/' + id + "/view?" + queryString, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // SqlBricks.aliasExpansions({
    //   'qrec_detail': "queue_record_details",
    //   'qrec': "queue_records",
    //   'exe': "executions"
    // });
    // // Get again
    // let query = SqlBricks.select(
    //   'qrec_detail.id as id',
    //   'qrec_detail.queue_record_id as queue_record_id',
    //   'qrec_detail.queue_name as queue_name',
    //   'qrec_detail.job_id as job_id',
    //   'qrec_detail.data as data',
    //   'qrec_detail.status as status',
    //   'qrec.id as qrec_id',
    //   'qrec.queue_key as qrec_queue_key',
    //   'qrec.execution_id as qrec_execution_id',
    //   'qrec.status as qrec_status',
    //   'qrec.data as qrec_data',
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
    // ).from("qrec_detail");
    // query = query.leftJoin('qrec').on({
    //   "qrec.id": "qrec_detail.queue_record_id"
    // });
    // query = query.leftJoin('exe').on({
    //   "qrec.execution_id": "exe.id"
    // });
    // query = query.orderBy("qrec_detail.id DESC");
    // query = query.limit(1);
    // query = query.where({
    //   "qrec_detail.id": props.id
    // })
    // let resData = await SqlService.selectOne(query.toString());

    // return {
    //   status: 'success',
    //   status_code: 200,
    //   return: resData
    // }
  },
  async getQueueRecordDetailDisplayProcess(props) {
    try {
      let id = props.id;
      delete props.id;
      let queryString = SmartUrlSearchParams(props).toString();
      let resData = await axios.get(BaseService.QUEUE_RECORD_DETAIL + '/' + id + "/display-process?" + queryString, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async deleteQueueRecordDetail(ids: Array<number>) {
    try {
      let _in: Array<any> | string = [
        ...ids
      ];
      _in = _in.join(',');
      let resData = await SqlService.delete(SqlBricks.delete('queue_record_details').where(SqlBricks.in("id", _in)).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getQueueIdsStatus(ids: Array<number>) {
    try {
      let query = SmartUrlSearchParams({
        ids: JSON.stringify(ids || [])
      });
      let resData = await axios.get(BaseService.QUEUE_RECORD_DETAIL + '/ids/status?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getDirectories(job_id: string) {
    try {
      let query = SmartUrlSearchParams({
        job_id
      });
      let resData = await axios.get(BaseService.QUEUE_RECORD_DETAIL + '/directories/' + job_id, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}