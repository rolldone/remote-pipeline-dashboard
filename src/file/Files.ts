import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import File2Service from "services/File2Service";
import template from './FilesView.html';

export interface FilesInterface extends BaseRactiveInterface {
  submitUpload?: { (file: File): void }
  getFiles?: { (): void }
  setFiles?: { (props): void }
  submitNewDir?: { (dir_name: string): void }
  submitDelete?: { (): void }
  submitMove?: { (): void }
  submitCopy?: { (): void }
  submitDuplicate?: { (): void }
  submitRename?: { (newName: string, id: number): void }
}

let cancelObsFiles = null;
const Files = BaseRactive.extend<FilesInterface>({
  template,
  data() {
    return {
      file_datas: [],
      form_data: {
        checks: {}
      },
      upload_queue_datas: [],
      select_dir: "",
      select_dir_array: [],
      display_new_dir: false,
      select_rename: null
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setFiles(await this.getFiles());
      this.observe("select_dir", (val) => {
        let _arr = val.split("/");
        let _newArr = [];
        for (var a = 0; a < _arr.length; a++) {
          if (_arr[a] != "") {
            _newArr.push({
              path: ((a) => {
                let newPath = "/";
                for (var a1 = 0; a1 <= a; a1++) {
                  if (a1 == a) {
                    newPath += _arr[a1] + "";
                  } else {
                    newPath += _arr[a1] + "/";
                  }
                }
                return newPath;
              })(a),
              name: _arr[a]
            })
          }
        }
        this.set("select_dir_array", _newArr);
      })
      _super();
      resolve();
    });
  },
  handleChange(action, props, e) {
    let _form_data = this.get("form_data");
    switch (action) {
      case 'CHECK_ALL':
        e.preventDefault();
        _form_data.checks = _form_data.checks || {};
        let _path_name: Array<HTMLInputElement> = document.getElementsByClassName("path_name") as any;
        for (var a = 0; a < _path_name.length; a++) {
          _form_data.checks[_path_name[a].getAttribute("data-id")] = e.target.checked;
          _path_name[a].checked = e.target.checked;
        }
        this.set("form_data.checks", _form_data.checks);
        break;
      case 'CHECK_ITEM':
        _form_data.checks = _form_data.checks || {};
        _form_data.checks[props.id] = e.target.checked;
        this.set("form_data", _form_data);
        break;
    }
  },
  async handleClick(action, props, e) {
    let _file_datas = this.get("file_datas");
    let _form_data = this.get("form_data");
    let _file_data = null;
    switch (action) {
      case 'UPLOAD_FILE':
        e.preventDefault();
        $("#files").trigger("click");

        cancelObsFiles = this.observe("form_data.files", async (val) => {
          console.log("form_data.files :: ", val);
          if (val == null || Object.keys(val).length == 0) {
            this.set("upload_queue_datas", []);
            if (cancelObsFiles == null) return;
            console.log("endob", cancelObsFiles);
            cancelObsFiles.cancel();
            return;
          }
          for (var a = 0; a < val.length; a++) {
            let upload_queue_datas = this.get("upload_queue_datas");
            upload_queue_datas.push(val[a]);
            await this.set("upload_queue_datas", upload_queue_datas);
          }
          let upload_queue_datas = this.get("upload_queue_datas");
          for (var a = 0; a < upload_queue_datas.length; a++) {
            await this.submitUpload(upload_queue_datas[a]);
            upload_queue_datas[a] = null;
            this.set("upload_queue_datas", upload_queue_datas);
          }
          this.set("upload_queue_datas", []);
          this.set("form_data.files", {});
        })
        break;
      case "SUBMIT_NEW_DIR":
        e.preventDefault();
        let _new_dir_name = _form_data.dir_name;
        this.submitNewDir(_new_dir_name);
        this.set("form_data.dir_name", "");
        break;
      case 'CANCEL_NEW_DIR':
        e.preventDefault();
        this.set("display_new_dir", false);
        break;
      case 'NEW_DIRECTORY':
        e.preventDefault();
        this.set("display_new_dir", true);
        break;
      case 'CHANGE_DIR':
        e.preventDefault();
        this.set("select_dir", props.path);
        this.setFiles(await this.getFiles());
        break;
      case 'COPY':
        e.preventDefault();
        this.submitCopy();
        break;
      case 'MOVE':
        e.preventDefault();
        this.submitMove();
        break;
      case 'DUPLICATE':
        e.preventDefault();
        this.submitDuplicate();
        break;
      case 'DELETE':
        e.preventDefault();
        this.submitDelete();
        break;
      case 'VIEW':
        e.preventDefault();
        _file_data = _file_datas[props.index];
        if (props.type == "directory") {
          this.set("select_dir", _file_data.path + "/" + _file_data.name);
          this.setFiles(await this.getFiles());
          return;
        }
        break;
      case 'RENAME':
        e.preventDefault();
        this.set("select_rename", props.id);
        _file_data = _file_datas[props.index];
        this.set("form_data.rename", _file_data.name);
        break;
      case 'SUBMIT_RENAME':
        e.preventDefault();
        this.submitRename(_form_data.rename, props.id);
        break;
    }
  },
  async submitUpload(file) {
    try {
      let _select_dir = this.get("select_dir");
      let resData = await File2Service.add({
        file: file,
        path: _select_dir
      });
      this.setFiles(await this.getFiles());
    } catch (ex) {
      console.error("submitUpload - ex :: ", ex);
    }
  },
  async getFiles() {
    try {
      let _select_dir = this.get("select_dir");
      let resDatas = await File2Service.getFiles({
        path: _select_dir
      });
      return resDatas;
    } catch (ex) {
      console.error("getFiles - ex :: ", ex);
    }
  },
  setFiles(props) {
    if (props == null) return;
    this.set("file_datas", props.return);
  },
  async submitNewDir(dir_name) {
    try {
      let _select_dir = this.get("select_dir");
      let resData = await File2Service.mkdir({
        name: dir_name,
        path: _select_dir || ""
      })
      this.setFiles(await this.getFiles());
    } catch (ex) {
      console.error("submitUpload - ex :: ", ex);
    }
  },
  async submitDelete() {
    try {
      let _form_data = this.get("form_data");
      let _checks = _form_data.checks;
      let _arrDel = [];
      for (var i in _checks) {
        if (_checks[i] == true) {
          _arrDel.push(i);
        }
      }
      let resData = await File2Service.deleteByIds(_arrDel);
    } catch (ex) {
      console.error("submitDelete - ex :: ", ex);
    }
    this.setFiles(await this.getFiles());
    this.set("form_data.checks", {});
  },
  async submitMove() {
    try {
      let _select_dir = this.get("select_dir");
      let _form_data = this.get("form_data");
      let _checks = _form_data.checks;
      let _arrDel = [];
      for (var i in _checks) {
        if (_checks[i] == true) {
          _arrDel.push(i);
        }
      }
      let resData = await File2Service.moveByIds(_arrDel, _select_dir);
    } catch (ex) {
      console.error("submitMove - ex :: ", ex);
    }

    this.setFiles(await this.getFiles());
    this.set("form_data.checks", {});
  },
  async submitCopy() {
    try {
      let _select_dir = this.get("select_dir");
      let _form_data = this.get("form_data");
      let _checks = _form_data.checks;
      let _arrDel = [];
      for (var i in _checks) {
        if (_checks[i] == true) {
          _arrDel.push(i);
        }
      }
      let resData = await File2Service.copyByIds(_arrDel, _select_dir);
    } catch (ex) {
      console.error("submitMove - ex :: ", ex);
    }

    this.setFiles(await this.getFiles());
    this.set("form_data.checks", {});
  },
  async submitDuplicate() {
    try {
      let _select_dir = this.get("select_dir");
      let _form_data = this.get("form_data");
      let _checks = _form_data.checks;
      let _arrDup = [];
      for (var i in _checks) {
        if (_checks[i] == true) {
          _arrDup.push(i);
        }
      }
      let resData = await File2Service.duplicateByIds(_arrDup);
    } catch (ex) {
      console.error("submitDuplicate - ex :: ", ex)
    }

    this.setFiles(await this.getFiles());
    this.set("form_data.checks", {});
  },
  async submitRename(newName, id) {
    try {
      let resData = await File2Service.renameById(newName, id);
    } catch (ex) {
      console.error("submitRename - ex :: ", ex);
    }
    this.setFiles(await this.getFiles());
    this.set("form_data.rename", "");
    this.set("select_rename", null)
  }
});

export default Files;