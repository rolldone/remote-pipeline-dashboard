import axios from "axios"
import BaseService from "./BaseService"

export interface PagePublisher {
  id?: number
  page_name?: string
  table_id?: string
  user_id?: number
  share_mode?: string
  privileges?: any
  data?: any
  deleted_at?: string
  created_at?: string
  updated_at?: string

  users?: Array<string>
}

export interface PagePublisherService extends PagePublisher {

}

const PagePubsliherService = {
  async getPublisherByPageNameTableId(page_name: string, table_id: number) {
    try {
      let resData = await axios.get(BaseService.PAGE_PUBLISHER + `/${page_name}/${table_id}/view`, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async addPublisher(props: PagePublisher) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'users':
            formData.append(key, JSON.stringify(props[key]));
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
        url: BaseService.PAGE_PUBLISHER + '/add',
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
  async updatePublisher(props: PagePublisher) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'users':
            formData.append(key, JSON.stringify(props[key]));
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
        url: BaseService.PAGE_PUBLISHER + '/update',
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

export default PagePubsliherService;