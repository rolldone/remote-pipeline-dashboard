import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
// import EditHostCollection from "./modal/EditHostCollection";

export interface HostCollectionInterface extends BaseRactiveInterface {
  generateHostFirst?: { (): void }
  deleteHost?: { (index: number): void }
}

const PushServiceCollection = BaseRactive.extend<HostCollectionInterface>({
  components: {
   //  "edit-host-collection": EditHostCollection
  },
  template:/* html */`
    <div class="row row-cards">
      <div class="col-md-12">
        <div class="card">
          <div class="table-responsive">
            <edit-host-collection form_data={{edit_form_data}} on-listener="onEditHostCollectionListener" index="{{select_index}}"></edit-host-collection>
            <table class="table table-vcenter table-mobile-md card-table">
              <thead>
                <tr>
                  <th>Ip Address</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th class="w-1"></th>
                </tr>
              </thead>
              <tbody>
              {{#each datas:i}}
                <tr>
                  <td data-label="Name">
                    <div>Address</div>
                    <div class="text-muted">{{ip_address}}</div>
                  </td>
                  <td data-label="Title">
                    <div>Server Name</div>
                    <div class="text-muted">{{host_name}}</div>
                  </td>
                  <td class="text-muted" data-label="Role">
                    {{from}}
                  </td>
                  <td class="text-muted" data-label="Role">
                    {{status==true?"Active":"Deactivated"}}
                  </td>
                  <td>
                    <div class="btn-list flex-nowrap">
                      <a href="#" class="btn" on-click="@this.handleClick('EDIT',{ index : i },@event)">
                        Edit
                      </a>
                      <div class="dropdown">
                        <button class="btn dropdown-toggle align-text-top" data-bs-toggle="dropdown" aria-expanded="false">
                          Actions
                        </button>
                        <div class="dropdown-menu dropdown-menu-end" style="">
                          <a class="dropdown-item" href="#" on-click="@this.handleClick('ADD_MORE',{},@event)">
                            Add More
                          </a>
                          <a class="dropdown-item" href="#" on-click="@this.handleClick('CHANGE_STATUS',{},@event)">
                            Deactivated
                          </a>
                          <a class="dropdown-item" href="#" on-click="@this.handleClick('DELETE',{ index : i },@event)">
                            Delete
                          </a>
                          <a class="dropdown-item" href="#" on-click="@this.handleClick('PING_TEST',{},@event)">
                            Ping Test
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              {{/each}}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      datas: [],
      edit_form_data: {},
      select_index: null
    }
  },
  onconstruct() {
    this.newOn = {
      "onEditHostCollectionListener": function (object, action, text, c) {
        let _datas = this.get("datas");
        switch (action) {
          case 'SUBMIT':
            _datas[text.index] = this.get("edit_form_data");
            this.set("datas", _datas);
            break;
        }
      }
    }
    this._super();
  },
  oncomplete() {
    let _datas = this.get("datas") || [];
    if (_datas.length == 0) {
      this.generateHostFirst();
    }
  },
  handleClick(action, props, e) {
    let _datas = this.get("datas");
    switch (action) {
      case 'EDIT':
        e.preventDefault();
        let _index = props.index;
        this.set("select_index", _index);
        this.set("edit_form_data", _datas[_index]);
        let editHostCollectionComponent = this.findComponent("edit-host-collection");
        editHostCollectionComponent.show();
        break;
      case 'DELETE':
        e.preventDefault();
        this.deleteHost(props.index);
        break;
      case 'ADD_MORE':
        e.preventDefault();
        this.generateHostFirst();
        break;
    }
  },
  deleteHost(index) {
    let _datas = this.get("datas");
    _datas.splice(index, 1);
    this.set("datas", _datas);
  },
  generateHostFirst() {
    try {
      let _datas = this.get("datas") || [];
      _datas.push({
        ip_address: "192.168.0.1",
        from: "Your ip address Location",
        host_name: "Your Host Name",
        status: true,
        auth_type: "parent"
      })
      this.set("datas", _datas);
    } catch (ex) {
      console.error("generateHostFirst - ex :: ", ex);
    }
  }
});

export default PushServiceCollection;