import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { debounce, DebouncedFunc } from "lodash";
import template from './FormFilterView.html';

export interface FormFilterInterface extends BaseRactiveInterface {
  resetFilter?: { (): void }
}

const FormFilter = BaseRactive.extend<FormFilterInterface>({
  template,
  data() {
    return {
      form_data: {}
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      let _debounce: DebouncedFunc<any> = null;
      let unMountFormDataSearch = this.observe("form_data.search", (val) => {
        if (val == null) return;
        if (_debounce != null) {
          _debounce.cancel();
        }
        _debounce = debounce((val) => {
          this.fire("listener", "SUBMIT", {
            filter: encodeURIComponent(JSON.stringify(this.get("form_data")))
          });
        }, 2000);
        _debounce(val);
      }, {
        init: false
      })

      let unMountFormData = this.observe("form_data.group_by", (val) => {
        this.fire("listener", "SUBMIT", {
          filter: encodeURIComponent(JSON.stringify(this.get("form_data")))
        });
      })
      _super();
      resolve();
    });
  },
  resetFilter() {
    this.set("form_data", {
      search: ""
    });
  }
});

export default FormFilter;