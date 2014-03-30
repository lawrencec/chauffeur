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

  getTitle: function getTitle(cb) {
    this.ctxt.getTitle(cb);
  },

  cssProperty: function cssProperty(selector, property, callback) {
    return this.ctxt.getElementCssProperty(
        'css selector', selector, property, callback);
  },

  width: function width(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Width values do not match. Expected "%s", got "%s"',
        null,
        coerceFn || parseFloat,
        cb
    ).bind(this);

    return this.ctxt.getCssProperty(selector, 'width', callback);
  },

  size: function size(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Size values do not match. Expected "%s", got "%s"',
        ['width','height'],
        coerceFn,
        cb
    );
    return this.ctxt.getElementSize(selector, callback);
  },

  color: function color(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Color values do not match. Expected "%s", got "%s"',
        null,
        coerceFn,
        cb
    );

    return this.ctxt.getCssProperty(selector, 'color', callback);
  },

  visible: function visible(selector, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        'Visibility values do not match. Expected "%s", got "%s"',
        null,
        coerceFn,
        cb
    );

    return this.ctxt.isVisible(selector, callback);
  },

  invisible: function invisible(selector, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        false,
        'Visibility values do not match. Expected "%s", got "%s"',
        null,
        coerceFn,
        cb
    );

    return this.ctxt.isVisible(selector, callback);
  },

  location: function location(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Location values do not match. Expected "%s", got "%s"',
        ['x','y'],
        coerceFn,
        cb
    );
    return this.ctxt.getLocation(selector, callback);
  },

  nodeName: function nodeName(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Node name does not match. Expected "%s", got "%s"',
        null,
        coerceFn,
        cb
    );
    return this.ctxt.getTagName(selector, callback);
  },

  text: function text(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Text values do not match. Expected "%s", got "%s"',
        null,
        coerceFn,
        cb
    );
    return this.ctxt.getText(selector, callback);
  },

  value: function value(selector, expectation, coerceFn, cb, doSet) {
    var callback;

    doSet = doSet || false;

    if (!doSet) {
      callback = Driver._getExpectationCallback(
          expectation,
          'Value does not match. Expected "%s", got "%s"',
          null,
          coerceFn,
          cb
      );
      return this.ctxt.getValue(selector, callback);
    }
    else {
      return this.ctxt.addValue(selector, arguments[1]);
    }
  },

  hasValue: function(selector, expectation, coerceFn, cb) {
    return this.value(selector, expectation, coerceFn, cb, false);
  },

  selected: function selected(selector, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        'Selected values do not match. Expected "%s", got "%s"',
        null,
        coerceFn,
        cb
    );
    return this.ctxt.isSelected(selector, callback);
  },

  unselected: function unselected(selector, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        false,
        'Selected values do not match. Expected "%s", got "%s"',
        null,
        coerceFn,
        cb
    );
    return this.ctxt.isSelected(selector, callback);
  },

  attr: function(selector, attrName, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Attribute value does not match. Expected "%s", got "%s"',
        null,
        coerceFn,
        cb
    );
    return this.ctxt.getAttribute(selector, attrName, callback);
  },

  setValue: function setValue(selector, keys, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Entered value does not match. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        coerceFn,
        cb
    );
    return this.ctxt.setValue(selector, keys, callback);
  },

  wait: function(delay) {
    return this.ctxt.pause(delay);
  },

  klick: function klick(selector, cb) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Element not clicked successfully. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null,
        cb
    );
    return this.ctxt.click(selector, callback);
  },

  doubleklick: function doubleklick(selector, cb) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Element not double-clicked successfully. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null,
        cb
    );
    return this.ctxt.doubleClick(selector, callback);
  },

  submit: function submit(selector, cb) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Form not submitted successfully. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null,
        cb
    );
    return this.ctxt.submitForm(selector, callback);
  },

  moveTo: function moveToObject(selector, cb) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Not moved cursor to element ' + selector + 'successfully. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null,
        cb
    );
    return this.ctxt.moveToObject(selector, callback);
  },

  hover: function(selector) {
    return this.moveTo(selector);
  },


  clear: function clear(selector, cb) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Values not cleared. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null,
        cb
    );
    return this.ctxt.clearElement(selector, callback);
  },

  end: function end(cb) {
    this.ctxt.end(cb);
  },

  endAll: function end(cb) {
    this.ctxt.endAll(cb);
  },

  exists: function exists(selector, expectation, cb) {
    var callback;

    expectation = (expectation === undefined) ? true : false;

    callback = Driver._getExpectationCallback(
        expectation,
        'Element with selector ' + selector + ' expected to exist(%s) but exists(%s)',
        null,
        null,
        cb
    );
    // use intermediate callback here in order to trap exception
    return this.ctxt.getTagName(selector, function(err, tagName) {
      var exists = typeof tagName === 'string';
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
  },

  elements: function(selector, expectation) {
    this.ctxt.elements(selector, function(err, res) {
      if (err) {
        throw new Error(err);
      }
      if (res.status === 0 && res.value.length !== expectation) {
        throw new Error('Found incorrect number of elements matching "' + selector + '" . Expected to find ' + expectation + ' but found ' + res.value.length);
      }
    });
  },

  hasClass: function(selector, className, cb) {
    var callback;

    callback = Driver._getExpectationCallback(
        className,
        'Class name value does not match. Expected "%s", got "%s"',
        null,
        function(result) {
          var classNames = result.split(' '),
              index = classNames.indexOf(className);

          return (index > -1) ? className : null;
        },
        cb
    );
    return this.ctxt.getAttribute(selector, 'className', callback);
  },

  hasntClass: function(selector, className, cb) {
    var callback;

    callback = Driver._getExpectationCallback(
        '',
        'Class name value does not match. Expected to not have "' + className + '" but did',
        null,
        null,
        cb
    );
    return this.ctxt.getAttribute(selector, 'className', function(err, result) {
      if (err) {
        throw new Error(err);
      }

      if (result.split(' ').indexOf(className) === -1) {
        callback(null, '');
      }
      else {
        callback(null, className);
      }
    });
  },

  back: function back(cb) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Browser not navigated back in history. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null,
        cb
    );
    return this.ctxt.back(callback);
  },

  forward: function back(cb) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          orgStatusMessage: 'The command executed successfully.'
        },
        'Browser not navigated back in history. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null,
        cb
    );
    return this.ctxt.forward(callback);
  },
};

module.exports = WebDriverIO;