import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import AuthService from "services/AuthService";
import Bitbucket from "./Bitbucket";
import Github from "./Github";
import Gitlab from "./Gitlab";
import template from './RepositoryView.html';

export interface RepositoryInterface extends BaseRactiveInterface {
  show: { (props: any): void }
  hide: { (): void }
  getOauthUrl: { (): void }
  setOauthUrl: { (props: any): void }
}

const RepositoryPopup = BaseRactive.extend<RepositoryInterface>({
  template,
  components: {
    "github": Github,
    "gitlab": Gitlab,
    "bitbucket": Bitbucket
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
        from: 'github'
      }
    }
  },
  async handleClick(action, props, e) {
    switch (action) {
      case 'OAUTH_CLICK':
        e.preventDefault();
        this.set("select_repository", props.action);
        this.setOauthUrl(await this.getOauthUrl());
        break;
    }
  },
  show(props) {
    let _id_element = this.get("id_element");
    var myModal = new window.bootstrap.Modal(document.getElementById(_id_element), {
      keyboard: false
    });
    myModal.show();
  },
  hide() {

  },
  async getOauthUrl() {
    try {
      let select_repository = this.get("select_repository");
      let resData = await AuthService.oauthGeneate({
        oauth: select_repository,
        forward_to: window.location.href
      });
      return resData;
    } catch (ex) {
      console.error("getOauthUrl - ex :: ", ex);
    }
  },
  setOauthUrl(props) {
    if (props == null) return;
    // this.set("url_redirect", props.return);
    // window.open(props.return, '_blank');
    window.location.href = props.return;
  }
});

export default RepositoryPopup;