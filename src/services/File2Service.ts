import axios from "axios";
import SmartUrlSearchParams from "base/SmartUrlSearchParams";
import BaseService from "./BaseService";

export default {
  async add(props) {
    try {
      let formData = new FormData();
      for (var key in props) {
        if (props[key] != null) {
          formData.append(key, props[key]);
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.FILE2 + '/put',
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
  async mkdir(props: {
    name: string
    path: string
  }) {
    try {
      let formData = new FormData();
      for (var key in props) {
        if (props[key] != null) {
          formData.append(key, props[key]);
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.FILE2 + '/mkdir',
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
  async delete(from: string) {
    try {
      let formData = new FormData();
      formData.append("from", from);
      let resData = await axios({
        method: "post",
        url: BaseService.FILE2 + '/delete',
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
  async deleteByIds(ids: Array<number>) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids));
      let resData = await axios({
        method: "post",
        url: BaseService.FILE2 + '/delete-by-ids',
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
  async getFiles(props) {
    try {
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.FILE2 + '/files?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getFile(props) {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.FILE2 + '/' + id + '/view?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getFileById(id: number) {
    try {
      let query = SmartUrlSearchParams({});
      let resData = await axios.get(BaseService.FILE2 + '/' + id + '/view?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async moveByIds(ids: Array<number>, to: string) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids));
      formData.append("to", to);
      let resData = await axios({
        method: "post",
        url: BaseService.FILE2 + '/move',
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
  async copyByIds(ids: Array<number>, to: string) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids));
      formData.append("to", to);
      let resData = await axios({
        method: "post",
        url: BaseService.FILE2 + '/copy',
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
  async duplicateByIds(ids: Array<number>) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids));
      let resData = await axios({
        method: "post",
        url: BaseService.FILE2 + '/duplicate',
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
  async renameById(newname: string, id: number) {
    try {
      let formData = new FormData();
      formData.append("name", newname);
      formData.append("id", id + "");
      let resData = await axios({
        method: "post",
        url: BaseService.FILE2 + '/rename',
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