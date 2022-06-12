import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

export interface OAuthInterface {
  id?: number
  name?: string
  user_id?: number
  oauth_id?: string
  access_token?: string
  repo_from?: string
  token_type?: string
  scope?: string
  data?: any
  refresh_token?: string
}

export interface OAuthServiceInterface extends OAuthInterface {
  ids?: Array<number>
  force_deleted?: boolean
}

export default {
  async addOAuth(props: OAuthInterface): Promise<any> {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'repo_data':
            formData.append(key, JSON.stringify(props[key] || {}));
            break;
          default:
            if (props[key] != null) {
              formData.append(key, props[key]);
            }
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.OAUTH_USER + '/add',
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
  async updateOAuth(props): Promise<any> {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'repo_data':
            formData.append(key, JSON.stringify(props[key] || {}));
            break;
          default:
            if (props[key] != null) {
              formData.append(key, props[key]);
            }
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.OAUTH_USER + '/update',
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
  async getOAuth(props: OAuthInterface): Promise<any> {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.OAUTH_USER + '/' + props.id + "/view?" + query, {});
      return resData.data;
      // let resData = await SqlService.selectOne(SqlBricks.select("*").from("oauth-users").where("id", props.id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async getOAuths(props): Promise<any> {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.OAUTH_USER + '/oauth-users?' + query, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   'pro': "projects",
      //   "pip": "oauth-users"
      // });
      // let query = SqlBricks.select(
      //   "pip.id as id",
      //   "pip.name as name",
      //   "pro.id as pro_id",
      //   "pro.name as pro_name"
      // ).from("pip");
      // query = query.leftJoin("pro").on("pro.id", "pip.project_id");
      // if (props.project_id != null) {
      //   query = query.where("pro.id", props.project_id);
      // }
      // query = query.orderBy("pip.id DESC");
      // let resData = await SqlService.select(query.toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  deleteOAuths: async function (props: OAuthServiceInterface) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(props.ids || '[]'));
      formData.append("force_deleted", props.force_deleted as any || false);
      let resData = await axios({
        method: "post",
        url: BaseService.OAUTH_USER + '/delete',
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