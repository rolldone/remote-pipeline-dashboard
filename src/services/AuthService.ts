import axios from "axios";
import BaseService from "./BaseService";

export default {
  async oauthGeneate(props) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.AUTH + '/login/oauth/generate',
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
  },
  async registerExpiredCheck() {
    try {
      let resData = await axios.get(BaseService.AUTH + '/register-expired-check', {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async requestPin(share_key: string, email: string) {
    try {
      let formData = new FormData();
      formData.append("share_key", share_key);
      formData.append("email", email);
      let resData = await axios({
        method: "post",
        url: BaseService.AUTH + '/request-pin',
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
  async loginPagePublisher(props) {
    try {
      let formData = new FormData();
      formData.append("email", props.email);
      formData.append("share_key", props.share_key);
      formData.append("pin_code", props.pin_code);
      let resData = await axios({
        method: "post",
        url: BaseService.AUTH + '/login-page-publisher',
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