import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive from "ractive";


export default BaseRactive.extend<BaseRactiveInterface>({
  template:  /*html*/`
    <a href="#" class="btn btn-flickr w-100" on-click="@this.handleClick('ADD_MORE',{},@event)">
      <!-- Download SVG icon from http://tabler-icons.io/i/brand-flickr -->
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="7" cy="12" r="3"></circle><circle cx="17" cy="12" r="3"></circle></svg>
      {{button_text}}
    </a>
  `,
  isolated: false,
  data() {
    return {
      button_text: "xxx"
    }
  },
  oncomplete() {
    console.log("vmkfdv", this);
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'ADD_MORE':
        e.preventDefault();
        this.fire("listener", action, props, e);
        break;
    }
  }
})