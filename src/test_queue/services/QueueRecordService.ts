import axios from 'axios';
import BaseService, { getApiKey } from './BaseService';

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

const QueueRecordService = {
  getByQueueKey: async (queue_key: string): Promise<any> => {
    try {
      let resData = await axios.get(BaseService.QUEUE_RECORD + "/key/" + queue_key + "/view", { headers: { "Authorization": `Bearer ${await getApiKey()}` } });
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}

export default QueueRecordService;