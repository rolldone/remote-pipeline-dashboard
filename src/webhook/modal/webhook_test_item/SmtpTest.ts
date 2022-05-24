import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import WebHookService from "services/WebHookService";

export interface SmtpTestInterface extends BaseRactiveInterface {
  submit?: { (): void }
}

export interface SubmitDataInterface {
  id?: number
  data?: any
  type?: string
  key?: string
}

export interface HookDataInterface {
  hook_id?: string
  webhook_type?: string
  key?: string
}

export interface FormDataInterface {
  subject?: string
  message?: string
}

const SmtpTest = BaseRactive.extend<SmtpTestInterface>({
  template: /* html */`
    <div class="modal-body">
      <div class="mb-3">
        <label class="form-label">Subject</label>
        <input type="text" class="form-control" name="subject" value="{{form_data.subject}}" placeholder="Subject...">
      </div>
      <div class="mb-3">
        <label class="form-label">Message <span class="form-label-description">56/100</span></label>
        <textarea class="form-control" name="message" value="{{form_data.message}}" rows="6" placeholder="Content.."></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <a class="btn btn-link link-secondary" href="#" data-bs-dismiss="modal">Cancel</a> 
      <a class="btn btn-primary ms-auto" href="#" on-click="@this.handleClick('SUBMIT',{},@event)">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line></svg> 
        Submit
      </a>
    </div>
  `,
  data() {
    return {
      form_data: {
        message: "Oh! Come and see the violence inherent in the system! Help, help, I'm being repressed! We shall say 'Ni' again to you, if you do not appease us. I'm not a witch. I'm not a witch. Camelot!"
      },
      hook_data: {}
    }
  },
  oncomplete() {
    let _super = this._super.bind(this);
    return new Promise((resolve: Function) => {
      console.log(this.get("hook_data"));
      _super();
      resolve();
    });
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        this.submit();
        break;
    }
  },
  async submit() {
    try {
      let _form_data: FormDataInterface = this.get("form_data");
      let _hook_data: HookDataInterface = this.get("hook_data");
      let _props: any = {};
      _props.webhook_id = _hook_data.hook_id;
      _props.data = _form_data;
      _props.type = _hook_data.webhook_type;
      _props.key = _hook_data.key;
      let resData = await WebHookService.executeItemTest(_props);
      console.log(resData);
    } catch (ex) {
      console.error("submit - ex :: ", ex);
    }
  }
});

export default SmtpTest;