import Ractive from "ractive";

export default Ractive.extend({
  onconstruct: function () {
    this.reInitializeObserve();
  },
  router: null,
  getLang: null,
  reInitializeObserve: function () {
    let self = this;
    for (var key in self.newOn) {
      self.off(key);
      self.on(key, self.newOn[key]);
    }
  },
  newOn: {},
  observeData: function (opts, callback) {
    return this.observe(opts, callback);
  },

});