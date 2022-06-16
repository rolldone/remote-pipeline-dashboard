import axios from 'axios';
import BaseService from '../BaseService';

export default {
  deleteItem: async (props: FormData): Promise<any> => {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.QUEUE + '/delete-item',
        data: props,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
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
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  queues: async (props: string): Promise<any> => {
    try {
      let resData = await axios.get(BaseService.QUEUE + '/queues?' + props, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  queue: async (id: number): Promise<any> => {
    try {
      let resData = await axios.get(BaseService.QUEUE + '/' + id + '/view', {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
}