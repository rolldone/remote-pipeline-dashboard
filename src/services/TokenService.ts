import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";
import BaseService from "./BaseService";

export interface TokenInterface {
  id?: number
  name?: string
  encrypt_token?: string
  secret_key?: string
  api_key?: string
  user_id?: number
  expired_date?: string
  status?: number
  description?: string
}

export interface TokenServiceInterface extends TokenInterface {

}

export default {
  async getTokens(props: TokenServiceInterface) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.TOKEN + '/?' + query.toString(), {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getToken(props: TokenServiceInterface) {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.TOKEN + '/' + id + "/view?" + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async addToken(props: TokenInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        if (props[key] == null) {
          delete props[key];
        }
      }
      for (var key in props) {
        switch (key) {
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.TOKEN + '/add',
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
  async updateToken(props: TokenInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        if (props[key] == null) {
          delete props[key];
        }
      }
      for (var key in props) {
        switch (key) {
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.TOKEN + '/update',
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
  async deleteTokens(ids: Array<number>) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids || '[]'));
      let resData = await axios({
        method: "post",
        url: BaseService.TOKEN + '/delete',
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
}