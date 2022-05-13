import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";
import BaseService from "./BaseService";

export default {
  async getRepositories(props) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.REPOSITORY + '/repositories?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getRepository(props) {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.REPOSITORY + `/${id}/view?` + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  selectRepository(props) {

  }
}