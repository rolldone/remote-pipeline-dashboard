import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { debounce } from "lodash";
import RepositoryService from "services/RepositoryService";
import GithubSelectBranch, { GithubSelectBranchInterface } from "./GithubSelectBranch";

export interface GitlabListInterface extends BaseRactiveInterface {
  getRepositories?: { (): void }
  setRepositories?: { (props: any): void }
  getCurrentUser?: { (): void }
  setCurrentUser?: { (props: any): void }
}

const FROM = 'github';

const GitlabList = BaseRactive.extend<GitlabListInterface>({
  components: {
    "github-select-branch": GithubSelectBranch
  },
  template:/* html */`
    <div class="card">
      <div class="card-header" style="padding-right:0;">
        <div class="row" style="width:100%;">
          <div class="col" style="display:flex;">
            <h3 class="card-title" style="align-self:center">Repositories from ${FROM}</h3>
          </div>
          <div class="col-md-auto">
            <input class="form-control" type="text" aria-describedby="emailHelp" placeholder="Search Repository" value="{{query.search}}" name="search_repository">
          </div>
        </div>
      </div>
      <div class="list-group list-group-flush overflow-auto" style="max-height: 35rem">
        <!-- <div class="list-group-header sticky-top">A</div> -->
        {{#repository_datas:i}}
        <div class="list-group-item">
          <div class="row">
            <div class="col-auto">
              <a href="#">
                <span class="avatar" style="background-image: url(./static/avatars/023f.jpg)"></span>
              </a>
            </div>
            <div class="col text-truncate">
              <a href="#" class="text-body d-block">{{full_name}}</a>
              <div class="text-muted text-truncate mt-n1">{{description}}</div>
            </div>
            <div class="col-auto">
              <a href="#" class="btn btn-blue w-80" on-click="@this.handleClick('USE_IT',{ id : id, index : i },@event)">
                Use
              </a>
            </div>
          </div>
        </div>
        {{/repository_datas}}
      </div>
    </div>
    <github-select-branch on-listener="onGithubSelectBranchListener"></github-select-branch>
  `,
  data() {
    return {
      query: {},
      select_branch: {},
      repository_datas: [],
      form_data: {}
    }
  },
  onconstruct() {
    this.newOn = {
      onGithubSelectBranchListener: (c, action, text, object) => {
        switch (action) {
          case 'SUBMIT':
            this.fire("listener", action, text, object);
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setRepositories(await this.getRepositories());
      let pendingSearch = null;
      this.observe("query.search", (val) => {
        console.log(val);
        if (pendingSearch != null) {
          pendingSearch.cancel();
        }

        pendingSearch = debounce(async (data) => {
          this.setRepositories(await this.getRepositories());
        }, 1000);

        pendingSearch(val)
      })
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    let _repos = this.get("repository_datas");
    let _form_data = this.get("form_data");
    switch (action) {
      case 'USE_IT':
        e.preventDefault();
        let repository = _repos[props.index];
        this.fire("listener", 'SUBMIT', {
          repo_name: repository.name,
          source_type: 'git',
          from_provider: FROM
        }, e);
        // let _github_select_branch: GithubSelectBranchInterface = this.findComponent("github-select-branch");
        // _github_select_branch.show({
        //   ..._form_data,
        //   from: FROM,
        //   repo_name: repository.name,
        //   source_type: 'git'
        // })
        break;
    }
  },
  async getRepositories() {
    try {
      let form_data = this.get("form_data");
      let query = this.get("query");
      let resData = await RepositoryService.getRepositories({
        from_provider: FROM,
        oauth_user_id: form_data.oauth_user_id,
        search: query.search
      })
      return resData;
    } catch (ex) {
      console.error("getRepositories - ex :: ", ex);
    }
  },
  setRepositories(props) {
    if (props == null) return;
    this.set("repository_datas", props.return);
  }
});

export default GitlabList;