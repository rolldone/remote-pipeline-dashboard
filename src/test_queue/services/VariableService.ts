import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";
import BaseService from "services/BaseService";
import { getApiKey } from "./BaseService";

const VariableService = {
  async getVariableById(id: number): Promise<any> {
    try {
      let resData = await axios.get(BaseService.VARIABLE + '/' + id + "/view", { headers: { "Authorization": `Bearer ${await getApiKey()}` } });
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  // async uploadAsset(props: assetUpload) {
  //   try {
  //     let formData = new FormData();

  //     formData.append("id_variable", props.id_variable + "");
  //     formData.append("var_name", props.var_name);
  //     for (var a = 0; a < props.file_datas.length; a++) {
  //       if ((props.file_datas[a].file[0] instanceof Blob) == true) {
  //         formData.append("files[]", props.file_datas[a].file[0] as any);
  //       } else {
  //       }
  //     }
  //     let resData = await FileService.upload(formData);
  //     return {
  //       status: 'success',
  //       status_code: 200,
  //       return: resData
  //     }
  //   } catch (ex) {
  //     throw ex;
  //   }
  // },
}

export default VariableService;