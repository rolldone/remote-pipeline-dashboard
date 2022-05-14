import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import RepositoryService from "services/RepositoryService";
import { GitProps } from ".";

export interface GithubSelectBranchInterface extends BaseRactiveInterface {
  getBranchs?: { (): void }
  setBranchs?: { (props: any): void }
  show?: {
    (props: GitProps): void
  }
  hide?: { (): void }
};

const GithubSelectBranch = BaseRactive.extend<GithubSelectBranchInterface>({
  template:/* html */`
    <div class="modal modal-blur fade show" id="{{id_element}}" tabindex="-1" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Repository {{form_data.repo_name}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <div class="form-label">Select Branch</div>
              <select class="form-select" value="{{form_data.branch}}" name="branch">
                {{#branch_datas:i}}
                <option value="{{name}}">{{name}}</option>
                {{/branch_datas}}
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" on-click="@this.handleClick('SUBMIT',{},@event)">Add Team</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {},
      branch_datas: []
    }
  },
  oncomplete() { },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        this.fire("listener", action, this.get("form_data"), e);
        break;
    }
  },
  hide() {
    let _id_element = this.get("id_element");
    var myModal = new window.bootstrap.Modal(document.getElementById(_id_element), {
      keyboard: false
    });
    myModal.hide();
  },
  async show(props) {
    await this.set("form_data", {
      ...props,
      // Just for make sure 
      from_provider: props.from_provider,
      repo_name: props.repo_name,
      source_type: props.source_type
    });
    let _id_element = this.get("id_element");
    var myModal = new window.bootstrap.Modal(document.getElementById(_id_element), {
      keyboard: false
    });
    myModal.show();
    this.setBranchs(await this.getBranchs());
  },
  async getBranchs() {
    try {
      let _form_Data = this.get("form_data");
      let resData = await RepositoryService.getBranchs({
        repo_name: _form_Data.repo_name,
        from_provider: _form_Data.from_provider,
        oauth_user_id: _form_Data.oauth_user_id
      })
      return resData;
    } catch (ex) {
      console.error("getBranchs - ex :: ", ex);
    }
  },
  setBranchs(props) {
    if (props == null) return;
    this.set("branch_datas", props.return);
  }
});

export default GithubSelectBranch;