var inherits = require('util').inherits,
    Driver = require('../driver'),
    webdriver = require('webdriverjs');

function WebDriverIO(config) {
  this._remoteDriver = webdriver.remote(config);
}

inherits(WebDriverIO, Driver);

WebDriverIO.prototype = {
  init: function init(cb) {
    this._remoteDriver.init(cb);
  },

  goTo: function goTo(url) {
    this.ctxt = this._remoteDriver.url(url);
  },

  getTitle: function getTitle(err, title) {
    this.ctxt.getTitle(err, title);
  },

  cssProperty: function cssProperty(selector, property, callback) {
    return this.ctxt.getElementCssProperty(
        'css selector', selector, property, callback);
  },

  width: function width(selector, expectation, coerceFn) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Width values do not match. Expected "%s", got "%s"',
        null,
        coerceFn || parseFloat
    ).bind(this);

    return this.ctxt.getCssProperty(selector, 'width', callback);
  },

  size: function size(selector, expectation, coerceFn) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Size values do not match. Expected "%s", got "%s"',
        ['width','height'],
        coerceFn
    );
    return this.ctxt.getElementSize(selector, callback);
  },

  color: function color(selector, expectation, coerceFn) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Color values do not match. Expected "%s", got "%s"',
        null,
        coerceFn
    );

    return this.ctxt.getCssProperty(selector, 'color', callback);
  },

  visible: function visible(selector, coerceFn) {
    var callback = Driver._getExpectationCallback(
        true,
        'Visibility values do not match. Expected "%s", got "%s"',
        null,
        coerceFn
    );

    return this.ctxt.isVisible(selector, callback);
  },

  invisible: function invisible(selector, coerceFn) {
    var callback = Driver._getExpectationCallback(
        false,
        'Visibility values do not match. Expected "%s", got "%s"',
        null,
        coerceFn
    );

    return this.ctxt.isVisible(selector, callback);
  },

  location: function location(selector, expectation, coerceFn) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Location values do not match. Expected "%s", got "%s"',
        ['x','y'],
        coerceFn
    );
    return this.ctxt.getLocation(selector, callback);
  },

  nodeName: function nodeName(selector, expectation, coerceFn) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Node name does not match. Expected "%s", got "%s"',
        null,
        coerceFn
    );
    return this.ctxt.getTagName(selector, callback);
  },

  text: function text(selector, expectation, coerceFn) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Text values do not match. Expected "%s", got "%s"',
        null,
        coerceFn
    );
    return this.ctxt.getText(selector, callback);
  },

  value: function value(selector, expectation, coerceFn, doSet) {
    var callback;

    doSet = doSet || false;

    if (!doSet) {
      callback = Driver._getExpectationCallback(
          expectation,
          'Value does not match. Expected "%s", got "%s"',
          null,
          coerceFn
      );
      return this.ctxt.getValue(selector, callback);
    }
    else {
      return this.ctxt.setValue(selector, arguments[1]);
    }
  },

  hasValue: function(selector, expectation, coerceFn) {
    return this.ctxt.value(selector, expectation, coerceFn);
  },

  selected: function selected(selector, coerceFn) {
    var callback = Driver._getExpectationCallback(
        true,
        'Selected values do not match. Expected "%s", got "%s"',
        null,
        coerceFn
    );
    return this.ctxt.isSelected(selector, callback);
  },

  unselected: function selected(selector, coerceFn) {
    var callback = Driver._getExpectationCallback(
        false,
        'Selected values do not match. Expected "%s", got "%s"',
        null,
        coerceFn
    );
    return this.ctxt.isSelected(selector, callback);
  },

  attr: function(selector, attrName, expectation, coerceFn) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Attribute value does not match. Expected "%s", got "%s"',
        null,
        coerceFn
    );
    return this.ctxt.getAttribute(selector, attrName, callback);
  },

  enter: function(selector, keys, coerceFn) {
    var callback = Driver._getExpectationCallback(
        keys,
        'Entered value does not match. Expected "%s", got "%s"',
        null,
        coerceFn
    );
    return this.ctxt.keys(selector, keys, callback);
  },

  wait: function(delay) {
    return this.ctxt.pause(delay);
  },

  klick: function klick(selector) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Element not clicked successfully. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null
    );
    return this.ctxt.buttonClick(selector, callback);
  },

  submit: function submit(selector) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Form not submitted successfully. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null
    );
    return this.ctxt.submitForm(selector, callback);
  },

  clear: function clear(selector) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Values not cleared. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null
    );
    return this.ctxt.clearElement(selector, callback);
  },
  end: function end(cb) {
    this.ctxt.end(cb);
  },

  endAll: function end(cb) {
    this.ctxt.endAll(cb);
  },

  exists: function exists(selector, expectation) {
    var callback;

    expectation = (expectation === undefined) ? true : false;

    callback = Driver._getExpectationCallback(
        expectation,
        'Element with selector ' + selector + ' expected to exist(%s) but exists(%s)',
        null,
        null
    );
    // use intermediate callback here in order to trap exception
    return this.ctxt.getTagName(selector, function(err, result) {
      var exists = typeof result === 'string';
      //should exist but expected to
      if (exists === expectation) {
        callback(null, expectation);
      }
      //should exist but not expected to
      else if (exists === true && expectation === false) {
        callback(null,  true);
      }
      //should not exist but expected to
      else if (exists === false && expectation === true) {
        callback(null,  false);
      }
    });

  }
};
module.exports = WebDriverIO;