var inherits = require('util').inherits,
    Driver = require('../driver'),
    ERROR_MSGS = require('../errors'),
    webdriver = require('selenium-webdriver');

function WebDriverJS(config) {
  var browserName = config.desiredCapabilities.browserName;
  this._remoteDriverBuilder = new webdriver.Builder()
                            .withCapabilities(webdriver.Capabilities[browserName]());
}

inherits(WebDriverJS, Driver);

WebDriverJS.prototype = {
  _delegate: function _delegate(selector, callback, method, methodArgs) {
    var context;
    methodArgs = methodArgs || [];
    context = this._remoteDriver.findElement(webdriver.By.css(selector));
    context
      .then(function(element) {
        element[method](methodArgs)
          .then(function(value) {
            callback(null, value);
          })
        .then(null, function errorDelegating(err) {
          callback(err);
        });
      })
      .then(null, function errorFindingElement(err) {
        callback(err);
      });
    return context;
  },

  init: function init(cb) {
    this._remoteDriver = this._remoteDriverBuilder.build(); //move to constructor?
    cb();
  },

  goTo: function goTo(url) {
    this._remoteDriver.get(url);
  },

  getTitle: function getTitle(cb) {
    this._remoteDriver.getTitle()
      .then(function(title) {
        cb(null, title);
      })
      .then(null, function(err) {
        cb(err);
      });
  },

  location: function location(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.LOCATION_MISMATCH, selector),
        ['x','y'],
        coerceFn,
        cb
    );

    this.ctxt = this._delegate(selector, callback, 'getLocation');
  },

  size: function size(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.SIZE_MISMATCH, selector),
        ['width','height'],
        coerceFn,
        cb
    );
    this.ctxt = this._delegate(selector, callback, 'getSize');
  },

  width: function width(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.WIDTH_MISMATCH, selector),
        null,
        coerceFn || parseFloat,
        cb
    ).bind(this);

    this.ctxt = this.cssProperty(selector, 'width', callback);
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
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'getCssValue', 'color');
  },

  visible: function visible(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.VISIBLE_MISMATCH, selector),
        null,
        coerceFn,
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'isDisplayed');
  },

  invisible: function invisible(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        false,
        ERROR_MSGS.resolve(ERROR_MSGS.INVISIBLE_MISMATCH, selector),
        null,
        coerceFn,
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'isDisplayed');
  },

  wait: function wait(delay) {
    this._remoteDriver.wait(function(v){return true;}, delay);

  },

  klick: function klick(selector, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.CLICK_UNSUCCESSFUL, selector),
        null,
        function(v) { return v === "" || true;},
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'click');

  },

  doubleklick: function doubleklick(selector, expectation, coerceFn, cb) {
    var element;

    element = this._remoteDriver.findElement(webdriver.By.css(selector));
    this.ctxt = new webdriver.ActionSequence(this._remoteDriver)
        .doubleClick(element)
        .perform();
  },

  clear: function clear(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.CLEARANCE_UNSUCCESSFUL, selector),
        null,
        coerceFn || function(v) {
          return v === "" || true;
        },
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'clear');

  },

  nodeName: function nodeName(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.NODENAME_MISMATCH, selector),
        null,
        coerceFn,
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'getTagName');

  },

  text: function text(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.TEXT_MISMATCH, selector),
        null,
        coerceFn,
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'getText');

  },

  selected: function selected(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.SELECTED_MISMATCH, selector),
        null,
        coerceFn,
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'isSelected');
  },

  unselected: function unselected(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        false,
        ERROR_MSGS.resolve(ERROR_MSGS.UNSELECTED_MISMATCH, selector),
        null,
        coerceFn,
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'isSelected');
  },

  submit: function submit(selector, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.SUBMIT_UNSUCCESSFUL, selector),
        null,
        function(v) { return v === "" || true;},
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'submit');

  },

  value: function value(selector, expectation, coerceFn, cb) {
    this.attr(selector, 'value', expectation, coerceFn, cb);
  },

  attr: function attr(selector, attrName, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.resolve(ERROR_MSGS.ATTRIBUTE_MISMATCH, selector),
        null,
        coerceFn,
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'getAttribute', attrName);
  },

  setValue: function setValue(selector, expectation, coerceFn, cb) {
    this.clear(selector, null, null, function() {
      var element = this._remoteDriver.findElement(webdriver.By.css(selector));
      this.ctxt = new webdriver.ActionSequence(this._remoteDriver)
          .click(element)
          .sendKeys(expectation)
          .perform();
      }.bind(this)
    );
  },

  exists: function exists(selector, expectation, coerceFn, cb) {
    var shouldExist = (expectation === undefined) ? true : expectation,
        shouldExistErr = (shouldExist) ? ERROR_MSGS.EXISTENCE_MISMATCH : ERROR_MSGS.NON_EXISTENCE_MISMATCH,
        callback = Driver._getExpectationCallback(
        shouldExist,
        ERROR_MSGS.resolve(shouldExistErr, selector),
        null,
        coerceFn,
        cb
    ).bind(this);

    this.ctxt = this._remoteDriver.findElement(webdriver.By.css(selector))
        .then(function(value) {
          callback(null, true);
        })
        .then(null, function(err) {
          if (err && err.state == 'no such element') {
            callback(null, false);
          }
          else {
            callback(err);
          }
        });

  },

  elements: function elements(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        'Todo',
        null,
        coerceFn,
        cb
    ).bind(this);

    var context = this._remoteDriver.findElements(webdriver.By.css(selector));
    context.then(function(result) {
        callback(null, result.length);
      })
      .then(null, function(err) {
        if (err && err.state == 'no such element') {
          callback(null, false);
        }
        else {
          callback(err);
        }
      });
    return context;
  },

  hasntClass: function hasntClass(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.HASNT_CLASS_MISMATCH, selector),
        null,
        function hasntClassCoerceFn(result) {
          if (result.split) {
            return (result.split(' ').indexOf(expectation) === -1);
          }
          return result;
        },
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'getAttribute', 'class');

  },

  hasClass: function hasCass(selector, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        true,
        ERROR_MSGS.resolve(ERROR_MSGS.HAS_CLASS_MISMATCH, selector),
        null,
        function hasClassCoerceFn(result) {
          if (result.split) {
            return (result.split(' ').indexOf(expectation) !== -1);
          }
          return result;
        },
        cb
    ).bind(this);

    this.ctxt = this._delegate(selector, callback, 'getAttribute', 'class');
  },

  moveTo: function moveTo(selector) {
    var element;

    element = this._remoteDriver.findElement(webdriver.By.css(selector));

    this.ctxt = new webdriver.ActionSequence(this._remoteDriver)
        .mouseMove(element)
        .perform();
  },

  hover: function hover(selector) {
    this.moveTo(selector);
  },

  back: function back() {
    var navigation = new webdriver.WebDriver.Navigation(this._remoteDriver);
    this.ctxt = navigation.back();
  },

  forward: function forward(selector, expectation, coerceFn, cb) {
    var navigation = new webdriver.WebDriver.Navigation(this._remoteDriver);
    this.ctxt = navigation.forward();

  },

  executeScript: function executeScript(script, expectation, coerceFn, cb) {
    var callback = Driver._getExpectationCallback(
        expectation,
        ERROR_MSGS.SCRIPT_RESULT_MISMATCH,
        null,
        coerceFn,
        cb
    ).bind(this);

    this.ctxt = this._remoteDriver.executeScript(script)
        .then(function(result) {
          callback(null, result);
        })
        .then(null, function(err) {
          callback(err);
        });

  },

  cssProperty: function cssProperty(selector, property, callback) {
    return this._delegate(selector, callback, 'getCssValue', [property]);
  },

  end: function end() {
    if (this.ctxt && this.ctxt.isPending()) {
      this.ctxt.thenFinally(function () {
        this._closeWhenFinished();
      }.bind(this));
    }
    else {
      this._closeWhenFinished();
    }
  },

  endAll: function end() {
    this._closeWhenFinished();
  },

  _closeWhenFinished: function _closeWhenFinished() {
    if (this._remoteDriver.session_) {
      this._remoteDriver.quit()
          .then(function() {
            this.ctxt = null;
            Driver.resolve();
          }.bind(this));
    }
    else {
      Driver.resolve();
    }
  }
};

module.exports = WebDriverJS;