import axios from "axios";
import BaseService from "./BaseService";

export default {
  async forgotPassword(props) {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.AUTH + '/forgot-password',
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
  async registerService(props) {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.AUTH + '/register',
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
  async loginService(props) {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.AUTH + '/login',
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
  async logoutService(props) {
    try {
      let resData = await axios({
        method: "post",
        url: BaseService.AUTH + '/logout',
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
  async getUser(props) {
    try {
      let resData = await axios.get(BaseService.AUTH + '/user', {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}