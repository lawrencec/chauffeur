var Module = require('../lib/module.js'),
    Driver   = require('../lib/driver');

Browser = function(config) {
  var webdriver  = Driver.getWebDriver(config.webDriverClass);
  this._driver = new webdriver(config.webDriverConfig);
};

Browser.prototype = {
  init: function init(cb) {
    this._driver.init(cb || function() {});
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

Browser.Keys = {
  'NULL': '\uE000',
  'CANCEL': '\uE001',
  'HELP': '\uE002',
  'BACKSPACE': '\uE003',
  'TAB': '\uE004',
  'CLEAR': '\uE005',
  'RETURN': '\uE006',
  'ENTER': '\uE007',
  'SHIFT': '\uE008',
  'CONTROL': '\uE009',
  'ALT': '\uE00A',
  'PAUSE': '\uE00B',
  'ESCAPE': '\uE00C',
  'SPACE': '\uE00D',
  'PAGEUP': '\uE00E',
  'PAGEDOWN': '\uE00F',
  'END': '\uE010',
  'HOME': '\uE011',
  'LEFTARROW': '\uE012',
  'UPARROW': '\uE013',
  'RIGHTARROW': '\uE014',
  'DOWNARROW': '\uE015',
  'INSERT': '\uE016',
  'DELETE': '\uE017',
  'SEMICOLON': '\uE018',
  'EQUALS': '\uE019',
  'NUMPAD0': '\uE01A',
  'NUMPAD1': '\uE01B',
  'NUMPAD2': '\uE01C',
  'NUMPAD3': '\uE01D',
  'NUMPAD4': '\uE01E',
  'NUMPAD5': '\uE01F',
  'NUMPAD6': '\uE020',
  'NUMPAD7': '\uE021',
  'NUMPAD8': '\uE022',
  'NUMPAD9': '\uE023',
  'MULTIPLY': '\uE024',
  'ADD': '\uE025',
  'SEPARATOR': '\uE026',
  'SUBTRACT': '\uE027',
  'DECIMAL': '\uE028',
  'DIVIDE': '\uE029',
  'F1': '\uE031',
  'F2': '\uE032',
  'F3': '\uE033',
  'F4': '\uE034',
  'F5': '\uE035',
  'F6': '\uE036',
  'F7': '\uE037',
  'F8': '\uE038',
  'F9': '\uE039',
  'F10': '\uE03A',
  'F11': '\uE03B',
  'F12': '\uE03C',
  'COMMAND': '\uE03D',
  'META': '\uE03D'
};

module.exports = Browser;