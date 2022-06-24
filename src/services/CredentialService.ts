import axios from "axios"
import SmartUrlSearchParams from "base/SmartUrlSearchParams"
import BaseService from "./BaseService"

export interface CredentialInterface {
  id?: number
  name?: string
  type?: string
  data?: any
  user_id?: number
  description?: string
}

const filterQuery = (props: CredentialServiceInterface) => {
  for (var key in props) {
    switch (key) {
      case 'types':
        props.types = JSON.stringify(props.types || '[]') as any;
        break;
      default:
        if (props[key] == null) {
          delete props[key];
        }
        break;
    }
  }
  return props;
}

export interface CredentialServiceInterface extends CredentialInterface {
  ids?: Array<number>
  types?: Array<string>
}

const CredentialService = {
  async addCredential(props: CredentialInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'data':
            formData.append(key, JSON.stringify(props[key] || '[]'));
            break;
          default:
            formData.append(key, props[key] || "");
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.CREDENTIAL + '/add',
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
  async updateCredential(props: CredentialInterface) {
    try {
      let formData = new FormData();
      for (var key in props) {
        switch (key) {
          case 'data':
            formData.append(key, JSON.stringify(props[key] || '[]'));
            break;
          default:
            formData.append(key, props[key] || "");
            break;
        }
      }
      let resData = await axios({
        method: "post",
        url: BaseService.CREDENTIAL + '/update',
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
  async getCredentials(props: CredentialServiceInterface) {
    try {
      props = filterQuery(props);
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.CREDENTIAL + '?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async getCredential(props: CredentialServiceInterface) {
    try {
      let id = props.id;
      delete props.id;
      let query = SmartUrlSearchParams(props);
      let resData = await axios.get(BaseService.CREDENTIAL + '/' + id + '/view?' + query, {});
      return resData.data;
    } catch (ex) {
      throw ex;
    }
  },
  async deleteCredentialByIds(ids: Array<number>, force_deleted?: boolean) {
    try {
      let formData = new FormData();
      formData.append("ids", JSON.stringify(ids || '[]'));
      formData.append("force_deleted", force_deleted || false as any);
      let resData = await axios({
        method: "post",
        url: BaseService.CREDENTIAL + '/delete',
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

export default CredentialService;

