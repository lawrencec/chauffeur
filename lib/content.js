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

      this[contentName] = new moduleClass();
      moduleDef.parentSelector = parentSelector;
      this[contentName].init(this._driver, moduleDef);

    }, this);
  },

  _defaultModuleConfig: {
    required: true
  },

  mixin: function mixin(srcObject, destObject) {
    Object.keys(srcObject).forEach(function(property) {
      destObject[property] = srcObject[property];
    });
  },

  delegate: function delegate(methodToDelegate) {
    return function() {
      var args = (this.baseSelector) ? [this.baseSelector] : [];
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