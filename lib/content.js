var Content = {
  initialiseContent: function initialiseContent(ctxt) {
    var contentParser;

    this._mixinApi(ctxt);

    contentParser = function (key) {
      var moduleDef = this._content[key],
          isModule = moduleDef.module,
          moduleClass = moduleDef.module || require('./module.js'),
          module = new moduleClass();

      module.init(moduleDef);

      ctxt[key] = function () {
        this.currentScope = module.baseSelector;
        return this;
      };

      if (isModule && module._content) {
        Object.keys(module._content).forEach(contentParser, module);
      }
    };

    Object.keys(this._content).forEach(contentParser, this);

  },

  _mixinApi: function _mixinApi(ctxt) {
    var methods = Object.keys(this._api);
    methods.forEach(function(methodName) {
      ctxt[methodName] = this._api[methodName];
    }, this);
  },

  _api: {
    size: function size(expectation, coerceFn) {
      var callback = Driver._getExpectationCallback(
          expectation,
          'Size values do not match. Expected "%s", got "%s"',
          ['width','height'],
          coerceFn
      );
      return this.getElementSize(this.currentScope, callback);
    },
    wait: function(delay) {
      return this.pause(delay);
    },
    width: function width(expectation, coerceFn) {
      var callback = Driver._getExpectationCallback(
          expectation,
          'Width values do not match. Expected "%s", got "%s"',
          null,
          coerceFn
      );

      return this.getCssProperty(this.currentScope, 'width', callback);
    },

    color: function color(expectation, coerceFn) {
      var callback = Driver._getExpectationCallback(
          expectation,
          'Color values do not match. Expected "%s", got "%s"',
          null,
          coerceFn
      );

      return this.getCssProperty(this.currentScope, 'color', callback);
    },

    cssProperty: function cssProperty(selector, property, callback) {
      selector = selector || this.currentScope;
      return this.getElementCssProperty(
          'css selector', selector, property, callback);
    },

    visible: function visible(coerceFn) {
      var callback = Driver._getExpectationCallback(
          true,
          'Visibility values do not match. Expected "%s", got "%s"',
          null,
          coerceFn
      );

      return this.isVisible(this.currentScope, callback);
    },

    invisible: function invisible(coerceFn) {
      var callback = Driver._getExpectationCallback(
          false,
          'Visibility values do not match. Expected "%s", got "%s"',
          null,
          coerceFn
      );

      return this.isVisible(this.currentScope, callback);
    },

    klick: function klick() {
      var callback = Driver._getExpectationCallback(
          {
            status: 0,
            orgStatusMessage: 'The command executed successfully.'
          },
          'Element not clicked successfully. Expected "%s", got "%s"',
          ['status', 'orgStatusMessage'],
          null
      );
      return this.buttonClick(this.currentScope, callback);
    },

    submit: function submit() {
      var callback = Driver._getExpectationCallback(
          {
            status: 0,
            orgStatusMessage: 'The command executed successfully.'
          },
          'Form not submitted successfully. Expected "%s", got "%s"',
          ['status', 'orgStatusMessage'],
          null
      );
      return this.submitForm(this.currentScope, callback);
    },

    clear: function clear() {
      var callback = Driver._getExpectationCallback(
          {
            status: 0,
            orgStatusMessage: 'The command executed successfully.'
          },
          'Values not cleared. Expected "%s", got "%s"',
          ['status', 'orgStatusMessage'],
          null
      );
      return this.clearElement(this.currentScope, callback);
    },

    location: function location(expectation, coerceFn) {
      var callback = Driver._getExpectationCallback(
          expectation,
          'Location values do not match. Expected "%s", got "%s"',
          ['x','y'],
          coerceFn
      );
      return this.getLocation(this.currentScope, callback);
    },

    nodeName: function nodeName(expectation, coerceFn) {
      var callback = Driver._getExpectationCallback(
          expectation,
          'Node name does not match. Expected "%s", got "%s"',
          null,
          coerceFn
      );
      return this.getTagName(this.currentScope, callback);
    },

    text: function text(expectation, coerceFn) {
      var callback = Driver._getExpectationCallback(
          expectation,
          'Text values do not match. Expected "%s", got "%s"',
          null,
          coerceFn
      );
      return this.getText(this.currentScope, callback);
    },

    value: function value(expectation, coerceFn, doSet) {
      var callback;

      doSet = doSet || false;

      if (!doSet) {
        callback = Driver._getExpectationCallback(
            expectation,
            'Value does not match. Expected "%s", got "%s"',
            null,
            coerceFn
        );
        return this.getValue(this.currentScope, callback);
      }
      else {
        return this.setValue(this.currentScope, arguments[0]);
      }
    },


    hasValue: function(expectation, coerceFn) {
      return this.value(expectation, coerceFn)
    },

    selected: function selected(coerceFn) {
      var callback = Driver._getExpectationCallback(
          true,
          'Selected values do not match. Expected "%s", got "%s"',
          null,
          coerceFn
      );
      return this.isSelected(this.currentScope, callback);
    },

    attr: function(attrName, expectation, coerceFn) {
      var callback = Driver._getExpectationCallback(
          expectation,
          'Attribute value does not match. Expected "%s", got "%s"',
          null,
          coerceFn
      );
      return this.getAttribute(this.currentScope, attrName, callback);
    },

    enter: function(keys, coerceFn) {
      var callback = Driver._getExpectationCallback(
          keys,
          'Entered value does not match. Expected "%s", got "%s"',
          null,
          coerceFn
      );
      return this.keys(keys, callback);
    }
  }
};

module.exports = {
  mixin: function mixin(destObject) {
    Object.keys(Content).forEach(function(property) {
      destObject.prototype[property] = Content[property];
    });
  }
};