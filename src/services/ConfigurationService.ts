import axios from "axios";
import BaseService from "./BaseService";

export default {
  async getConfiguration() {
    try {
      let resData = await axios.get(BaseService.CONFIGURATION, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}