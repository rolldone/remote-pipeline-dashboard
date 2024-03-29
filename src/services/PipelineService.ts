import SqlBricks from "./SqlBricks";
import SqlService from "./core/SqlService";
import BaseService from "./BaseService";
import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";
import { PipelinesInterface } from "pipeline/Pipelines";
import { PipelineItemInterface, PipelineItemServiceInterface } from "./PipelineItemService";
import YAML from 'json-to-pretty-yaml';
import { PipelineTaskServiceInterface } from "./PipelineTaskService";

export interface PipelineInterface {
  id?: number
  name?: string
  description?: string
  project_id?: number
  connection_type?: string
  oauth_user_id?: number
  repo_data?: any
  repo_name?: string
  repo_id?: number
  source_type?: string
  from_provider?: string
}

export interface PipelineServiceInterface extends PipelineInterface {
  ids?: Array<number>
  force_deleted?: boolean

  pipeline_tasks?: Array<PipelineTaskServiceInterface>
  pipeline_items?: Array<PipelineItemServiceInterface>
}

export default {
  async addPipeline(props: PipelineInterface): Promise<any> {
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
        url: BaseService.PIPELINE + '/add',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;

      // let id = await SqlService.insert(SqlBricks.insert('pipelines', {
      //   name: props.name,
      //   description: props.description,
      //   project_id: props.project_id
      // }).toString());
      // let resData = await SqlService.selectOne(SqlBricks.select("*").from("pipelines").where("id", id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async updatePipeline(props: PipelineInterface): Promise<any> {
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
        url: BaseService.PIPELINE + '/update',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      return resData.data;
      // let resData = await SqlService.update(SqlBricks.update('pipelines', {
      //   name: props.name,
      //   description: props.description,
      //   project_id: props.project_id
      // }).where("id", props.id).toString());
      // resData = await SqlService.selectOne(SqlBricks.select("*").from("pipelines").where("id", props.id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async getPipeline(props: PipelineInterface): Promise<any> {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE + '/' + props.id + "/view?" + query, {});
      return resData.data;
      // let resData = await SqlService.selectOne(SqlBricks.select("*").from("pipelines").where("id", props.id).toString());
      // return {
      //   status: 'success',
      //   status_code: 200,
      //   return: resData
      // }
    } catch (ex) {
      throw ex;
    }
  },
  async getPipelines(props): Promise<any> {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE + '/pipelines?' + query, {});
      return resData.data;
      // SqlBricks.aliasExpansions({
      //   'pro': "projects",
      //   "pip": "pipelines"
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
  deletePipelines: async function (props: PipelineServiceInterface) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(props.ids || '[]'));
      formData.append("force_deleted", props.force_deleted as any || false);
      let resData = await axios({
        method: "post",
        url: BaseService.PIPELINE + '/delete',
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
  downloadPipelineItems: async function (pipelineItems: Array<PipelineItemInterface>) {
    try {
      const data = YAML.stringify(pipelineItems);
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
      element.setAttribute('download', "pipeline_item.yaml");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (ex) {
      throw ex;
    }
  }
}