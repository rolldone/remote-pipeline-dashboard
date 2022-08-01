import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import { debounce, DebouncedFunc } from "lodash";
import template from './FormFilterView.html';

const FormFilter = BaseRactive.extend<BaseRactiveInterface>({
  template,
  data() {
    return {
      form_data: {
        filter: true
      }
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
          this.fire("listener", "SUBMIT", this.get("form_data"));
        }, 2000);
        _debounce(val);
      })

      let unMountFormData = this.observe("form_data.group_by", (val) => {
        this.fire("listener", "SUBMIT", this.get("form_data"));
      })
      _super();
      resolve();
    });
  },

});

export default FormFilter;