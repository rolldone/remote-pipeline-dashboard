import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
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
  exe_variable_id?: number
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
  },
  async getQueueRecords(props: QueueRecordServiceInterface) {
    try {
      let query = new URLSearchParams(props as any);
      let resData = await axios.get(BaseService.QUEUE_RECORD + '/queue-records?' + query, {});
      return resData.data;
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