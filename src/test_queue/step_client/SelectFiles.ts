import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import File2Service from "test_queue/services/File2Service";
import template from './SelectFilesView.html';

export interface SelectFilesInterface extends BaseRactiveInterface {
  submitFile?: { (): void }
}

const SelectFiles = BaseRactive.extend<SelectFilesInterface>({
  template,
  data() {
    return {
      select_files: [],
      form_data: {
        files: [],
      }
    }
  },
  async handleClick(action, props, e) {
    let _form_data = this.get("form_data");
    let _files = _form_data.files || [];
    switch (action) {
      case 'DELETE_SELECT_FILE':
        e.preventDefault();
        _files.splice(props.index, 1);
        console.log(_files);
        debugger;
        this.set("form_data.files", _files);
        break;
      case 'ADD_MORE':
        e.preventDefault();
        _files.push(null);
        this.set("form_data.files", _files);
        break;
      case 'IGNORE':
        e.preventDefault();

      this.fire("listener", 'NEXT', 2, null)
        break;
      case 'NEXT':
        e.preventDefault();
        await this.submitFile();
        break;
    }
  },
  async submitFile() {
    try {
      let _form_data = this.get("form_data");
      let _files: Array<any> = _form_data.files;
      for (let a = 0; a < _files.length; a++) {
        let resData = await File2Service.add({
          path: _form_data.path,
          file: _files[a][0]
        });
      }
      this.fire("listener", 'NEXT', 2, null)
    } catch (ex) {
      console.error("submitFile - ex :: ", ex);
    }
  }
});

export default SelectFiles;