var format = require('util').format,
    NOT_IMPLEMENTED_EXCEPTION = 'NOT_IMPLEMENTED_EXCEPTION';


/**
 Browser is passed a driver instance or creates one based on a config.
 */

function Driver(config) {}

function deepExpectationCheck(expectationKeys, coerceFn, result, expectation, msg) {
  expectationKeys.forEach(function (item) {
    if (coerceFn(result[item]) !== coerceFn(expectation[item])) {
      throw new Error(format(msg, expectation[item], result[item]));
    }
  });
  return true;
}

function shallowExpectationCheck(coerceFn, result, expectation, msg) {
  if (coerceFn(result) !== coerceFn(expectation)) {
    throw new Error(format(msg, expectation, result));
  }
  return true;
}

Driver._checkResultAgainstExpectation = function checkResultAgainstExpectation(
    expectation,
    expectationKeys,
    msg,
    result,
    coerceFn) {

        coerceFn = coerceFn || function(v) { return v; };

        if (expectationKeys) {
          return deepExpectationCheck(expectationKeys, coerceFn, result, expectation, msg);
        }
        return shallowExpectationCheck(coerceFn, result, expectation, msg);
};

Driver._getExpectationCallback = function _getExpectationCallback(
    expectation, msg, expectationKeys, coerceFn) {

  if (typeof expectation === 'function') { // likely a callback
    return expectation;
  }
  return function(err, result) {
    if (err) {
      throw new Error(Driver.getErrorMessage(err));
    }
    return Driver._checkResultAgainstExpectation(
        expectation, expectationKeys, msg, result, coerceFn
    );
  };
};

Driver.getWebDriver = function getWebDriver(webDriverClass) {
  switch (webDriverClass) {
    case 'webdriverio':
      return require('./drivers/webdriverio');
    default:
      return require(webDriverClass);
  }
};

Driver.getErrorMessage = function(err) {
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

Driver.prototype.width = function width(selector, expectation, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.size = function size(selector, expectation, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.color = function color(selector, expectation, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.visible = function visible(selector, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.invisible = function invisible(selector, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.wait = function wait(delay) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.klick = function klick() {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.clear = function clear() {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.location = function location(selector, expectation, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.nodeName = function nodeName(selector, expectation, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.text = function text(selector, expectation, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.selected = function selected(selector, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.unselected = function selected(selector, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.submit = function submit() {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.value = function value(selector, expectation, coerceFn, doSet) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.attr = function attr(selector, attrName, expectation, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.enter = function enter(selector, keys, coerceFn) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.cssProperty = function cssProperty(selector, property, callback) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.hasValue = function hasValue() {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};
//
Driver.prototype.endAll = function endAll(cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};

Driver.prototype.exists = function exists(cb) {
  throw new Error(NOT_IMPLEMENTED_EXCEPTION);
};
module.exports = Driver;