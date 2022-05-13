import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import RepositoryService from "services/RepositoryService";

export interface GithubListInterface extends BaseRactiveInterface {
  getRepositories?: { (): void }
  setRepositories?: { (props: any): void }
}

const GithubList = BaseRactive.extend<GithubListInterface>({
  template:/* html */`
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Repositories</h3>
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
              <a href="#" class="text-body d-block">{{name}}</a>
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
  `,
  data() {
    return {
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setRepositories(await this.getRepositories());
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    let _repos = this.get("repository_datas");
    switch (action) {
      case 'USE_IT':
        e.preventDefault();
        this.fire("listener", action, _repos[props.index], e);
        break;
    }
  },
  async getRepositories() {
    try {
      let resData = await RepositoryService.getRepositories({
        from: "github"
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

export default GithubList;