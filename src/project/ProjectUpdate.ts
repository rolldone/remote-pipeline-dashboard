import ProjectNew from "./ProjectNew";

export default ProjectNew.extend({
  oncomplete() {
    this._super();
    alert("This is project update");
  }
})