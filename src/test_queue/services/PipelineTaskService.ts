import axios from "axios";
import BaseService, { getApiKey } from "./BaseService";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";

export interface PipelineTaskInterface {
  id?: number
  project_id?: number
  pipeline_id?: number
  pipeline_item_id?: number
  type?: string
  description?: string
  name?: string
  order_number?: number
  temp_id?: string
  is_active?: boolean | number
  data?: {
    parent_condition_type?: string
    condition_values?: string
    command?: string
  },
}

export interface PipelineTaskServiceInterface extends PipelineTaskInterface {
  pipeline_item_ids?: Array<number>
  parent_order_temp_ids?: Array<string>
  order_by?: string

  token?: string
}

export default {
  async deletePipelineTaskByPipelineItemId(pipeline_item_id: number) {
    try {
      let formData = new FormData();
      formData.append("pipeline_item_id", pipeline_item_id + "");
      let resData = await axios({
        method: "post",
        url: BaseService.PIPELINE_TASK + '/delete-by-pipeline',
        data: formData,
        headers: { "Authorization": `Bearer ${await getApiKey()}` }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async addPipelineTasks(props: Array<PipelineTaskInterface>) {
    try {
      let _command_data = JSON.stringify(props);
      let formData = new FormData();
      formData.append("command_datas", _command_data);
      let resData = await axios({
        method: "post",
        url: BaseService.PIPELINE_TASK + '/add',
        data: formData,
        headers: { "Authorization": `Bearer ${await getApiKey()}` }
      })
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getPipelineTasks(props: PipelineTaskServiceInterface) {
    try {
      for (var key in props) {
        switch (key) {
          case 'pipeline_item_ids':
            props.pipeline_item_ids = JSON.stringify(props.pipeline_item_ids || []) as any;
            break;
          default:
            break;
        }
      }
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE_TASK + '/pipeline-tasks?' + query, { headers: { "Authorization": `Bearer ${await getApiKey()}` } });
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getPipelineTask(props: PipelineTaskServiceInterface) {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.PIPELINE_TASK + '/' + id + "/view?" + query, { headers: { "Authorization": `Bearer ${await getApiKey()}` } });
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}