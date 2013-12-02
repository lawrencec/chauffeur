var Content = require('./content.js');

function Module() {
  this.baseSelector = null;
  this.baseNode = null;
  this.required = false;
  this.element = null;
}
Module.prototype.init = function(config) {
  this.baseSelector = config.selector || this.baseSelector;
  this.required = config.required || false;
  this.baseNode= config.element || null;
};

Content.mixin(Module);
module.exports = Module;