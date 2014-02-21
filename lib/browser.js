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

  to: function to(page) {
    var url = this._resolveProperty(page, 'url');
    return this.goTo(url);
  },

  at: function at(pageClass, callback) {
    this._currentPage = new pageClass();
    this._currentPage.init(this._driver);
    this._driver.getTitle(function getTitleCallback(err, title) {
      if (err) {
        callback.call(this._currentPage, err);
      }
      else if (pageClass.wait === 0 && !this._currentPage.at(title)) {
        callback.call(this._currentPage, 'Not at correct page. Expected "' + this._currentPage.title + '" but found "'+ title +' "');
      }
      else {
        this._currentPage.init(this._driver);
        callback.call(this._currentPage);
      }
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

  _resolveProperty: function _resolveProperty(obj, propertyName) {
    var prop = obj;
    if (typeof prop !== 'string') {
      prop = obj[propertyName] || obj.prototype[propertyName];
    }
    return prop;
  }
};

module.exports = Browser;