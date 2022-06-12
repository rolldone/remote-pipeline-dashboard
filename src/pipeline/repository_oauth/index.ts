import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";
import AuthService from "services/AuthService";
import Bitbucket from "./Bitbucket";
import Github from "./Github";
import Gitlab from "./Gitlab";
import PersonalAccessToken from "./personal_access_token";
import template from './RepositoryView.html';

export interface RepositoryPopupInterface extends BaseRactiveInterface {
  show: { (props: any): void }
  hide: { (): void }
}

let myModal = null;
const RepositoryPopup = BaseRactive.extend<RepositoryPopupInterface>({
  template,
  partials: {
    "personal_access_token_partial": []
  },
  components: {
    "github": Github,
    "gitlab": Gitlab,
    "bitbucket": Bitbucket,
    "personal-access-token": PersonalAccessToken
  },
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      select_repository: null,
      repos_datas: [
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
      form_data: {
        from_provider: 'github'
      }
    }
  },
  onconstruct() {
    this.newOn = {
      onPersonalAccessTokenListener: (c, action, text, e) => {
        switch (action) {
          case 'SELECT':
            this.set("form_data.oauth_user_id", text.id);
            this.fire("listener", action, text, e);
            break;
        }
      }
    }
    this._super();
  },
  async handleClick(action, props, e) {
    switch (action) {
      case 'OAUTH_CLICK':
        e.preventDefault();
        await this.set("select_repository", props.action);
        let _template = Ractive.parse(/* html */`
          <personal-access-token on-listener="onPersonalAccessTokenListener" repo_from={{select_repository}}>
          </personal-access-token>
        `)
        this.resetPartial("personal_access_token_partial", [
          {
            ..._template.t[0]
          }
        ])
        break;
    }
  },
  show(props) {
    let _id_element = this.get("id_element");
    let elementModal = document.getElementById(_id_element);
    myModal = new window.bootstrap.Modal(elementModal, {
      keyboard: false
    });
    elementModal.addEventListener("hidden.bs.modal", (event: any) => {
      // do something...
      if (event.target.id == _id_element) {
        this.set("select_repository", null);
      }
    });
    myModal.show();
  },
  hide() {
    myModal.hide();
  },

});

export default RepositoryPopup;