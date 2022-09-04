import FileModals, { FileModalInterface } from "file/file_modals/FilesModal";
import File2Service from "services/File2Service";
import BasicCommand, { BasicCommandInterface } from "./BasicCommand";
import template from './HttpRequestCommandView.html';

export interface HttpRequestCommandInterface extends BasicCommandInterface {
  getFile?: { (id: number): void }
  setFile?: { (props): void }
}

const HttpRequestCommand = BasicCommand.extend<HttpRequestCommandInterface>({
  template,
  components: {
    "file-modal": FileModals
  },
  data() {
    return {
      select_index: null,
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
  onconstruct() {
    this.newOn = {
      ...this.newOn,
      onFileModalListener: async (c, action, props, e) => {
        let fileModal: FileModalInterface = this.findComponent("file-modal");
        fileModal.hide();
        this.setFile(await this.getFile(props));
      }
    }
    this.reInitializeObserve();
  },
  async handleClick(action, props, e) {
    let _form_data = this.get("form_data");
    let _data = _form_data.data;
    switch (action) {
      case 'CHOOSE_FILE':
        // $(e.target).siblings(`input[name=${props.name}]`).trigger("click");
        let fileModal: FileModalInterface = this.findComponent("file-modal");
        fileModal.show({});
        this.set("select_index", props.index);
        break;
      case 'ADD_FILES':
        e.preventDefault();
        _data.file_datas = _data.file_datas || [];
        _data.file_datas.push({
          key: "",
          value: ""
        })
        this.set("form_data.data", _data);
        break;
      case 'DELETE_FILE_DATAS':
        e.preventDefault();
        _data.file_datas = _data.file_datas || [];
        _data.file_datas.splice(props.index, 1);
        await this.set("form_data.data", _data);
        break;
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
  },
  async getFile(id: number) {
    try {
      let resData = await File2Service.getFileById(id);
      return resData;
    } catch (ex) {
      console.error("getFile - ex :: ", ex);
    }
  },
  async setFile(props) {
    if (props == null) return;
    let _select_index = this.get("select_index");
    let _form_data = this.get("form_data");
    let _data = _form_data.data;
    _data.file_datas = _data.file_datas || [];
    for (let a = 0; a < _data.file_datas.length; a++) {
      if (a == _select_index) {
        _data.file_datas[a] = {
          ...props.return,
          ..._data.file_datas[a],
          value: props.return.name
        };
        break;
      }
    }
    this.set("form_data.data", _data);
  }
})

export default HttpRequestCommand;