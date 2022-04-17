import axios from 'axios';
import BaseService from './BaseService';

export default {
  upload: async (props: FormData): Promise<any> => {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.FILE + '/add',
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
        url: BaseService.FILE + '/delete',
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
  move: async (props: FormData): Promise<any> => {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.FILE + '/move',
        data: props,
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