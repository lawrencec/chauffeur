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

  resolveWith: function resolve(cb) {
    Driver.resolveWith(cb);
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

  setSize: function setSize(windowSize, callback) {
    this._driver.setSize(windowSize, callback);
    return this;
  },

  getSize: function getSize(callback) {
    this._driver.getSize(callback);
    return this;
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
      var err = new Error('Not at correct page.' );
      err.expected = this._currentPage.title;
      err.actual = title;
      callback.call(this._currentPage, err);
      return true;
    }
    return false;
  },

  _errCallbackIfTitleError: function (err, callback) {
    if (err) {
      callback.call(this._currentPage, new Error(err));
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

Browser.sizes = {
  DESKTOP                           : {width: 1024, height: 728},
  DESKTOP_LARGE                     : {width: 1280, height: 1024},
  DESKTOP_EXTRA_LARGE               : {width: 1920, height: 1080},
  IPAD                              : {width: 768, height: 1024},
  IPAD_LANDSCAPE                    : {width: 1024, height: 728},
  IPAD_2                            : {width: 768, height: 1024},
  IPAD_2_LANDSCAPE                  : {width: 1024, height: 728},
  IPAD_3                            : {width: 1536, height:2048},
  IPAD_3_LANDSCAPE                  : {width: 2048, height:1536},
  IPAD_4                            : {width: 1536, height: 2048},
  IPAD_4_LANDSCAPE                  : {width: 2048, height:1536},
  IPAD_MINI                         : {width: 768, height: 1024},
  IPAD_MINI_LANDSCAPE               : {width: 1024, height: 728},
  IPHONE                            : {width: 320, height: 480},
  IPHONE_LANDSCAPE                  : {width: 480, height: 320},
  IPHONE_4                          : {width: 640, height: 960},
  IPHONE_4_LANDSCAPE                : {width: 960, height: 640},
  IPHONE_4S                         : {width: 640, height: 960},
  IPHONE_4S_LANDSCAPE               : {width: 960, height: 640},
  IPHONE_5                          : {width: 640, height: 1136},
  IPHONE_5_LANDSCAPE                : {width: 1136, height: 640},
  IPOD_TOUCH                        : {width: 320, height: 480},
  IPOD_TOUCH_LANDSCAPE              : {width: 480, height: 320},
  BLACKBERRY_Z10                    : {width: 1280, height: 768},
  BLACKBERRY_Z10_LANDSCAPE          : {width: 768, height: 1280},
  ASUS_NEXUS_4                      : {width: 1280, height:768},
  ASUS_NEXUS_4_LANDSCAPE            : {width: 768, height:1280},
  ASUS_NEXUS_7_2012                 : {width: 1280, height:800},
  ASUS_NEXUS_7_2012_LANDSCAPE       : {width: 800, height:1280},
  ASUS_NEXUS_7_2013                 : {width: 1920, height:1200},
  ASUS_NEXUS_7_2013_LANDSCAPE       : {width: 1200, height:1920},
  HTC_DESIRE_HD                     : {width: 480, height:800},
  HTC_DESIRE_HD_LANDSCAPE           : {width: 800, height:480},
  HTC_ONE                           : {width: 1920, height:1018},
  HTC_ONE_LANDSCAPE                 : {width: 1018, height:1920},
  HTC_ONE_XXL                       : {width: 720, height:1280},
  HTC_ONE_XXL_LANDSCAPE             : {width: 1280, height:720},
  LG_NEXUS_4                        : {width: 768, height:1280},
  LG_NEXUS_4_LANDSCAPE              : {width: 1280, height:768},
  LG_OPTIMUS_G_PRO                  : {width: 1920, height:1080},
  LG_OPTIMUS_G_PRO_LANDSCAPE        : {width: 1080, height:1920},
  MICROSOFT_SURFACE                 : {width: 1366, height:768},
  MICROSOFT_SURFACE_LANDSCAPE       : {width: 768, height:1366},
  MICROSOFT_SURFACE_PRO             : {width: 1920, height:1080},
  MICROSOFT_SURFACE_PRO_LANDSCAPE   : {width: 1080, height:1920},
  SAMSUNG_GALAXY_S2                 : {width: 480, height:800},
  SAMSUNG_GALAXY_S2_LANDSCAPE       : {width: 800, height:480},
  SAMSUNG_GALAXY_S3                 : {width: 720, height:1280},
  SAMSUNG_GALAXY_S3_LANDSCAPE       : {width: 1280, height:720},
  SAMSUNG_GALAXY_S4                 : {width: 1920, height:1080},
  SAMSUNG_GALAXY_S4_LANDSCAPE       : {width: 1080, height:1920},
  SAMSUNG_GALAXY_NOTE_II            : {width: 1280, height:720},
  SAMSUNG_GALAXY_NOTE_II_LANDSCAPE  : {width: 720, height:1280},
  SAMSUNG_GALAXY_NOTE_10_1          : {width: 1280, height:800},
  SAMSUNG_GALAXY_NOTE_10_1_LANDSCAPE: {width: 800, height:1280},
  SONY_XPERIA_Z                     : {width: 1920, height:1080},
  SONY_XPERIA_Z_LANDSCAPE           : {width: 1080, height:1920}
};


module.exports = Browser;