import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";
import BaseService, { getApiKey } from "./BaseService";
import { PipelineTaskServiceInterface } from "./PipelineTaskService";

const GuestService = {
  async getPipelineTasks(tokenData: string, props: PipelineTaskServiceInterface) {
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
      props.token = tokenData;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.GUEST + '/pipeline-task/pipeline-tasks?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getQueueRecordDetailDisplayProcess(tokenData: string, props) {
    try {
      props.token = tokenData;
      let queryString = SmartUrlSearchParams(props).toString();
      let resData = await axios.get(BaseService.GUEST + '/queue-record-detail/display-process?' + queryString, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
}

export default GuestService;