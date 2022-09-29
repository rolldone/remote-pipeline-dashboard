import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import { QueueRecordInterface } from "./QueueRecordService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

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
    } catch (ex) {
      throw ex;
    }
  },
  async getQueueSchedules(props: QueueScheduleInterface) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.QUEUE_RECORD_SCHEDULE + '/queue-record-schedules?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getQueueSchedule(props: QueueScheduleInterface) {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.QUEUE_RECORD_SCHEDULE + '/' + id + '/view?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
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
    } catch (ex) {
      throw ex;
    }
  }
}