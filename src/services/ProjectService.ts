import localStorageDB from "localstoragedb"
import SqlService from "./SqlService";
import SqlDialect from "./js/SqlDialect";
export default {
  async addProject(props): Promise<any> {
    try {
      let id = await SqlService.insert(SqlDialect.insert('projects', {
        name: props.name,
        description: props.description
      }).toString());
      let resData = await SqlService.selectOne(SqlDialect.select().from("projects").where("id", id).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async updateProject(props): Promise<any> {
    try {
      let res = await SqlService.update(SqlDialect.update('projects', {
        name: props.name,
        description: props.description
      }).where("id", props.id).toString());
      let resData = await SqlService.selectOne(SqlDialect.select().from("projects").where("id", props.id).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getProject(props): Promise<any> {
    try {
      let resData = await SqlService.selectOne(SqlDialect.select().from("projects").where("id", props.id).toString());
      return {
        status: 'success',
        status_code: 200,
        return: resData
      }
    } catch (ex) {
      throw ex;
    }
  },
  async getProjects(props): Promise<any> {
    try {
      let resData = await SqlService.select(SqlDialect.select("*").from("projects").orderBy("id DESC").toString());
      // console.log(gg.select("*").from("projects").orderBy("id","DESC").toSQL().toNative().sql);
      // debugger;
      // let resData = await SqlService.select(gg.select("*").from("projects").orderBy("id","DESC").toSQL().toNative().sql)
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