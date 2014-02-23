var Content = require('./content');

function Module() {
  this.baseSelector = null;
  this.baseNode = null;
  this.required = false;
  this.element = null;
}

Content.mixin(Content, Module.prototype);

Module.prototype.init = function(driver, config) {
  this._driver = driver;
  this.baseSelector = config.selector || this.baseSelector;
  this.baseSelector = config.parentSelector + this.baseSelector;
  this.required = config.required || false;
  this.baseNode= config.element || null;
  this.initialiseContent();
};

Module.prototype._content = {};

module.exports = Module;