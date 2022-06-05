import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

const SelectPeriods = BaseRactive.extend<BaseRactiveInterface>({
  template:/* html */`
    <div class="btn-group w-100">
      {{#each periode_datas:i}}
        <button type="button" on-click="@this.handleClick('SELECT',{ index : i }, @event)" class="btn {{value==select_periods?'btn-primary':''}}">{{label}}</button>
      {{/each}}
    </div>
  `,
  data() {
    return {
      periode_datas: [{
        label: "1 Week",
        value: "one_week"
      }, {
        label: "1 Month",
        value: "one_month"
      }, {
        label: "3 Month",
        value: "three_month"
      }, {
        label: "6 Month",
        value: "six_month"
      }, {
        label: "1 Year",
        value: "one_year"
      }],
      select_periods: "one_week"
    }
  },
  handleClick(action, props, e) {
    let _periode_datas = this.get("periode_datas");
    let _select_periods = this.get("select_periods");
    switch (action) {
      case 'SELECT':
        e.preventDefault();
        _select_periods = _periode_datas[props.index].value;
        this.set("select_periods", _select_periods);
        this.fire("listener", action, _select_periods, e);
        break;
    }
  }
})

export default SelectPeriods;