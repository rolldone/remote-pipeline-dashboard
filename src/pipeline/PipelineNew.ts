import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import SmartValidation from "base/SmartValidation";
import PipelineItems from "pipelineitem/PipelineItems";
import Ractive from "ractive";
import { Router } from "routerjs";
import PipelineService from "services/PipelineService";
import ProjectService from "services/ProjectService";
import RepositoryService from "services/RepositoryService";
import Notify from "simple-notify";
import RepositoryList, { GitProps } from "./repository_list";
import template from './PipelineNewView.html';
import RepositoryPopup, { RepositoryPopupInterface } from "./repository_oauth";
import RepoSelected from "./repo_selected";

declare var window: Window;

export interface PipelineNewInterface extends BaseRactiveInterface {
  getProjectDatas?: { (): Promise<any> }
  setProjectDatas?: { (props: any): void }
  getPipeline?: { (): Promise<any> }
  setPipeline?: { (props: any): void }
  submit?: { (): void }
}

export default BaseRactive.extend<PipelineNewInterface>({
  template,
  partials: {
    "repo_list_partial": []
  },
  components: {
    "pipeline-items": PipelineItems,
    "repository-popup": RepositoryPopup,
    "repo-selected": RepoSelected,
    "repo-list": RepositoryList
  },
  onconstruct() {
    this.newOn = {
      onRepoListListener: (c, action, text, object) => {
        switch (action) {
          case 'SUBMIT':
            let props: GitProps = text;
            console.log("props :: ", props);
            this.set('form_data', {
              ...this.get("form_data"),
              ...props
            })
            break;
        }
      },
      onRepositoryPopupListener: async (c, action, text, object) => {
        switch (action) {
          case 'SELECT':
            this.set("form_data.oauth_user_id", text.id);
            this.set("form_data.from_provider", text.repo_from);
            this.set("select_source_from", text.repo_from);
            let _repository_popup: RepositoryPopupInterface = this.findComponent("repository-popup");
            _repository_popup.hide();
            await this.submit();
            this.resetPartial("repo_list_partial", /* html */`<repo-list on-listener="onRepoListListener" form_data={{form_data}}></repo-list>`)
            break;
        }
      }
    }
    this._super();
  },
  data() {
    return {
      select_source_from: null,
      form_data: {},
      form_error: {},
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
      this.set("form_data.oauth_user_id", parseQuery.oauth_user_id || null);
      this.set("select_source_from", parseQuery.from_provider);
      let _smartValidation = SmartValidation("pipeline-form");
      _smartValidation.inputTextValidation({
        callback: (props, e) => {
          console.log(props);
          let target = $(e.target);
          let _form_error = this.get("form_error");
          switch (props.status) {
            case "error":
              _form_error = props.error;
              this.set("form_error", {
                ...this.get("form_error"),
                ..._form_error
              });
              return target.addClass("is-invalid");
            case "valid":
            case "complete":
              return target.removeClass("is-invalid");
          }
        },
        form_data: this.get("form_data"),
        element_target: "input[type=email],input[type=text],input[type=number],input[type=password]",
        form_rules: {
          name: "required"
        },
        form_attribute_name: {
        }
      })
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
      case 'SELECT_PROVIDER':
        e.preventDefault();
        let _repository_popup = this.findComponent("repository-popup");
        _repository_popup.show();
        break;
      case 'SUBMIT':
        e.preventDefault();
        let _smartValidation = SmartValidation("pipeline-form");
        _smartValidation.submitValidation({
          form_data: this.get("form_data"),
          form_attribute_name: {
            name: "Pipeline Name"
          },
          form_rules: {
            name: "required",
            project_id: "required"
          },
          callback: (props) => {
            for (var key in props.error) {
              $("#" + props.id).find(`input[name=${key}]`).addClass("is-invalid");
              $("#" + props.id).find(`select[name=${key}]`).addClass("is-invalid");
            }
            this.set("form_error", props.error);
            for (var key in props.form_data) {
              $("#" + props.id).find(`input[name=${key}]`).removeClass("is-invalid");
              $("#" + props.id).find(`select[name=${key}]`).removeClass("is-invalid");
            }
            if (props.status == "complete") {
              this.submit();
            }
          }
        })

        break;
    }
  },
  async submit() {
    try {
      let form_data = this.get("form_data");
      let resData = await PipelineService.addPipeline(form_data);
      resData = resData.return;
      window.pipelineRouter.navigate(window.pipelineRouter.buildUrl(`/${resData.id}/view`));
      new Notify({
        status: 'success',
        title: 'New Pipeline',
        text: 'Create new successfully :)',
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
    } catch (ex: any) {
      console.error("submit - ex :: ", ex);
      new Notify({
        status: 'error',
        title: 'New Pipeline',
        text: ex.message,
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: false,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
    }
  }
});