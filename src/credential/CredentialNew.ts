import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";
import CredentialService from "services/CredentialService";
import Notify from "simple-notify";
import template from './CredentialNewView.html';

export interface CredentialNewInterface extends BaseRactiveInterface {
  submit?: { (): void }

}

const CredentialNew = BaseRactive.extend<CredentialNewInterface>({
  template,
  data() {
    return {
      form_data: {
        data: {}
      },
      form_data_data: {}
    }
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
      let _form_data_data = this.get("form_data_data");
      let _form_data = this.get("form_data");
      for (var key in _form_data.data) {
        switch (true) {
          case _form_data.data[key] == null:
          case _form_data.data[key] == "":
            delete _form_data.data[key];
            break;
        }
      }
      switch (_form_data.type) {
        case 'secret_text':
          _form_data.data = {
            secret_text: _form_data_data.secret_text
          }
          break;
        case 'password':
          _form_data.data = {
            password: _form_data_data.password
          }
          break;
        case 'secret_file':
          _form_data.data = {
            secret_file: _form_data_data.secret_file
          }
          break;
        case 'certificate':
          _form_data.data = {
            certificate: _form_data_data.certificate,
            passphrase: _form_data_data.passphrase
          }
          break;
        case 'docker_certificate':
          _form_data.data = {}
          break;
      }
      let resData = await CredentialService.addCredential(_form_data);
      resData = resData.return;
      window.credentialRouter.navigate(window.credentialRouter.buildUrl(`/${resData.id}/view`));
      new Notify({
        status: 'success',
        title: 'New Credential',
        text: 'Create new successfully :)',
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
    } catch (ex) {
      console.error("submit - ex :: ", ex);
    }
  }
});

export default CredentialNew;