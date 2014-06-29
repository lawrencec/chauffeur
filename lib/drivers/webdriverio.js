var inherits = require('util').inherits,
    Driver = require('../driver'),
    ERROR_MSGS = require('../errors'),
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
        ERROR_MSGS.resolve(ERROR_MSGS.WIDTH_MISMATCH, selector),
        null,
        coerceFn || parseFloat,
        cb
    ).bind(this);

    return this.ctxt.getCssProperty(selector, 'width', callback);
  },

  size: function size(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.SIZE_MISMATCH, selector),
        ['width','height'],
        coerceFn,
        cb
    );
    return this.ctxt.getElementSize(selector, callback);
  },

  color: function color(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.COLOR_MISMATCH, selector),
        null,
        coerceFn || function(v) {
          var re =  /, /gi;
          return v.replace(re, ',');
        },
        cb
    );

    return this.ctxt.getCssProperty(selector, 'color', callback);
  },

  visible: function visible(selector, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.VISIBLE_MISMATCH, selector),
        null,
        coerceFn,
        cb
    );

    return this.ctxt.isVisible(selector, callback);
  },

  invisible: function invisible(selector, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        false,
        ERROR_MSGS.resolve(ERROR_MSGS.INVISIBLE_MISMATCH, selector),
        null,
        coerceFn,
        cb
    );

    return this.ctxt.isVisible(selector, callback);
  },

  location: function location(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.LOCATION_MISMATCH, selector),
        ['x','y'],
        coerceFn,
        cb
    );
    return this.ctxt.getLocation(selector, callback);
  },

  nodeName: function nodeName(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.NODENAME_MISMATCH, selector),
        null,
        coerceFn,
        cb
    );
    return this.ctxt.getTagName(selector, callback);
  },

  text: function text(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.TEXT_MISMATCH, selector),
        null,
        coerceFn,
        cb
    );
    return this.ctxt.getText(selector, callback);
  },

  value: function value(selector, expectation, coerceFn, cb) {
    var callback  = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.VALUE_MISMATCH, selector),
        null,
        coerceFn,
        cb
    );
    return this.ctxt.getValue(selector, callback);
  },

  selected: function selected(selector, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.SELECTED_MISMATCH, selector),
        null,
        coerceFn,
        cb
    );
    return this.ctxt.isSelected(selector, callback);
  },

  unselected: function unselected(selector, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        false,
        ERROR_MSGS.resolve(ERROR_MSGS.UNSELECTED_MISMATCH, selector),
        null,
        coerceFn,
        cb
    );
    return this.ctxt.isSelected(selector, callback);
  },

  attr: function(selector, attrName, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.ATTRIBUTE_MISMATCH, selector),
        null,
        coerceFn,
        cb
    );
    return this.ctxt.getAttribute(selector, attrName, callback);
  },

  setValue: function setValue(selector, keys, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.VALUE_MISMATCH, selector),
        null,
        isSuccessfull,
        cb
    );
    return this.ctxt.setValue(selector, keys, callback);
  },

  wait: function(delay) {
    return this.ctxt.pause(delay);
  },

  klick: function klick(selector, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.CLICK_UNSUCCESSFUL, selector),
        null,
        isSuccessfull,
        cb
    );
    return this.ctxt.click(selector, callback);
  },

  doubleklick: function doubleklick(selector, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.DOUBLE_CLICK_UNSUCCESSFUL, selector),
        null,
        isSuccessfull,
        cb
    );
    return this.ctxt.doubleClick(selector, callback);
  },

  submit: function submit(selector, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.SUBMIT_UNSUCCESSFUL, selector),
        null,
        isSuccessfull,
        cb
    );
    return this.ctxt.submitForm(selector, callback);
  },

  moveTo: function moveToObject(selector, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.MOVE_TO_UNSUCCESSFUL, selector),
        null,
        isSuccessfull,
        cb
    );
    return this.ctxt.moveToObject(selector, callback);
  },

  hover: function(selector) {
    return this.moveTo(selector);
  },


  clear: function clear(selector, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.CLEARANCE_UNSUCCESSFUL, selector),
        null,
        isSuccessfull,
        cb
    );
    return this.ctxt.clearElement(selector, callback);
  },

  end: function end() {
    this.ctxt.end(function() {
          Driver.resolve();
    });
  },

  endAll: function end() {
    this.ctxt.endAll(function() {
      Driver.resolve();
    });
  },


  exists: function exists(selector, expectation, cb) {
    var callback,
        expectationMsg;

    expectation = (expectation === undefined) ? true : expectation;
    expectationMsg = (expectation) ?
        ERROR_MSGS.resolve(ERROR_MSGS.EXISTENCE_MISMATCH, selector) :
        ERROR_MSGS.resolve(ERROR_MSGS.NON_EXISTENCE_MISMATCH, selector);

    callback = Driver._getExpectationCallback(
        expectation,
        expectationMsg,
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

  elements: function(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.INCORRECT_NUMBER_FOUND, selector),
        null,
        function existCoerceFn(result) {
          if (result.status === 0) {
            return result.value.length;
          }
          return result;
        },
        cb
    );
    this.ctxt.elements(selector, callback);
  },

  hasClass: function(selector, className, cb) {
    var callback;

    callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.HAS_CLASS_MISMATCH, selector),
        null,
        function hasClassCoerceFn(result) {
          if (result.split) {
            return (result.split(' ').indexOf(className) !== -1);
          }
          return result;
        },
        cb
    );

    return this.ctxt.getAttribute(selector, 'className', callback);
  },

  hasntClass: function(selector, className, cb) {
    var callback;

    callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.HASNT_CLASS_MISMATCH, selector),
        null,
        function hasntClassCoerceFn(result) {
          if (result.split) {
            return (result.split(' ').indexOf(className) === -1);
          }
          return result;
        },
        cb
    );
    return this.ctxt.getAttribute(selector, 'className', callback);
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
        'Browser not navigated forward in history. Expected "%s", got "%s"',
        ['status', 'orgStatusMessage'],
        null,
        cb
    );
    return this.ctxt.forward(callback);
  },

  executeScript: function executeScript(script, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        {
          status: 0,
          value: expectation
        },
        ERROR_MSGS.SCRIPT_RESULT_MISMATCH,
        ['status', 'value'],
        null,
        cb
    ).bind(this);

    return this.ctxt.execute(script, callback);
  }
};
var isSuccessfull = function isSuccessfullfunction(result) {
  if (result.status !== undefined) {
    return (result.status === 0 && result.orgStatusMessage === 'The command executed successfully.');
  }
  else return result;
};

module.exports = WebDriverIO;