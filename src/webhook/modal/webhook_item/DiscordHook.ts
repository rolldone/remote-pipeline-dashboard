import SmtpHook, { SmtpHookInterface } from "./SmtpHook";

const DiscordHook = SmtpHook.extend<SmtpHookInterface>({
  template:/* html */`
  <div class="modal-body">
    <div class="mb-3">
      <label class="form-label">Name</label>
      <input class="form-control" type="text" placeholder="" value="{{form_data.name}}" name="name">
    </div>
    <div class="mb-3">
      <label class="form-label">Key Tag</label>
      <input class="form-control" type="text" placeholder="" value="{{form_data.key}}" name="key" readonly>
    </div>
    <div class="mb-3">
      <label class="form-label">Webhook url</label>
      <input class="form-control" type="text" placeholder="https://discord.com/api/webhooks/xxx..." value="{{form_data.webhook_url}}" name="webhook_url">
    </div>
  </div>
  <div class="modal-footer">
    <a class="btn btn-link link-secondary" href="#" data-bs-dismiss="modal">Cancel</a>
    <a class="btn btn-primary ms-auto" href="#" data-bs-dismiss="modal"
      on-click="@this.handleClick('SUBMIT',{},@event)">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg> Update </a>
  </div>
  `
});

export default DiscordHook;