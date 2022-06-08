import axios from "axios"
import SmartUrlSearchParams from "base/SmartUrlSearchParams"
import BaseService from "./BaseService"


export interface UserServiceInterface {
  id?: number
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  status?: number
  data?: any
  orderBy?: string
  groupBy?: string
  limit?: number
  offset?: number
}

export default {
  getUsers: async function (props: UserServiceInterface) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.USER + '/users?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  getUser: async function (props: UserServiceInterface) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.USER + '/' + props.id + "/view?" + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  getSelfUser: async function () {
    try {
      let resData = await axios.get(BaseService.USER + '/self', {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  addUser: async function (props: UserServiceInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        formData.append(key, props[key]);
      }
      let resData = await axios({
        method: "post",
        url: BaseService.USER + '/add',
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
  updateUser: async function (props: UserServiceInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        formData.append(key, props[key]);
      }
      let resData = await axios({
        method: "post",
        url: BaseService.USER + '/update',
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
  deleteUser: async function (ids: Array<number>) {
    try {

      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids || '[]'));
      let resData = await axios({
        method: "post",
        url: BaseService.USER + '/delete',
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
  updateOwnUser: async function (props: UserServiceInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        if (props[key] != null) {
          formData.append(key, props[key]);
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.USER + '/update/self',
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