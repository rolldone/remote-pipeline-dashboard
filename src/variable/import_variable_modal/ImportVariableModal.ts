import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import template from './ImportVariableModalView.html';
import yaml from 'yaml';
import ProjectService from "services/ProjectService";
import PipelineService from "services/PipelineService";

export interface ImportVariableModalInterface extends BaseRactiveInterface {
  getProjects?: { (): Promise<any> }
  setProjects?: { (props: any): void }
  getPipelines?: { (project_id: number): Promise<any> }
  setPipelines?: { (props: any): void }
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
const ImportVariableModal = BaseRactive.extend<ImportVariableModalInterface>({
  template,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {},
      project_datas: [],
      pipeline_datas: [],
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setProjects(await this.getProjects());
      _super();
      resolve();
    });
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
  async getProjects() {
    try {
      let resData = await ProjectService.getProjects({});
      return resData;
    } catch (ex) {
      console.error("getProjects - ex :: ", ex);
    }
  },
  setProjects(props) {
    if (props == null) return;
    this.set("project_datas", props.return);
  },
  async getPipelines(project_id) {
    try {
      let form_data = this.get("form_data");
      let resData = await PipelineService.getPipelines({
        project_id: form_data.project_id
      });
      return resData;
    } catch (ex) {
      console.error("getPipeline - ex :: ", ex);
    }
  },
  setPipelines(props) {
    if (props == null) return;
    this.set("pipeline_datas", props.return);
  },
  async handleChange(action, props, e) {
    switch (action) {
      case 'PROJECT_SELECT':
        if (e.target.value == '') return;
        this.setPipelines(await this.getPipelines(e.target.value))
        break;
    }
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
      delete _form_data.file;
      this.fire("listener", 'SUBMIT', {
        ...file,
        ..._form_data,
      })
    } catch (ex) {
      console.error("submitUpload :: ", ex);
    }
  }
});

export default ImportVariableModal;