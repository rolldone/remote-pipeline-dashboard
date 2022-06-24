import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import CredentialService from "services/CredentialService";

export interface GitInterface extends BaseRactiveInterface {
  getCredentials?: { (): void }
  setCredentials?: { (props: any): void }
  getRepoName?: { (gitUrl: string): string }
}

const Git = BaseRactive.extend<GitInterface>({
  template: /* html */`
    <div class="modal-body">
      <div class="mb-3">
        <label class="form-label">Git Url</label>
        <input type="text" class="form-control" name="repo_name" value="{{form_data.git_url}}" placeholder="Git repository url">
      </div>
      <div class="mb-3">
        <label class="form-label">Repository Name</label>
        <input type="text" class="form-control" name="repo_name" value="{{form_data.repo_name}}" placeholder="Git repository url" readonly>
      </div>
      <div class="mb-3">
        <label class="form-label">Select Credentials</label>
        <select class="form-select" value="{{form_data.credential_id}}">
          {{#credential_datas:i}}
            <option value="{{id}}" selected="">{{name}}</option>
          {{/credential_datas}}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <a href="#" class="btn btn-link link-secondary" data-bs-dismiss="modal">
        Cancel
      </a>
      <a href="#" class="btn btn-primary ms-auto" on-click="@this.handleClick('SELECT',{},@event)">
        <!-- Download SVG icon from http://tabler-icons.io/i/plus -->
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Submit
      </a>
    </div>
  `,
  data() {
    return {
      credential_datas: [],
      form_data: {}
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setCredentials(await this.getCredentials());
      _super();
      this.observe("form_data.git_url", (val: string) => {
        let repoName = this.getRepoName(val);
        this.set("form_data.repo_name", repoName);
      });
      resolve();
    });
  },
  getRepoName(gitUrl) {
    const url = gitUrl;
    const repoName = url.split('/').pop();
    return repoName.replace(/\.[^/.]+$/, "");
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SELECT':
        e.preventDefault();
        let _repo_data = this.get("form_data");
        this.fire("listener", action, {
          repo_from: "git",
          ..._repo_data
        }, e);
        break;
    }
  },
  async getCredentials() {
    try {
      let resDatas = await CredentialService.getCredentials({
        type: "credential"
      });
      return resDatas;
    } catch (ex) {
      console.error("getCredential - ex :: ", ex);
    }
  },
  setCredentials(props: any) {
    if (props == null) return;
    this.set("credential_datas", props.return);
  }
});

export default Git;