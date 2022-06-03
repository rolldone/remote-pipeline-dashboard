import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import Ractive, { ParsedTemplate } from "ractive";
import QueueRecordDetailService from "services/QueueRecordDetailService";
import template from './QueueRecordDetailDisplayDataView.html';

export interface QueueRecordDetailDisplayDataInterface extends BaseRactiveInterface {
  getDirectories: { (): void }
  setDirectories: { (props: any): void }
  renderDirItem?: { (props: any, index: number): ParsedTemplate }
  displayDirPartials?: { (): void }
}

const QueueRecordDetailDisplayData = BaseRactive.extend<QueueRecordDetailDisplayDataInterface>({
  template,
  partials: {
    directory_partials: []
  },
  data() {
    return {
      directories: []
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise(async (resolve: Function) => {
      this.setDirectories(await this.getDirectories())
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'OPEN_FILE':
        e.preventDefault();
        
        break;
      case 'OPEN_FOLDER':
        e.preventDefault();
        
        break;
    }
  },
  async getDirectories() {
    try {
      let resData = await QueueRecordDetailService.getDirectories(this.req.params.job_id);
      return resData;
    } catch (ex) {
      console.error("getDirectories - ex :: ", ex);
    }
  },
  setDirectories(props) {
    if (props == null) return;
    this.set("directories", props.return);
    let _directories = this.get("directories");
    let _children: Array<any> = _directories.children;
    let _directory_partials = this.partials.directory_partials || [];
    console.log(_children);
    for (let a = 0; a < _children.length; a++) {
      let _template = this.renderDirItem(_children[a], a);
      _directory_partials.push({
        ..._template.t[0]
      });
    }
    this.resetPartial("directory_partials", [
      ..._directory_partials
    ]);
  },
  renderDirItem(props: any, index: number) {
    switch (props.type) {
      case 'file':
        return Ractive.parse(/* html */`
        <li class="nav-item">
          <a class="nav-link" href="./index.html" on-click="@this.handleClick('OPEN_FILE',{ path : '${props.path}'},@event)">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
              <!-- Download SVG icon from http://tabler-icons.io/i/home -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-code-2" width="24"
                height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
                <desc>Download more icon variants from https://tabler-icons.io/i/file-code-2</desc>
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10 12h-1v5h1"></path>
                <path d="M14 12h1v5h-1"></path>
                <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
              </svg>
            </span>
            <span class="nav-link-title">
              ${props.name}
            </span>
          </a>
        </li>
        `);
      case 'directory':
        let _children_partial: Array<any> = this.partials["children_partial_" + index] || [];
        let _childrens: Array<any> = props.children || [];
        for (let a = 0; a < _childrens.length; a++) {
          let _template = this.renderDirItem(_childrens[a], a);
          _children_partial.push({
            ..._template.t[0]
          })
        }
        this.resetPartial("children_partial_" + index, [
          ..._children_partial
        ]);
        return Ractive.parse(/* html */`
        <li class="nav-item active dropdown" style="border-left: 1px solid;">
          <a class="nav-link dropdown-toggle" href="#navbar-layout" data-bs-toggle="dropdown"
            data-bs-auto-close="false" role="button" aria-expanded="true" on-click="@this.handleClick('OPEN_FOLDER',{ path : '${props.path}'},@event)">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
              <!-- Download SVG icon from http://tabler-icons.io/i/layout-2 -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-folder" width="24"
                height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
                <desc>Download more icon variants from https://tabler-icons.io/i/folder</desc>
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"></path>
              </svg>
            </span>
            <span class="nav-link-title">
              ${props.name}
            </span>
          </a>
          <div class="dropdown-menu show" style="padding-left: 12px;">
            <ul class="navbar-nav pt-lg-3" style="margin: 0 !important;margin-top: 0 !important;padding-top: 0 !important;padding: 0;">
            {{> children_partial_${index}}}
            </ul>
          </div>
        </li>
        `);
    }
  }
});

export default QueueRecordDetailDisplayData;