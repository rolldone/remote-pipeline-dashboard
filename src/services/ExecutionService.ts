import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

const EXECUTION_TYPE = {
  GROUP: 'group',
  SINGLE: 'single'
}
export interface ExecutionInterface {
  id?: number
  name?: string
  process_mode?: string
  process_limit?: number
  pipeline_id?: number
  project_id?: number
  parent_id?: number
  user_id?: number
  variable_id?: number
  variable_option?: string
  pipeline_item_ids?: Array<number>
  host_ids?: Array<number>
  description?: string
  access_host_type?: string
  branch?: string
  mode?: string
  delay?: number,
  child_execution_datas?: Array<ExecutionInterface>


  execution_type?: string
  parent_temp_id?: string
  temp_id?: string
}

export interface ExecutionServiceInterface extends ExecutionInterface {
  index?: number
  hosts?: Array<any>
  pipeline_items?: Array<any>
  ids?: Array<number>
  force_deleted?: boolean
}

export default {
  EXECUTION_TYPE,
  async addExecution(props: ExecutionServiceInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'host_ids':
          case 'pipeline_item_ids':
          case 'child_execution_datas':
            formData.append(key, JSON.stringify(props[key] || '[]'));
            break;
          default:
            if (props[key] != null && props[key] != "") {
              formData.append(key, props[key]);
            }
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.EXECUTION + '/add',
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
  async updateExecution(props: ExecutionServiceInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'pipeline_item_ids':
          case 'host_ids':
          case 'child_execution_datas':
            formData.append(key, JSON.stringify(props[key] || '[]'));
            break;
          default:
            if (props[key] != null && props[key] != "") {
              formData.append(key, props[key]);
            }
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.EXECUTION + '/update',
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
  deleteExecution: async function (props: ExecutionServiceInterface) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(props.ids || '[]'));
      formData.append("force_deleted", props.force_deleted as any || false);
      let resData = await axios({
        method: "post",
        url: BaseService.EXECUTION + '/delete',
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
  async getExecutions(props: ExecutionServiceInterface) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.EXECUTION + '/executions?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getExecution(props: any) {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.EXECUTION + '/' + id + '/view?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async runExecution(props) {
    try {
      let formData = new FormData();
      formData.append("id", props.id);
      let resData = await axios({
        method: "post",
        url: BaseService.EXECUTION + '/run',
        data: formData,
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