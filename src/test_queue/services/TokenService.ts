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
  async getTokenByKey(tokenKey: string) {
    try {
      let resData = await axios.get(BaseService.TOKEN + '/check/' + tokenKey, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
}