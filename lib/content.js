var Driver = require('./driver');

var Content = {
  initialiseContent: function initialiseContent() {
    Object.keys(this._content).forEach(function contentParser(contentName) {
      var moduleDef = this._content[contentName],
          parentSelector = (this['baseSelector']) ? this.baseSelector + ' ' : '',
          moduleClass;

      if (typeof moduleDef === 'string') {
        moduleDef =  {selector: moduleDef};
        this.mixin(this._defaultModuleConfig, moduleDef);
      }

      moduleClass = moduleDef.module || require('./module.js');

      moduleDef.parentSelector = parentSelector;
      var moduleInstance = new moduleClass();
      moduleInstance.init(this._driver, moduleDef);
      this[contentName] = function(n) {
        this.childSelectorIndex = n;
        return this;
      }.bind(moduleInstance);

      for (var p in moduleInstance) {
        this[contentName][p] = moduleInstance[p];
      }
    }, this);
  },

  _defaultModuleConfig: {
    required: true
  },

  _getSelector: function _getSelector() {
    var selector = (this.baseSelector) ? this.baseSelector : '',
        index = this.childSelectorIndex;

    if (index === 1) {
      selector += ':first-child';
    }
    else if (index === -1) {
      selector += ':last-child';
    }
    else if (index > 1) {
      selector += ':nth-child('+index+')';
    }

    return selector;
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