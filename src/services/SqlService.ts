import axios from 'axios';
import BaseService from './BaseService';

export default {
  selectOne: async (props: string):Promise<any> => {
    try {
      let resData = await axios.get(BaseService.SQL + '/select-one?sql=' + props, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  select: async (props: string):Promise<any> => {
    try {
      let resData = await axios.get(BaseService.SQL + '/select?sql=' + props, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  insert: async (props) => {
    try {
      let resData = await axios.post(BaseService.SQL + '/insert', {
        sql: props
      });
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  update: async (props) => {
    try {
      let resData = await axios.post(BaseService.SQL + '/update', {
        sql: props
      });
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  delete: async (props) => {
    try {
      let resData = await axios.post(BaseService.SQL + '/delete', {
        sql: props
      });
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}