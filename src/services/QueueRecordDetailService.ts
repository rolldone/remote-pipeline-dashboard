import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import QueueService from "./core/QueueService";
import { QueueRecordInterface } from "./QueueRecordService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";
import GetQueryUrl from "base/GetQueryUrl";

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
  status: {
    RUNNING: 1,
    FAILED: 2,
    WAITING: 3,
    DELAYED: 4,
    COMPLETED: 5,
    STOPPED: 6
  },
  async deleteQueueDetails(ids: Array<number>) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids));
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE_RECORD_DETAIL + '/deletes',
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
    } catch (ex) {
      throw ex;
    }
  },
  async getQueueRecordDetails(props: QueueRecordDetailInterface) {
    try {
      let queryString = SmartUrlSearchParams(props).toString();
      let resData = await axios.get(BaseService.QUEUE_RECORD_DETAIL + '/queue-record-details?' + queryString, {});
      return resData.data;
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
  async getDirectories(share_key: string) {
    try {
      let parseQuery = GetQueryUrl();
      let query = SmartUrlSearchParams({
        share_key: parseQuery.share_key || null
      });
      let resData = await axios.get(BaseService.QUEUE_RECORD_DETAIL + '/display-data/directories?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async openFile(share_key: string, path: string) {
    try {
      let parseQuery = GetQueryUrl();
      let query = SmartUrlSearchParams({
        share_key: parseQuery.share_key || null
      });
      let resData = await axios.get(BaseService.QUEUE_RECORD_DETAIL + "/display-data/file?" + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async generateUrlDisplay(queue_record_detail_id: number) {
    try {
      let formData = new FormData();
      formData.append("queue_record_detail_id", queue_record_detail_id+"");
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE_RECORD_DETAIL + '/generate-url-display',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}