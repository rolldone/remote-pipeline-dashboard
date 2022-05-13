import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import AuthService from "services/AuthService";

export interface GithubInterface extends BaseRactiveInterface {

}

const Github = BaseRactive.extend<GithubInterface>({
  template: /* html */`
    <div style="width:100%; height:100%; background:silver;">
      {{#if url_redirect != null}}
      <iframe src="{{url_redirect}}"></iframe>
      {{/if}}
    </div>
  `,
  data() {
    return {
      url_redirect: null
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
    
      _super();
      resolve();
    });
  },
});

export default Github;