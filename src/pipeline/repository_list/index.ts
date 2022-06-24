import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";

export type GitProps = {
  from_provider: string;
  repo_name: string;
  source_type: string;
}

export interface RepositoryListInterface extends BaseRactiveInterface {

}

const RepositoryList = BaseRactive.extend<RepositoryListInterface>({
  components: {
    "repo-list-selected": null
  },
  template:/* html */`
  {{> repository_list_selected }}
  `,
  partials: {
    "repository_list_selected": []
  },
  data() {
    return {
      form_data: {}
    }
  },
  onconstruct() {
    this.newOn = {
      onRepoListSelectedListener: (c, action, text, e) => {
        switch (action) {
          case 'SUBMIT':
            this.fire("listener", action, text, e);
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      let _form_data = this.get("form_data");
      switch (_form_data.repo_from) {
        case 'github':
          this.components["repo-list-selected"] = (await import("./GithubList")).default;
          break;
        case 'bitbucket':
          this.components["repo-list-selected"] = null;
          break;
        case 'gitlab':
          this.components["repo-list-selected"] = (await import("./GitlabList")).default;
          break;
      }
      let _template = Ractive.parse(/* html */`
        <repo-list-selected on-listener="onRepoListSelectedListener" form_data={{form_data}}></repo-list-selected>
      `);
      this.resetPartial("repository_list_selected", [{
        ..._template.t[0]
      }])
      _super();
      resolve();
    });
  }
});

export default RepositoryList;