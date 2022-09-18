import ArrayMove from "base/ArrayMove";
import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";
import FormManageProxy from "./FormManageProxy";

const ListManageProxy = BaseRactive.extend<BaseRactiveInterface>({
  template : /* html */`
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Proxy Connection List</h3>
    </div>
    <div class="list-group list-group-flush list-group-hoverable">
      {{#each form_datas:i}}
      <div class="list-group-item">
        {{#if form_select_index == i}}
        {{> partial_form_manage_proxy }}
        {{else}}
        <div class="row align-items-center">
          <div class="col-auto">
            <a href="#">
              <span class="avatar">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-transfer-up" width="24"
                  height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M7 21v-6"></path>
                  <path d="M20 6l-3 -3l-3 3"></path>
                  <path d="M17 3v18"></path>
                  <path d="M10 18l-3 3l-3 -3"></path>
                  <path d="M7 3v2"></path>
                  <path d="M7 9v2"></path>
                </svg>
              </span>
            </a>
          </div>
          <div class="col text-truncate">
            <a href="#" class="text-reset d-block">{{form_datas[i].host_name}}</a>
            <div class="d-block text-muted text-truncate mt-n1">
              {{#if @this.safeJSON(form_datas[i-1],'host_name',null) != null}}
              Depedency connection for {{form_datas[i-1].host_name}}
              {{else}}
              Depedency connection for Main Connection
              {{/if}}
            </div>
            <div class="d-block text-muted text-truncate mt-n1">
              {{form_datas[i].host||"xxx.xxx.xxx.xxx"}}:{{form_datas[i].port||"xx"}}
            </div>
          </div>
          <div class="col-auto">
            <div class="btn-list flex-nowrap">
              <div class="dropdown">
                <button class="btn dropdown-toggle align-text-top" data-bs-toggle="dropdown" aria-expanded="false">
                  Actions
                </button>
                <div class="dropdown-menu dropdown-menu-end">
                  <a class="dropdown-item"
                    on-click="@this.handleClick('EDIT_PROXY_ITEM',{ index : i, id : form_datas[i].id },@event)">
                    Edit
                  </a>
                  <a class="dropdown-item"
                    on-click="@this.handleClick('DELETE_PROXY_ITEM',{ index : i, id : form_datas[i].id },@event)">
                    Delete
                  </a>
                  {{#if i < (form_datas.length - 1) }} <a class="dropdown-item"
                    on-click="@this.handleClick('MOVE_DOWN',{ index : i },@event)">
                    Move Down
                    </a>
                    {{/if}}
                    {{#if i > 0 && form_datas.length > 1}}
                    <a class="dropdown-item" on-click="@this.handleClick('MOVE_UP',{ index : i },@event)">
                      Move Up
                    </a>
                    {{/if}}
                </div>
              </div>
            </div>
          </div>
        </div>
        {{/if}}
      </div>
      {{/each}}
    </div>
  </div>
  `,
  partials: {
    "partial_form_manage_proxy": []
  },
  components: {
    "form-manage-proxy": FormManageProxy,
  },
  data() {
    return {
      form_datas: [],
      form_select_index: null
    }
  },
  onconstruct() {
    this.newOn = {
      onFormManageProxyListener: (c, action, text, object) => {
        switch (action) {
          case 'SAVE':
          case 'CANCEL':
            this.set("form_select_index", null);
            break;
        }
      },
    };
    this._super();
  },
  handleClick(action, props, e) {
    let _form_datas = this.get("form_datas");
    let _form_select_index = this.get("form_select_index");
    switch (action) {
      case 'MOVE_UP':
        e.preventDefault();
        ArrayMove(_form_datas, props.index, props.index - 1)
        this.set("form_datas", _form_datas);
        break;
      case 'MOVE_DOWN':
        e.preventDefault();
        ArrayMove(_form_datas, props.index, props.index + 1)
        this.set("form_datas", _form_datas);
        break;
      case 'EDIT_PROXY_ITEM':
        e.preventDefault();
        _form_select_index = props.index;
        this.set("form_select_index", props.index);
        let partial_form_manage_proxy = [];
        let renderView = Ractive.parse(/* html */`
          <form-manage-proxy form_select_index="${props.index}" on-listener="onFormManageProxyListener"
          form_data_origin="{{form_datas[${props.index}]}}"></form-manage-proxy>
        `);
        partial_form_manage_proxy.push(renderView.t[0])
        this.resetPartial('partial_form_manage_proxy', partial_form_manage_proxy);
        break;
      case 'DELETE_PROXY_ITEM':
        e.preventDefault();
        _form_datas.splice(props.index, 1);
        this.set("form_datas", _form_datas);
        break;
    }
  },
});

export default ListManageProxy;