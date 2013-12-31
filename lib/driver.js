var Module = require('../lib/module.js'),
    format = require('util').format;

Driver = function(remoteDriver) {
  this._remoteDriver = remoteDriver;
};
Driver._checkResultAgainstExpectation = function _checkResultAgainstExpectation(expectation, expectationKeys, msg, result, coerceFn) {
  var errorMsg;
  coerceFn = coerceFn || function(v) { return v; };
  if (expectationKeys) {
    expectationKeys.forEach(function(item) {
      if (coerceFn(result[item]) !== coerceFn(expectation[item])) {
        errorMsg = format(msg, expectation[item], result[item]);
        throw new Error(errorMsg);
      }
    });
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
      throw new Error(err);
    }
    return Driver._checkResultAgainstExpectation(
        expectation, expectationKeys, msg, result, coerceFn
    );
  };
};

Driver.prototype = {
  init: function init(cb) {
    this._remoteDriver.init(cb);
  },

  to: function to(page) {
    var url = this._resolveProperty(page, 'url');
    return this.goTo(url);
  },

  at: function at(pageClass, callback) {
    this._currentPage = new pageClass();
    this._currentPage.init();
    this.ctxt.getTitle(function getTitleCallback(err, title) {
      if (err) {
        callback.call(this.ctxt, err);
      }
      else if (pageClass.wait === 0 && !this._currentPage.at(title)) {
        callback.call(this.ctxt, 'Not at correct page. Expected "' + this._currentPage.title + '" but found "'+ title +' "');
      }
      else {
        this._currentPage.initialiseContent(this.ctxt);

        callback.call(this.ctxt);
      }
    }.bind(this));
    return this.ctxt;
  },
  goTo: function goTo(url) {
    this.ctxt = this._remoteDriver.url(url);
    return this;
  },

  end: function end(done) {
    return this._remoteDriver.end(done);
  },

  endAll: function endAll(done) {
    return this._remoteDriver.endAll(done);
  },

  _resolveProperty: function _resolveProperty(obj, propertyName) {
    var prop = obj;
    if (typeof prop !== 'string') {
      prop = obj[propertyName] || obj.prototype[propertyName];
    }
    return prop;
  }
};

module.exports = Driver;