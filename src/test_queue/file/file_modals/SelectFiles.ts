import Files, { FilesInterface } from '../Files';
import template from './SelectFileView.html';

const SelectFIles = Files.extend<FilesInterface>({
  template,
  data() {
    return {
      form_data: {
        select: null
      }
    }
  },
  handleChange(action, props, e) {
    switch (action) {
      case 'SELECT_ITEM':
        e.preventDefault();
        this.set("form_data.select", props.id);
        return;
    }
    return this._super(action, props, e)
  }
})

export default SelectFIles;