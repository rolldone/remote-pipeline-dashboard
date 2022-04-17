import SqlBricks from "./SqlBricks";
import SqlService from "./SqlService";

export interface Host {
  id?: number,
  name?: string,
  description?: string,
  data?: Array<any>
  auth_type?: string
  password?: string
  username?: string
  private_key?: string
}

export default {
  async getHosts(props: any): Promise<any> {
    SqlBricks.aliasExpansions({
      'usr': "users",
      'hos': "hosts"
    });
    let query = SqlBricks.select(
      'usr.id as usr_id',
      'usr.first_name as usr_first_name',
      'usr.last_name as usr_last_name',
      'hos.id as id',
      'hos.name as name',
      'hos.data as data',
      'hos.description as description',
      'hos.username as username',
      'hos.password as password',
      'hos.auth_type as auth_type',
      'hos.private_key as private_key'
    ).from("hos");
    query = query.leftJoin('usr').on({
      "usr.id": "hos.user_id"
    });
    if (props.user_id != null) {
      query = query.where("usr.id", props.user_id);
    }
    query = query.orderBy("usr.id DESC");
    let resData = await SqlService.select(query.toString());
    return {
      status: 'success',
      status_code: 200,
      return: resData
    }
  },
  async getHost(props: any): Promise<any> {
    SqlBricks.aliasExpansions({
      'usr': "users",
      'hos': "hosts"
    });
    let query = SqlBricks.select(
      'usr.id as usr_id',
      'usr.first_name as usr_first_name',
      'usr.last_name as usr_last_name',
      'hos.id as id',
      'hos.name as name',
      'hos.data as data',
      'hos.description as description',
      'hos.username as username',
      'hos.password as password',
      'hos.auth_type as auth_type',
      'hos.private_key as private_key'
    ).from("hos");
    query = query.leftJoin('usr').on({
      "usr.id": "hos.user_id"
    });
    if (props.user_id != null) {
      query = query.where("usr.id", props.user_id);
    }
    query = query.where("hos.id", props.id);
    query = query.orderBy("usr.id DESC");
    query = query.limit(1);
    let resData = await SqlService.selectOne(query.toString());
    return {
      status: 'success',
      status_code: 200,
      return: resData
    }
  },
  async addHost(props: Host): Promise<any> {
    let resData = await SqlService.insert(SqlBricks.insert('hosts', {
      name: props.name,
      description: props.description,
      data: props.data,
      auth_type: props.auth_type,
      private_key: props.private_key,
      username: props.username,
      password: props.password
    }).toString());
    resData = await SqlService.selectOne(SqlBricks.select("*").from("hosts").where("id", resData).toString());
    return {
      status: 'success',
      status_code: 200,
      return: resData
    }
  },
  async updateHost(props: Host): Promise<any> {
    let resData = await SqlService.update(SqlBricks.update('hosts', {
      name: props.name,
      description: props.description,
      data: JSON.stringify(props.data),
      auth_type: props.auth_type,
      private_key: props.private_key,
      username: props.username,
      password: props.password
    }).where("id", props.id).toString());
    resData = await SqlService.selectOne(SqlBricks.select("*").from("hosts").where("id", props.id).toString());
    return {
      status: 'success',
      status_code: 200,
      return: resData
    }
  },
  async deleteHost(ids: Array<number>): Promise<any> {
    try {
      let _in: Array<any> | string = [
        ...ids
      ];
      _in = _in.join(',');
      let resData = await SqlService.delete(SqlBricks.delete('hosts').where(SqlBricks.in("id", _in)).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  }
}