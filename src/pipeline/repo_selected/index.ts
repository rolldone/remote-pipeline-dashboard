import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import RepositoryService from "services/RepositoryService";

export interface RepoSelectedInterface extends BaseRactiveInterface {
  getRepo: { (): void }
  setRepo: { (props: any): void }
  getOwner: { (): void }
  setOwner: { (props: any): void }
  getCommits: { (): void }
  setCommits: { (props: any): void }
}

const RepoSelected = BaseRactive.extend<RepoSelectedInterface>({
  template: /* html */`
    <div class="card">
      <div class="card-header">
        <ul class="nav nav-pills card-header-pills">
          <li class="nav-item">
            <a class="nav-link {{tab_select=='BRANCH'?'active':''}}" href="#"  on-click="@this.handleClick('TAB_SELECT',{ key : 'BRANCH' },@event)">
              Branch info
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link {{tab_select=='USER_INFO'?'active':''}}" href="#"  on-click="@this.handleClick('TAB_SELECT',{ key : 'USER_INFO' },@event)">
              <!-- Download SVG icon from http://tabler-icons.io/i/star -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon me-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><desc>Download more icon variants from https://tabler-icons.io/i/star</desc><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
              User Information
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link {{tab_select=='COMMIT_HISTORIES'?'active':''}}" href="#"  tabindex="-1" aria-disabled="true" on-click="@this.handleClick('TAB_SELECT',{ key : 'COMMIT_HISTORIES' },@event)">
              Commit Histories
            </a>
          </li>
          <li class="nav-item ms-auto">
            <a class="nav-link" href="#" on-click="@this.handleClick('DELETE_REPO',{},@event)">
              <!-- Download SVG icon from http://tabler-icons.io/i/settings -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <desc>Download more icon variants from https://tabler-icons.io/i/x</desc>
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        {{#if tab_select == "BRANCH"}}
        <dl class="row">
          <dt class="col-5">Repository Name:</dt>
          <dd class="col-7"><strong>{{branch_data.name}}</strong></dd>
          <dt class="col-5">Updated at:</dt>
          <dd class="col-7"><strong>{{branch_data.updated_at}}</strong></dd>
          <dt class="col-5">Repository Url:</dt>
          <dd class="col-7"><strong>{{branch_data.git_url}}</strong></dd>
          <dt class="col-5">Branch Default:</dt>
          <dd class="col-7"><strong>{{branch_data.default_branch}}</strong></dd>
        </dl>
        {{elseif tab_select == "USER_INFO"}}
        <dl class="row">
          <dt class="col-5">Login:</dt>
          <dd class="col-7">{{owner_data.username}}</dd>
          <dt class="col-5">Name:</dt>
          <dd class="col-7">{{owner_data.name}}</dd>
          <dt class="col-5">Repo home page:</dt>
          <dd class="col-7">{{owner_data.web_url}}</dd>
          <dt class="col-5">Join at:</dt>
          <dd class="col-7">{{owner_data.created_at}}</dd>
        </dl>
        {{elseif tab_select == "COMMIT_HISTORIES"}}
        <div class="card" style="margin: -20px;border: none;">
          <div class="list-group list-group-flush overflow-auto" style="max-height: 35rem">
            <!--<div class="list-group-header sticky-top">A</div>-->
            {{#commit_datas:i}}
            <div class="list-group-item">
              <div class="row">
                <div class="col-auto">
                  <a href="{{link}}">
                    <span class="avatar" style="background-image: url(./static/avatars/023f.jpg)"></span>
                  </a>
                </div>
                <div class="col text-truncate">
                  <a href="#" class="text-body d-block">{{name}} - {{date}}</a>
                  <div class="text-muted text-truncate mt-n1">{{message}} #{{sha}}</div>
                </div>
              </div>
            </div>
            {{/commit_datas}}
          </div>
        </div>
        {{/if}}
      </div>
    </div>
  `,
  data() {
    return {
      tab_select: 'BRANCH',
      form_data: {},
      branch_data: {},
      owner_data: {},
      commit_datas: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setRepo(await this.getRepo());
      this.setOwner(await this.getOwner());
      this.setCommits(await this.getCommits());
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'TAB_SELECT':
        e.preventDefault();
        this.set("tab_select", props.key);
        break;
      case 'DELETE_REPO':
        e.preventDefault();
        this.set("form_data", {
          ...this.get("form_data"),
          repo_name: null
        });
        break;
    }
  },
  async getRepo() {
    try {
      let form_data = this.get("form_data");
      if (form_data.repo_name == null) return;
      let resData = null;
      switch (form_data.from_provider) {
        case 'github':
          resData = await RepositoryService.getRepository({
            from_provider: form_data.from_provider,
            repo_name: form_data.repo_name,
            oauth_user_id: form_data.oauth_user_id
          });
          break;
        case 'gitlab':
          resData = await RepositoryService.getRepository({
            from_provider: form_data.from_provider,
            id: form_data.repo_id,
            oauth_user_id: form_data.oauth_user_id
          });
          break;
      }
      return resData;
    } catch (ex) {
      console.error("getRepo - ex :: ", ex);
    }
  },
  setRepo(props) {
    if (props == null) return;
    this.set("branch_data", props.return);
  },
  async getOwner() {
    try {
      let form_data = this.get("form_data");
      if (form_data.from_provider == null && form_data.oauth_user_id == null) return;
      let resData = null;
      switch (form_data.from_provider) {
        case 'gitlab':
        case 'github':
          resData = await RepositoryService.getOwnerRepo({
            from_provider: form_data.from_provider,
            oauth_user_id: form_data.oauth_user_id
          });
          break;
      }
      return resData;
    } catch (ex) {
      console.error("getOwner - ex :: ", ex);
    }
  },
  setOwner(props) {
    if (props == null) return;
    this.set("owner_data", props.return);
  },
  async getCommits() {
    try {
      let form_data = this.get("form_data");
      let resData = null;
      switch (form_data.from_provider) {
        case 'github':
          resData = await RepositoryService.getCommits({
            from_provider: form_data.from_provider,
            repo_name: form_data.repo_name,
            oauth_user_id: form_data.oauth_user_id
          })
          break;
        case 'gitlab':
          resData = await RepositoryService.getCommits({
            id: form_data.repo_id,
            from_provider: form_data.from_provider,
            oauth_user_id: form_data.oauth_user_id,
          })
          break;
      }
      return resData;
    } catch (ex) {
      console.error("getCommits - ex :: ", ex);
    }
  },
  setCommits(props) {
    if (props == null) return;
    let form_data = this.get("form_data");
    let commit_datas = [];
    let resDats = props.return;
    resDats.forEach(element => {
      switch (form_data.from_provider) {
        case 'github':
        case 'gitlab':
          commit_datas.push({
            message: element.message,
            date: element.date,
            email: element.email,
            name: element.name,
            link: element.html_url,
            sha: element.sha,
            default_branch: element.default_branch
          });
          break;
      }
      return element;
    });

    this.set("commit_datas", commit_datas);
  }
});

export default RepoSelected;