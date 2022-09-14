import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import PagePubsliherService from "services/PagePublisherService";
import template from './ShareModalView.html';

export interface ShareModalInterface extends BaseRactiveInterface {
  show?: { (props: any): void }
  hide?: { (): void }
  getVariable?: { (): void }
  setVariable?: { (props: any): void }
  submitAddUser?: { (): void }
  submitUpdateUser?: { (): void }
  getUserByEmail?: { (email: string): void }
  getPublisherData?: { (): void }
  setPublisherData?: { (props: any): void }
}

let myModal = null;
const ShareModal = BaseRactive.extend<ShareModalInterface>({
  template,
  css:/* css */`
    .btn-add{
      width: 40px !important;
    }
  `,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      queue_data: {},
      form_data: {
        share_mode: "private",
        users: []
      },
      variable_data: {},
      variable_item: {}
    }
  },
  async show(props) {
    this.set("queue_data", props);
    this.setPublisherData(await this.getPublisherData());
    let myModalEl = document.getElementById(this.get("id_element"));
    myModal = new window.bootstrap.Modal(myModalEl, {
      backdrop: 'static', keyboard: false
    })
    myModalEl.addEventListener('hidden.bs.modal', function (event) {
      // do something...

    })
    myModal.show();
  },
  hide() {
    myModal.hide();
  },
  handleClick(action, props, e) {
    let _form_data = this.get("form_data");
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        if (_form_data.id != null) {
          return this.submitUpdateUser();
        }
        this.submitAddUser();
        break;
      case 'DELETE_USER':
        e.preventDefault();
        _form_data.users = _form_data.users || [];
        _form_data.users.splice(props.index, 1);
        _form_data.email = "";
        this.set("form_data", _form_data);
        break;
      case 'SELECT_SHARE_MODE':
        e.preventDefault();
        this.set("form_data.share_mode", props);
        break;
      case 'ADD_USER':
        e.preventDefault();
        _form_data.users = _form_data.users || [];
        _form_data.users.push(_form_data.email);
        _form_data.email = "";
        this.set("form_data", _form_data);
        break;
    }
  },
  getUserByEmail(email) {
    try {
      let resData = null;
    } catch (ex) {
      console.error("getUserByEmail - ex :: ", ex);
    }
  },
  async submitAddUser() {
    try {
      let _queue_data = this.get("queue_data");
      let _form_data = this.get("form_data");
      if ((_form_data.users || []).length > 0 && _form_data.share_mode == "public") {
        _form_data.users = [];
      }
      let resData = await PagePubsliherService.addPublisher({
        share_mode: _form_data.share_mode,
        users: _form_data.users || [],
        table_id: _queue_data.id,
        page_name: "queue_records"
      });
      this.fire("listener", {});
    } catch (ex) {
      console.error("submitAddUser - ex :: ", ex);
    }
  },
  async getPublisherData() {
    try {
      let _queue_data = this.get("queue_data");
      let resData = await PagePubsliherService.getPublisherByPageNameTableId("queue_records", _queue_data.id);
      return resData;
    } catch (ex) {
      console.error("getPublisherData - ex :: ", ex);
    }
  },
  setPublisherData(props) {
    if (props == null) return;
    if (props.return == null) return;
    props = props.return;
    for (var a = 0; a < props.users.length; a++) {
      props.users[a] = props.users[a].email;
    }
    this.set("form_data", props);
  },
  async submitUpdateUser() {
    try {
      let _queue_data = this.get("queue_data");
      let _form_data = this.get("form_data");
      if ((_form_data.users || []).length > 0 && _form_data.share_mode == "public") {
        _form_data.users = [];
      }
      let resData = await PagePubsliherService.updatePublisher({
        id: _form_data.id,
        share_mode: _form_data.share_mode,
        users: _form_data.users || [],
        table_id: _queue_data.id,
        page_name: "queue_records"
      });
      this.fire("listener", {});
    } catch (ex) {
      console.error("submitUpdateUser - ex :: ", ex);
    }
  }
});

export default ShareModal;