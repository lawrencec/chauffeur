var assert = require('assert');
var NOT_IMPLEMENTED_EXCEPTION = 'NOT_IMPLEMENTED_EXCEPTION';


/**
 Browser is passed a driver instance or creates one based on a config.
 */

function Driver(config) {}

function deepExpectationCheck(expectationKeys, coerceFn, result, expectation, msg, cb) {
  expectationKeys.forEach(function (item) {
    if (coerceFn(result[item]) !== coerceFn(expectation[item])) {
      Driver._errorOut(msg, coerceFn(expectation), coerceFn(result), cb);
    }
  });
  cb();
  return true;
}

function shallowExpectationCheck(coerceFn, result, expectation, msg, cb) {
  var coercedResult = coerceFn(result),
      coercedExpectation = coerceFn(expectation);
  if (coercedResult !== coercedExpectation) {
    Driver._errorOut(msg, coercedExpectation, coercedResult, cb);
  }
  cb();
  return true;
}

function filterUnexpectedKeys(result, expectationKeys) {
  var actual = {};
  if (!expectationKeys) {
    return result;
  }
  expectationKeys.forEach(function (item) {
    actual[item] = result[item];
  });
  return actual;
}

Driver._checkResultAgainstExpectation = function checkResultAgainstExpectation(
    expectation,
    expectationKeys,
    msg,
    result,
    coerceFn,
    cb) {

        coerceFn = coerceFn || function(v) { return v; };
        result = filterUnexpectedKeys(result, expectationKeys);

        if (expectationKeys) {
          return deepExpectationCheck(expectationKeys, coerceFn, result, expectation, msg, cb);
        }
        return shallowExpectationCheck(coerceFn, result, expectation, msg, cb);
};

Driver._getExpectationCallback = function _getExpectationCallback(
    expectation,
    msg,
    expectationKeys,
    coerceFn,
    cb) {

  if (typeof expectation === 'function') { // likely a callback
    return function(err, result) {
      if (result) {
        result = filterUnexpectedKeys(result, expectationKeys);
      }
      return expectation(err, result);
    };
  }
  return function _getExpectationCB(err, result) {
    var statusCallback = Driver._getStatusCallback(cb);
    if (err) {
      Driver._errorOut(err, expectation, result, statusCallback);
    }
    return Driver._checkResultAgainstExpectation(
        expectation, expectationKeys, msg, result, coerceFn, statusCallback
    );
  };
};

Driver._getStatusCallback = function _getStatusCallback(cb) {
  var f = cb || function() {};
  f.fail = f.fail || false;
  return f;
};

Driver._errorOut = function errorOut(errMsg, expected, actual, cb) {
  var error = new Error(Driver._getErrorMessage(errMsg));
  error.expected = expected;
  error.actual = actual;
  if (cb && cb.fail) {
    return cb.fail(error);
  }

  Driver.resolve(error);
};

Driver.getWebDriver = function getWebDriver(webDriverClass) {
  switch (webDriverClass) {
    case 'webdriverio':
      return require('./drivers').webdriverio;
    case 'webdriverjs':
      return require('./drivers').webdriverjs;
    default:
      return require(webDriverClass);
  }
};

Driver.resolveWith = function resolveWith(cb) {
  Driver._resolveCallback = cb;
};

Driver.resolve = function resolve(err) {
  if (Driver._resolveCallback) {
    Driver._resolveCallback(err);
    delete Driver._resolveCallback;
  }
};

Driver._getErrorMessage = function(err) {
  if (typeof err === 'object') {
    return err.orgStatusMessage || err.message;
  }
  return err;
};

Driver.prototype.init = function init(cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.goTo = function goTo(url) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.getTitle = function(err, title) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.width = function width(selector, expectation, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.size = function size(selector, expectation, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.color = function color(selector, expectation, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.visible = function visible(selector, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.invisible = function invisible(selector, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.wait = function wait(delay) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.klick = function klick(cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.doubleklick = function doubleklick(cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.clear = function clear(selector, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.location = function location(selector, expectation, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.nodeName = function nodeName(selector, expectation, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.text = function text(selector, expectation, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.selected = function selected(selector, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.unselected = function selected(selector, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.submit = function submit(selector) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.value = function value(selector, expectation, coerceFn, doSet) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.attr = function attr(selector, attrName, expectation, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.setValue = function setValue(selector, keys, coerceFn, cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.cssProperty = function cssProperty(selector, property, callback) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

//
Driver.prototype.endAll = function endAll(cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.exists = function exists(selector, expectation) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.elements = function elements(selector, expectation) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.hasClass = function hasClass(selector, className, expectation) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.hasntClass = function hasClass(selector, className) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.moveTo = function moveTo(selector, className) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.hover = function moveTo(selector, className) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.back = function back(selector, className) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.forward = function forward(selector, className) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.executeScript = function executeScript(selector, className) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.getWindow = function getWindow() {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.setSize = function setWindowSize(windowSize) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.getSize = function setWindowSize(windowSize) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.takeScreenshot = function(imagePath) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

module.exports = Driver;