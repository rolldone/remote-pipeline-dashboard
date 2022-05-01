import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import QueueService from "./core/QueueService";
import { QueueRecordInterface } from "./QueueRecordService";

export interface QueueRecordDetailInterface {
  id?: any
  queue_record_id?: number
  queue_name?: string
  job_id?: number
  data?: any
  status?: number
  limit?: number
  offset?: number

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
      let query = SqlBricks.insert("queue_record_details", {
        queue_record_id: props.queue_record_id,
        queue_name: props.queue_name,
        job_id: props.job_id,
        data: props.data,
        status: props.status,
      }).toString();
      let resDataId = await SqlService.insert(query);
      SqlBricks.aliasExpansions({
        'qrec_detail': "queue_record_details",
        'qrec': "queue_records",
      });
      // Get again
      let querySelect = SqlBricks.select(
        'qrec_detail.id as id',
        'qrec_detail.queue_record_id as queue_record_id',
        'qrec_detail.queue_name as queue_name',
        'qrec_detail.job_id as job_id',
        'qrec_detail.data as data',
        'qrec_detail.status as status',
        'qrec.id as qrec_id',
        'qrec.queue_key as qrec_queue_key',
        'qrec.execution_id as qrec_execution_id',
        'qrec.status as qrec_status',
        'qrec.data as qrec_data',
      ).from("qrec_detail");
      querySelect = querySelect.leftJoin('qrec').on({
        "qrec.id": "qrec_detail.queue_record_id"
      });
      querySelect = querySelect.orderBy("qrec_detail.id DESC");
      querySelect = querySelect.limit(1);
      querySelect = querySelect.where({
        "qrec_detail.id": resDataId
      })
      let resData = await SqlService.selectOne(querySelect.toString());

      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async updateQueueRecordDetail(props: QueueRecordDetailInterface) {
    try {
      let query = SqlBricks.update("queue_record_details", {
        queue_record_id: props.queue_record_id,
        queue_name: props.queue_name,
        job_id: props.job_id,
        data: props.data,
        status: props.status,
      }).where("id", props.id).toString();
      let resDataUpdate = await SqlService.update(query);
      SqlBricks.aliasExpansions({
        'qrec_detail': "queue_record_details",
        'qrec': "queue_records",
        'exe': "executions"
      });
      // Get again
      let querySelect = SqlBricks.select(
        'qrec_detail.id as id',
        'qrec_detail.queue_record_id as queue_record_id',
        'qrec_detail.queue_name as queue_name',
        'qrec_detail.job_id as job_id',
        'qrec_detail.data as data',
        'qrec_detail.status as status',
        'qrec.id as qrec_id',
        'qrec.queue_key as qrec_queue_key',
        'qrec.execution_id as qrec_execution_id',
        'qrec.status as qrec_status',
        'qrec.data as qrec_data',
      ).from("qrec_detail");
      querySelect = querySelect.leftJoin('qrec').on({
        "qrec.id": "qrec_detail.queue_record_id"
      });
      querySelect = querySelect.orderBy("qrec_detail.id DESC");
      querySelect = querySelect.limit(1);
      querySelect = querySelect.where({
        "qrec_detail.id": props.id
      })
      let resData = await SqlService.selectOne(querySelect.toString());

      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getQueueRecordDetails(props: QueueRecordDetailInterface) {
    try {
      SqlBricks.aliasExpansions({
        'qrec_detail': "queue_record_details",
        'qrec': "queue_records",
        'exe': "executions"
      });
      // Get again
      let query = SqlBricks.select(
        'qrec_detail.id as id',
        'qrec_detail.queue_record_id as queue_record_id',
        'qrec_detail.queue_name as queue_name',
        'qrec_detail.job_id as job_id',
        'qrec_detail.data as data',
        'qrec_detail.status as status',
        'qrec.id as qrec_id',
        'qrec.queue_key as qrec_queue_key',
        'qrec.execution_id as qrec_execution_id',
        'qrec.status as qrec_status',
        'qrec.data as qrec_data',
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
      ).from("qrec_detail");
      query = query.leftJoin('qrec').on({
        "qrec.id": "qrec_detail.queue_record_id"
      });
      query = query.leftJoin('exe').on({
        "qrec.execution_id": "exe.id"
      });
      if (props.queue_record_id != null) {
        query = query.where("qrec_detail.queue_record_id", props.queue_record_id);
      }
      if (props.limit != null) {
        query = query.limit(props.limit);
        if(props.offset != null){
          query = query.offset(props.offset * props.limit);
        }
      }

      query = query.orderBy("qrec_detail.id DESC");
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
  async getQueueRecordDetail(props: QueueRecordDetailInterface) {
    SqlBricks.aliasExpansions({
      'qrec_detail': "queue_record_details",
      'qrec': "queue_records",
      'exe': "executions"
    });
    // Get again
    let query = SqlBricks.select(
      'qrec_detail.id as id',
      'qrec_detail.queue_record_id as queue_record_id',
      'qrec_detail.queue_name as queue_name',
      'qrec_detail.job_id as job_id',
      'qrec_detail.data as data',
      'qrec_detail.status as status',
      'qrec.id as qrec_id',
      'qrec.queue_key as qrec_queue_key',
      'qrec.execution_id as qrec_execution_id',
      'qrec.status as qrec_status',
      'qrec.data as qrec_data',
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
    ).from("qrec_detail");
    query = query.leftJoin('qrec').on({
      "qrec.id": "qrec_detail.queue_record_id"
    });
    query = query.leftJoin('exe').on({
      "qrec.execution_id": "exe.id"
    });
    query = query.orderBy("qrec_detail.id DESC");
    query = query.limit(1);
    query = query.where({
      "qrec_detail.id": props.id
    })
    let resData = await SqlService.selectOne(query.toString());

    return {
      status: 'success',
      status_code: 200,
      return: resData
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
  }
}