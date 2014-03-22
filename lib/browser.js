var Module = require('../lib/module.js'),
    Driver   = require('../lib/driver');

Browser = function(config) {
  var webdriver  = Driver.getWebDriver(config.webDriverClass);
  this._driver = new webdriver(config.webDriverConfig);
};

Browser.prototype = {
  init: function init(cb) {
    this._driver.init(cb);
  },

  to: function to(page, params) {
    var url = this._resolveProperty(page, 'url'),
        resolvedUrl = (params) ? this._resolveParams(url, params) : url;

    return this.goTo(resolvedUrl);
  },

  at: function at(pageClass, callback) {
    this._currentPage = new pageClass();
    this._currentPage.init(this._driver);

    this._driver.getTitle(function getTitleCallback(err, title) {
      var erred = this._errCallbackIfTitleError(err, callback);
      erred = erred || this._errCallbackIfAtIncorrectPage(pageClass, callback, title);
      return erred || this._successCallbackAtCorrectPage(callback);
    }.bind(this));

    return this;
  },
  goTo: function goTo(url) {
    this._driver.goTo(url);
    return this;
  },

  end: function end(done) {
    return this._driver.end(done);
  },

  endAll: function endAll(done) {
    return this._driver.endAll(done);
  },

  _resolveParams: function(url, params) {
    if (!params) {
      return url;
    }
    Object.keys(params).forEach(function(paramKey) {
      var token = '{' + paramKey + '}';
      url = url.replace(token, params[paramKey], 'g');
    });
    return url;
  },

  _resolveProperty: function _resolveProperty(obj, propertyName) {
    if (typeof obj !== 'string') {
      obj = obj[propertyName];
    }
    return obj;
  },

  _errCallbackIfAtIncorrectPage: function (pageClass, callback, title) {
    if (pageClass.wait === 0 && !this._currentPage.at(title)) {
      callback.call(this._currentPage, 'Not at correct page. Expected "' + this._currentPage.title + '" but found "' + title + ' "');
      return true;
    }
    return false;
  },

  _errCallbackIfTitleError: function (err, callback) {
    if (err) {
      callback.call(this._currentPage, err);
      return true;
    }
    return false;
  },

  _successCallbackAtCorrectPage: function (callback) {
    this._currentPage.init(this._driver);
    callback.call(this._currentPage);
    return true;
  }
};

module.exports = Browser;