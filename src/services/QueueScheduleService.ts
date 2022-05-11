import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import QueueService from "./core/QueueService";
import { QueueRecordInterface } from "./QueueRecordService";
import BaseService from "./BaseService";
import axios from "axios";

export interface QueueScheduleInterface {
  id?: any
  queue_record_id?: any
  execution_id?: any
  schedule_type?: string
  data?: any
}

export interface QueueItemInterface {
  id?: any
  data?: any
  process_mode?: string
  host_id?: any
}

export default {
  async addQueueSchedule(props: QueueScheduleInterface) {
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
        url: BaseService.QUEUE_RECORD_SCHEDULE + '/add',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      // let query = SqlBricks.insert("queue_schedules", {
      //   queue_record_id: props.queue_record_id,
      //   execution_id: props.execution_id,
      //   schedule_type: props.schedule_type,
      //   data: JSON.stringify(props.data)
      // }).toString();
      // let resDataId = await SqlService.insert(query);
      // SqlBricks.aliasExpansions({
      //   'q_sch': "queue_schedules",
      //   'qrec': "queue_records",
      //   'exe': "executions",
      // });
      // // Get again
      // let querySelect = SqlBricks.select(
      //   'q_sch.id as id',
      //   'q_sch.queue_record_id as queue_record_id',
      //   'q_sch.execution_id as execution_id',
      //   'q_sch.schedule_type as schedule_type',
      //   'q_sch.data as data',
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
      // ).from("q_sch");
      // querySelect = querySelect.leftJoin('qrec').on({
      //   "qrec.id": "q_sch.queue_record_id"
      // });
      // querySelect = querySelect.leftJoin('exe').on({
      //   "exe.id": "q_sch.execution_id"
      // });
      // querySelect = querySelect.orderBy("q_sch.id DESC");
      // querySelect = querySelect.limit(1);
      // querySelect = querySelect.where({
      //   "q_sch.id": resDataId
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
  async updateQueueSchedule(props: QueueScheduleInterface) {
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
        url: BaseService.QUEUE_RECORD_SCHEDULE + '/update',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      // let query = SqlBricks.update("queue_schedules", {
      //   queue_record_id: props.queue_record_id,
      //   execution_id: props.execution_id,
      //   schedule_type: props.schedule_type,
      //   data: JSON.stringify(props.data)
      // }).where("id", props.id).toString();
      // let resDataUpdate = await SqlService.update(query);
      // SqlBricks.aliasExpansions({
      //   'q_sch': "queue_schedules",
      //   'qrec': "queue_records",
      //   'exe': "executions",
      // });
      // // Get again
      // let querySelect = SqlBricks.select(
      //   'q_sch.id as id',
      //   'q_sch.queue_record_id as queue_record_id',
      //   'q_sch.execution_id as execution_id',
      //   'q_sch.schedule_type as schedule_type',
      //   'q_sch.data as data',
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
      // ).from("q_sch");
      // querySelect = querySelect.leftJoin('qrec').on({
      //   "qrec.id": "q_sch.queue_record_id"
      // });
      // querySelect = querySelect.leftJoin('exe').on({
      //   "exe.id": "q_sch.execution_id"
      // });
      // querySelect = querySelect.orderBy("q_sch.id DESC");
      // querySelect = querySelect.limit(1);
      // querySelect = querySelect.where({
      //   "q_sch.id": props.id
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
  async getQueueSchedules(props: QueueScheduleInterface) {
    try {
      let query = new URLSearchParams(props as any);
      let resData = await axios.get(BaseService.QUEUE_RECORD_SCHEDULE + '/queue-record-schedules?' + query, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   'q_sch': "queue_schedules",
      //   'qrec': "queue_records",
      //   'exe': "executions",
      // });
      // // Get again
      // let query = SqlBricks.select(
      //   'q_sch.id as id',
      //   'q_sch.queue_record_id as queue_record_id',
      //   'q_sch.execution_id as execution_id',
      //   'q_sch.schedule_type as schedule_type',
      //   'q_sch.data as data',
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
      // ).from("q_sch");
      // query = query.leftJoin('qrec').on({
      //   "qrec.id": "q_sch.queue_record_id"
      // });
      // query = query.leftJoin('exe').on({
      //   "exe.id": "q_sch.execution_id"
      // });
      // query = query.orderBy("q_sch.id DESC");
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
  async getQueueSchedule(props: QueueScheduleInterface) {
    try {
      let id = props.id;
      delete props.id;
      let query = new URLSearchParams(props as any);
      let resData = await axios.get(BaseService.QUEUE_RECORD_SCHEDULE + '/' + id + '/view?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // SqlBricks.aliasExpansions({
    //   'q_sch': "queue_schedules",
    //   'qrec': "queue_records",
    //   'exe': "executions",
    // });
    // // Get again
    // let query = SqlBricks.select(
    //   'q_sch.id as id',
    //   'q_sch.queue_record_id as queue_record_id',
    //   'q_sch.execution_id as execution_id',
    //   'q_sch.schedule_type as schedule_type',
    //   'q_sch.data as data',
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
    // ).from("q_sch");
    // query = query.leftJoin('qrec').on({
    //   "qrec.id": "q_sch.queue_record_id"
    // });
    // query = query.leftJoin('exe').on({
    //   "exe.id": "q_sch.execution_id"
    // });
    // query = query.orderBy("q_sch.id DESC");
    // query = query.limit(1);
    // if (props.execution_id != null && props.queue_record_id != null) {
    //   query = query.where({
    //     "q_sch.execution_id": props.execution_id,
    //     "q_sch.queue_record_id": props.queue_record_id
    //   })
    // } else {
    //   query = query.where({
    //     "q_sch.id": props.id
    //   })
    // }
    // let resData = await SqlService.selectOne(query.toString());

    // return {
    //   status: 'success',
    //   status_code: 200,
    //   return: resData
    // }
  },
  async deleteQueueSchedule(ids: Array<number>) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids || '[]'));
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE_RECORD_SCHEDULE + '/delete',
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
      // let resData = await SqlService.delete(SqlBricks.delete('queue_schedules').where(SqlBricks.in("id", _in)).toString());
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