import axios from "axios";
import BaseService from "./BaseService";

export interface VariableItemInterface {
  id?: number
  variable_id?: number
  name?: string
  datas?: Array<any>
  is_active?: boolean | number
  deleted_at?: string
  created_at?: string
  updated_at?: string
  is_permanent?: boolean | number
}

export default {
  async addVariableItem(props?: VariableItemInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'datas':
          case 'schema':
          case 'deleted_ids':
          case 'var_schema':
            formData.append(key, JSON.stringify(props[key] || []));
            break;
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.VARIABLE_ITEM + '/add',
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
  updateVariableItem(props?: VariableItemInterface) {

  },
  deleteVariableItems(ids: Array<number>) {

  },
  getVariableItems(props) {

  },
  async getVariableItemById(id: number) {
    try {
      let resData = await axios.get(BaseService.VARIABLE + '/' + id + "/view", {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getRenderVariableItemById(id: number) {
    try {
      let resData = await axios.get(BaseService.VARIABLE_ITEM + '/' + id + "/view?action=render", {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  }
}