var format = require('util').format,
    NOT_IMPLEMENTED_EXCEPTION = 'NOT_IMPLEMENTED_EXCEPTION';


/**
 Browser is passed a driver instance or creates one based on a config.
 */

function Driver(config) {}

Driver._checkResultAgainstExpectation = function
    checkResultAgainstExpectation(
    expectation, expectationKeys, msg, result, coerceFn) {

  var errorMsg;
  coerceFn = coerceFn || function(v) { return v; };
  if (expectationKeys) {
    expectationKeys.forEach(function(item) {
      if (coerceFn(result[item]) !== coerceFn(expectation[item])) {
        errorMsg = format(msg, expectation[item], result[item]);
        throw new Error(errorMsg);
      }
    });
    return true;
  }
  // simple
  else if (coerceFn(result) !== coerceFn(expectation)) {
    errorMsg = format(msg, expectation, result);
    throw new Error(errorMsg);
  }
  else {
    return true;
  }
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
  var webdriver;
  switch (webDriverClass) {
    case 'webdriverio':
      webdriver = require('./drivers/webdriverio');
      break;
    default:
      webdriver = require(webDriverClass);
  }
  return webdriver;
};

Driver.getErrorMessage = function(err) {
  var saneErrMessage;
  if (typeof err === 'object') {
    if (err.hasOwnProperty('orgStatusMessage')) {
      saneErrMessage = err.orgStatusMessage;
    }
    else if (err.hasOwnProperty('message')) {
      saneErrMessage = err.message;
    }
  }
  else {
    saneErrMessage = err;
  }
  return saneErrMessage;
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