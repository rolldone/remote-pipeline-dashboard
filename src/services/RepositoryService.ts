import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";
import BaseService from "./BaseService";

export interface RepositoryInterface {
  id?: number
  oauth_user_id: number,
  access_token?: string,
  owner?: string
  orgName?: string
  repo_name?: string
  from?: string
}

export default {
  async getRepositories(props: RepositoryInterface) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.REPOSITORY + '/repositories?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getRepository(props: RepositoryInterface) {
    try {
      let repo_name = props.repo_name;
      delete props.repo_name;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.REPOSITORY + `/${repo_name}/view?` + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  selectRepository(props: RepositoryInterface) {

  },
  async getBranchs(props: RepositoryInterface) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.REPOSITORY + '/branch/branchs?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getOwnerRepo(props: RepositoryInterface) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.REPOSITORY + '/owner?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getCommits(props: RepositoryInterface) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.REPOSITORY + '/commit/commits?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}