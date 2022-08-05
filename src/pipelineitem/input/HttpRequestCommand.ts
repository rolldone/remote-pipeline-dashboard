import BasicCommand, { BasicCommandInterface } from "./BasicCommand";
import template from './HttpRequestCommandView.html';

export interface HttpRequestCommandInterface extends BasicCommandInterface {

}

const HttpRequestCommand = BasicCommand.extend<HttpRequestCommandInterface>({
  template,
  data() {
    return {
      form_data: {
        data: {
          params: [],
          headers: [],
          url: "",
          verb: null,
          body: {}
        }
      }
    }
  },
  async handleClick(action, props, e) {
    let _form_data = this.get("form_data");
    let _data = _form_data.data;
    switch (action) {
      case 'DELETE_PARAM':
        e.preventDefault();
        _data.params = _data.params || [];
        _data.params.splice(props.index, 1);
        await this.set("form_data.data", _data);
        break;
      case 'DELETE_HEADER':
        e.preventDefault();
        _data.headers = _data.headers || [];
        _data.headers.splice(props.index, 1);
        await this.set("form_data.data", _data);
        break;
      case 'DELETE_BODY':
        e.preventDefault();
        _data.body_datas = _data.body_datas || [];
        _data.body_datas.splice(props.index, 1);
        await this.set("form_data.data", _data);
        break;
      case 'CONTENT_TYPE':
        e.preventDefault();
        this.set("form_data.data.content_type", props.value);
        break;
      case 'ADD_PARAMS':
        e.preventDefault();
        _data.params = _data.params || [];
        _data.params.push({
          key: "",
          value: ""
        })
        this.set("form_data.data", _data);
        break;
      case 'ADD_HEADERS':
        e.preventDefault();
        _data.headers = _data.headers || [];
        _data.headers.push({
          key: "",
          value: ""
        })
        this.set("form_data.data", _data);
        break;
      case 'ADD_BODY_DATAS':
        e.preventDefault();
        _data.body_datas = _data.body_datas || [];
        _data.body_datas.push({
          key: "",
          value: ""
        })
        this.set("form_data.data", _data);
        break;
    }
  }
})

export default HttpRequestCommand;