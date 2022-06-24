import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

export interface Host {
  id?: number,
  name?: string,
  description?: string,
  data?: Array<any>
  auth_type?: string
  password?: string
  username?: string
  private_key?: string
  credential_id?: number
}

export interface HostServiceInterface extends Host {
  ids?: Array<number>
  force_deleted?: boolean
}

export default {
  async getHosts(props: any): Promise<any> {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.HOST + '/hosts?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // SqlBricks.aliasExpansions({
    //   'usr': "users",
    //   'hos': "hosts"
    // });
    // let query = SqlBricks.select(
    //   'usr.id as usr_id',
    //   'usr.first_name as usr_first_name',
    //   'usr.last_name as usr_last_name',
    //   'hos.id as id',
    //   'hos.name as name',
    //   'hos.data as data',
    //   'hos.description as description',
    //   'hos.username as username',
    //   'hos.password as password',
    //   'hos.auth_type as auth_type',
    //   'hos.private_key as private_key'
    // ).from("hos");
    // query = query.leftJoin('usr').on({
    //   "usr.id": "hos.user_id"
    // });
    // if (props.user_id != null) {
    //   query = query.where("usr.id", props.user_id);
    // }
    // query = query.orderBy("usr.id DESC");
    // let resData = await SqlService.select(query.toString());
    // return {
    //   status: 'success',
    //   status_code: 200,
    //   return: resData
    // }
  },
  async getHost(props: any): Promise<any> {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.HOST + '/' + id + '/view?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // SqlBricks.aliasExpansions({
    //   'usr': "users",
    //   'hos': "hosts"
    // });
    // let query = SqlBricks.select(
    //   'usr.id as usr_id',
    //   'usr.first_name as usr_first_name',
    //   'usr.last_name as usr_last_name',
    //   'hos.id as id',
    //   'hos.name as name',
    //   'hos.data as data',
    //   'hos.description as description',
    //   'hos.username as username',
    //   'hos.password as password',
    //   'hos.auth_type as auth_type',
    //   'hos.private_key as private_key'
    // ).from("hos");
    // query = query.leftJoin('usr').on({
    //   "usr.id": "hos.user_id"
    // });
    // if (props.user_id != null) {
    //   query = query.where("usr.id", props.user_id);
    // }
    // query = query.where("hos.id", props.id);
    // query = query.orderBy("usr.id DESC");
    // query = query.limit(1);
    // let resData = await SqlService.selectOne(query.toString());
    // return {
    //   status: 'success',
    //   status_code: 200,
    //   return: resData
    // }
  },
  async addHost(props: Host): Promise<any> {
    try {
      let formData = new FormData();
      for (var key in props) {
        if (props[key] != null) {
          formData.append(key, props[key]);
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.HOST + '/add',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // let resData = await SqlService.insert(SqlBricks.insert('hosts', {
    //   name: props.name,
    //   description: props.description,
    //   data: props.data,
    //   auth_type: props.auth_type,
    //   private_key: props.private_key,
    //   username: props.username,
    //   password: props.password
    // }).toString());
    // resData = await SqlService.selectOne(SqlBricks.select("*").from("hosts").where("id", resData).toString());
    // return {
    //   status: 'success',
    //   status_code: 200,
    //   return: resData
    // }
  },
  async updateHost(props: Host): Promise<any> {
    try {
      let formData = new FormData();
      for (var key in props) {
        if (props[key] != null) {
          formData.append(key, props[key]);
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.HOST + '/update',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // let resData = await SqlService.update(SqlBricks.update('hosts', {
    //   name: props.name,
    //   description: props.description,
    //   data: JSON.stringify(props.data),
    //   auth_type: props.auth_type,
    //   private_key: props.private_key,
    //   username: props.username,
    //   password: props.password
    // }).where("id", props.id).toString());
    // resData = await SqlService.selectOne(SqlBricks.select("*").from("hosts").where("id", props.id).toString());
    // return {
    //   status: 'success',
    //   status_code: 200,
    //   return: resData
    // }
  },
  async deleteHost(props: HostServiceInterface): Promise<any> {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(props.ids || '[]'));
      formData.append("force_deleted", props.force_deleted || false as any);
      let resData = await axios({
        method: "post",
        url: BaseService.HOST + '/delete',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
    // try {
    //   let _in: Array<any> | string = [
    //     ...ids
    //   ];
    //   _in = _in.join(',');
    //   let resData = await SqlService.delete(SqlBricks.delete('hosts').where(SqlBricks.in("id", _in)).toString());
    //   return {
    //     status: 'success',
    //     status_code: 200,
    //     return: resData
    //   }
    // } catch (ex) {
    //   throw ex;
    // }
  }
}