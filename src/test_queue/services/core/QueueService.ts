import axios from 'axios';
import BaseService, { getApiKey } from '../BaseService';


export interface OutSideQueueInterface {
  data: any
  process_mode: string
  process_limit: string
  delay: number
}

const QueueService = {
  deleteItem: async (props: FormData): Promise<any> => {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE + '/delete-item',
        data: props,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
          "Authorization": `Bearer ${await getApiKey()}`
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  createItem: async (props: FormData): Promise<any> => {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE + '/create-item',
        data: props,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
          "Authorization": `Bearer ${await getApiKey()}`
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  create: async (props: FormData): Promise<any> => {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE + '/create',
        data: props,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
          "Authorization": `Bearer ${await getApiKey()}`
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },

  async createByExistKey(queue_key: string, props: OutSideQueueInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        if (props[key] != null) {
          switch (key) {
            case 'data':
              formData.append(key, JSON.stringify(props[key] || {}));
              break;
            default:
              formData.append(key, props[key]);
              break;
          }
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE + "/create/" + queue_key,
        data: formData,
        headers: {
          "Authorization": `Bearer ${await getApiKey()}`
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  update: async (props: FormData): Promise<any> => {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE + '/update',
        data: props,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
          "Authorization": `Bearer ${await getApiKey()}`
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  delete: async (props: FormData): Promise<any> => {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE + '/delete',
        data: props,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
          "Authorization": `Bearer ${await getApiKey()}`
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  stopWorker: async (props: FormData): Promise<any> => {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE + '/stop-worker',
        data: props,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
          "Authorization": `Bearer ${await getApiKey()}`
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  deleteQueueScheduler: async (props: FormData): Promise<any> => {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE + '/delete-scheduler',
        data: props,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
          "Authorization": `Bearer ${await getApiKey()}`
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  queues: async (props: string): Promise<any> => {
    try {
      let resData = await axios.get(BaseService.QUEUE + '/queues?' + props, { headers: { "Authorization": `Bearer ${await getApiKey()}` } });
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  queue: async (id: number): Promise<any> => {
    try {
      let resData = await axios.get(BaseService.QUEUE + '/' + id + '/view', { headers: { "Authorization": `Bearer ${await getApiKey()}` } });
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}
export default QueueService;