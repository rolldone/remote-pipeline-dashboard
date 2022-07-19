import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './ImportItemModalView.html';
import yaml from 'yaml';

export interface ImportItemModalInterface extends BaseRactiveInterface {
  show?: { (props: any): void }
  hide?: { (): void }
  submitUpload?: { (): void }
}

async function parseStringFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = event => {
      resolve(event.target.result)
    }
    fileReader.onerror = error => reject(error)
    fileReader.readAsText(file)
  })
}

let myModal = null;
const ImportItemModal = BaseRactive.extend<ImportItemModalInterface>({
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {}
    }
  },
  show(props) {
    let _id_element = this.get("id_element");
    var _trrr = document.getElementById(_id_element);
    myModal = new window.bootstrap.Modal(_trrr, {
      backdrop: 'static',
      keyboard: false
    });
    _trrr.addEventListener("hidden.bs.modal", (event: any) => {
      // do something...
      if (event.target.id == _id_element) {
        console.log("Modal Closed");
      }
    });
    myModal.show();
  },
  hide() {
    myModal.hide();
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        this.submitUpload();
        break;
    }
  },
  async submitUpload() {
    try {
      let _form_data = this.get("form_data");
      let file = await parseStringFile(_form_data.file[0]) as any;
      file = yaml.parse(file);
      for (var i in file) {
        delete file[i].id;
        delete file[i].project_id;
        delete file[i].pipeline_id;
        file[i].command_datas = file[i].pipeline_tasks;
      }
      this.fire("listener", 'SUBMIT', {
        ..._form_data,
        file
      })
    } catch (ex) {
      console.error("submitUpload :: ", ex);
    }
  }
});

export default ImportItemModal;