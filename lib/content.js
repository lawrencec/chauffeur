var Content = {
  initialiseContent: function initialiseContent(ctxt) {
    this._mixinApi(ctxt);
    Object.keys(this._content).forEach(function(key) {
      var moduleDef = this._content[key],
          moduleClass = moduleDef.module || require('./module.js'),
          module = new moduleClass();

      module.init(moduleDef);

      ctxt[key] = function() {
        this.currentScope = module.baseSelector;
        return this;
      };
    }, this);
  },

  _mixinApi: function _mixinApi(ctxt) {
    ctxt.size = function size(expectation, round) {
      var callback = Driver._getExpectationCallback(expectation, 'Size values do not match. Expected "%s", got "%s"', ['width','height']);
      return this.getElementSize(this.currentScope, callback);
    };
    ctxt.width = function width(expectation) {
      var callback = Driver._getExpectationCallback(expectation, 'Width values do not match. Expected "%s", got "%s"');
      return this.getCssProperty(this.currentScope, 'width', callback);
    };
    ctxt.color = function color(expectation) {
      var callback = Driver._getExpectationCallback(expectation, 'Color values do not match. Expected "%s", got "%s"');
      return this.getCssProperty(this.currentScope, 'color', callback);
    };
    ctxt.cssProperty = function cssProperty(selector, property, callback) {
      return this.getElementCssProperty('css selector',selector, property, callback);
    };
    ctxt.visible = function visible() {
      var callback;
      callback = Driver._getExpectationCallback(true, 'Visibility values do not match. Expected "%s", got "%s"');
      return this.isVisible(this.currentScope, callback);
    };
    ctxt.invisible = function visible() {
      var callback;
      callback = Driver._getExpectationCallback(false, 'Visibility values do not match. Expected "%s", got "%s"');
      return this.isVisible(this.currentScope, callback);
    };
  }
};

module.exports = {
  mixin: function mixin(destObject) {
    Object.keys(Content).forEach(function(property) {
      destObject.prototype[property] = Content[property];
    });
  }
};