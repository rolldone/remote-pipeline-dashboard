import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

export interface VariableGroupInterface extends BaseRactiveInterface {

}

export default BaseRactive.extend<VariableGroupInterface>({
  template: /* html */ `
    <div class="row row-cards">
      <div class="col-md-12">
        <div class="card">
          <ul class="nav nav-tabs" data-bs-toggle="tabs">
            {{#each variable_groups:i}}
            <li class="nav-item">
              <a href="#tabs-home-{{i}}" class="nav-link" data-bs-toggle="tab" on-click="@this.handleClick('SWITCH_TAB',{},@event)">
                <svg xmlns="http://www.w3.org/2000/svg" on-click="@this.handleClick('DELETE_TAB',{ index : i },@event)" style="color: red; font-size: 0.5em;" class="icon icon-tabler icon-tabler-x"
                  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                {{name}}
              </a>
            </li>
            {{/each}}
            <li class="nav-item">
              <a href="#" class="nav-link" data-bs-toggle="tab" on-click="@this.handleClick('ADD_TAB',{},@event)">
                <svg xmlns="http://www.w3.org/2000/svg" style="color: blue;" class="icon icon-tabler icon-tabler-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
                Add
              </a>
            </li>
          </ul>
          <div class="card-body">
            <div class="tab-content">
              {{#each variable_groups:i}}
              <div class="tab-pane" id="tabs-home-{{i}}">
                <div>
                  Cursus turpis vestibulum, dui in pharetra vulputate id sed non turpis ultricies fringilla at sed
                  facilisis lacus pellentesque purus nibh {{i}}
                </div>
              </div>
              {{/each}}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      variable: {},
      variable_groups: []
    }
  },
  oncomplete() {

  },
  handleClick(action, props, e) {
    let _variable_groups = this.get("variable_groups");
    switch (action) {
      case 'DELETE_TAB':
        e.preventDefault();
        _variable_groups.splice(props.index, 1);
        this.set("variable_groups", _variable_groups);
        break;
      case 'SWITCH_TAB':

        break;
      case 'ADD_TAB':
        e.preventDefault();
        _variable_groups.push({
          name: "Change This Name.."
        });
        this.set("variable_groups", _variable_groups);
        break;
    }
  }
})