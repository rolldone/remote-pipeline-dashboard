import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";
import BaseService from "./BaseService";

export interface SubmitWebhookTestInterface {
  webhook_id?: number
  key?: string
  type?: string
  data?: object
}

export default {
  async getWebHooks(props) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.WEBHOOK + '/webhooks?' + query.toString(), {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getWebHook(props) {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.WEBHOOK + '/' + id + "/view?" + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async addWebHook(props) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'webhook_datas':
            formData.append(key, JSON.stringify(props[key] || []));
            break;
          case 'data':
            formData.append(key, JSON.stringify(props[key] || {}));
            break;
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.WEBHOOK + '/add',
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
  async updateWebHook(props) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'webhook_datas':
            formData.append(key, JSON.stringify(props[key] || []));
            break;
          case 'data':
            formData.append(key, JSON.stringify(props[key] || {}));
            break;
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.WEBHOOK + '/update',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      })
      // If on webhook datas any image or files need to upload
      // for (let a = 0; a < props.data.length; a++) {
      //   let tabs = props.data[a];
      //   for (let b = 0; b < tabs.datas.length; b++) {
      //     let _data = tabs.datas[b];
      //     if (_data.attachment_datas != null) {
      //       for (let c = 0; c < _data.attachment_datas.length; c++) {
      //         let _item = _data.attachment_datas[c];
      //         let _formData = new FormData();
      //         _formData.append("from_path", _item.file[0].path);
      //         _formData.append("to_path", "./storage/app/variables/" + props.id + "/" + _item.file[0].name)
      //         let resMove = await FileService.move(_formData);
      //       }
      //     }
      //     if (_data.attachment_datas_deleted != null) {
      //       for (let c = 0; c < _data.attachment_datas_deleted.length; c++) {
      //         let _item = _data.attachment_datas_deleted[c];
      //         let _formData = new FormData();
      //         _formData.append("delete_path", "./storage/app/variables/" + props.id + "/" + _item.file[0].name)
      //         let resDelete = await FileService.delete(_formData);
      //       }
      //     }
      //   }
      // }
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async deleteWebHooks(ids: Array<number>) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids || '[]'));
      let resData = await axios({
        method: "post",
        url: BaseService.WEBHOOK + '/delete',
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
  async executeItemTest(props: SubmitWebhookTestInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'data':
            formData.append(key, JSON.stringify(props.data));
            break;
          default:
            formData.append(key, props[key]);
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.WEBHOOK + '/execute/test-item',
        data: formData,
        headers: {
          // 'Content-Type': `multipart/form-data;`,
        }
      });
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async execute(props) {
    try {
      let formData = new FormData();
      formData.append("key", props.key);
      let resData = await axios({
        method: "post",
        url: BaseService.WEBHOOK + '/execute',
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