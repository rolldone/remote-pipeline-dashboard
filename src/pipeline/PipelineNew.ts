import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import PipelineItems from "pipelineitem/PipelineItems";
import Ractive from "ractive";
import { Router } from "routerjs";
import PipelineService from "services/PipelineService";
import ProjectService from "services/ProjectService";
import RepositoryService from "services/RepositoryService";
import GithubList from "./list/GithubList";
import template from './PipelineNewView.html';
import RepositoryPopup from "./repository";

declare var window: Window;

export interface PipelineNewInterface extends BaseRactiveInterface {
  getProjectDatas?: { (): Promise<any> }
  setProjectDatas?: { (props: any): void }
  getPipeline?: { (): Promise<any> }
  setPipeline?: { (props: any): void }
}

export default BaseRactive.extend<PipelineNewInterface>({
  template,
  components: {
    "pipeline-items": PipelineItems,
    "repository-popup": RepositoryPopup,
    "github-list": GithubList
  },
  onconstruct() {
    this.newOn = {
      onGithubListListener: (c, action, text, object) => {
        
      }
    }
    this._super();
  },
  data() {
    return {
      select_source_from: null,
      form_data: {},
      pipeline_items: [],
      project_datas: [],
      repo_collection_datas: [
        {
          name: "Github",
          key: "github"
        },
        {
          name: "Gitlab",
          key: "gitlab"
        },
        {
          name: "Bitbucket",
          key: "bitbucket"
        }
      ],
      repository_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      _super();
      this.setProjectDatas(await this.getProjectDatas());
      let parseQuery = this.parseQuery(window.location.search);
      this.set("select_source_from", parseQuery.from);
      resolve();
    })
  },
  async getProjectDatas() {
    try {
      let resData = await ProjectService.getProjects({});
      return resData;
    } catch (ex) {
      console.error("getProjectDatas - ex :: ", ex);
    }
  },
  setProjectDatas(props) {
    if (props == null) return;
    this.set("project_datas", props.return);
  },
  async handleClick(action, props, e) {
    switch (action) {
      case 'SELECT_SOURCE_FROM':
        e.preventDefault();
        this.set("select_source_from", props.key)
        let _repository_popup = this.findComponent("repository-popup");
        _repository_popup.show();
        break;
      case 'SUBMIT':
        e.preventDefault();
        let form_data = this.get("form_data");
        let resData = await PipelineService.addPipeline(form_data);
        resData = resData.return;
        window.pipelineRouter.navigate(window.pipelineRouter.buildUrl(`/${resData.id}/view`));
        break;
    }
  },
});