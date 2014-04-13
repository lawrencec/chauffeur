var Driver = require('./driver');

var Content = {
  initialiseContent: function initialiseContent() {
    Object.keys(this._content).forEach(function contentParser(contentName) {
      this.buildModule(contentName);
    }, this);
  },

  _buildContentModule: function buildContentModule(contentName, moduleDef) {
    var moduleClass = moduleDef.module || require('./module.js'),
        moduleInstance = new moduleClass();

    moduleInstance.init(this._driver, moduleDef);

    this[contentName] = function (n) {
      this.childSelectorIndex = n;
      Object.keys(this._content).forEach(function dynamicCSSContext(contentName) {
        this[contentName].parentSelector = this._getSelector();
      }.bind(this));
      return this;
    }.bind(moduleInstance);

    for (var p in moduleInstance) {
      this[contentName][p] = moduleInstance[p];
    }
  },

  _buildDefaultModule: function buildDefaultModule(moduleDef) {
    var defaultModuleConfig = {selector: moduleDef, required: true};
    return (typeof moduleDef === 'string') ? defaultModuleConfig : moduleDef;
  },

  buildModule: function buildModule(contentName) {
    var moduleDef = this._buildDefaultModule(this._content[contentName]);
    moduleDef.parentSelector = (this.baseSelector) ? this.baseSelector + ' ' : '';
    this._buildContentModule(contentName, moduleDef);
  },

  _getSelector: function _getSelector() {
    var childSelector = this.baseSelector || '',
        index = this.childSelectorIndex,
        childSelectors = {
          '-1': ':last-child',
          '1': ':first-child'
        };

    if (this.parentSelector) {
      childSelector = this.parentSelector + ' ' + this.selector; //won't work for modules?
    }

    childSelector += childSelectors[index] || '';

    if (index > 1) {
      childSelector += ':nth-child('+index+')';
    }

    return childSelector;
  },

  mixin: function mixin(srcObject, destObject) {
    Object.keys(srcObject).forEach(function(property) {
      destObject[property] = srcObject[property];
    });
  },

  delegate: function delegate(methodToDelegate) {
    return function driverMethodDelegator() {
      var selector = this._getSelector(),
          args = selector ? [selector] : [];

      this._driver[methodToDelegate].apply(
          this._driver,
          args.concat(Array.prototype.slice.call(arguments))
      );
      this.parentSelector = null;
      return this;
    }.bind(this);
  }
};

Object.keys(Driver.prototype).forEach(function(item) {
  if (item !== 'init') {
    Content[item] = function() {
      return this.delegate(item).apply(this, arguments);
    };
  }
});
module.exports = Content;