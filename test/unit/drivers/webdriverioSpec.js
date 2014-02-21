var sinonChai   = require('sinon-chai'),
    chai        = require('chai'),
    sinon       = require('sinon'),
    expect      = chai.expect,
    unroll      = require('unroll'),
    webdriver = require('webdriverjs'),
    Driver      = require('../../../lib/driver.js');
    WebDriverIO = require('../../../lib/drivers/webdriverio.js');

chai.use(sinonChai);

describe('WebDriverIO', function() {
  var config = 'aConfig',
      webdriverStub,
      contextStub;

  describe('should implement Driver interface so', function() {
    //dynamically determine methods to test
    var driverPrototypeMethods = function getDriverPrototypeMethods() {
      var unrollValues = [['method']];
      Object.keys(Driver.prototype).forEach(function(item) {
          unrollValues.push([item]);
        }
      );
      return unrollValues;
    }();

    unroll('method #method should exist',
        function(done, testArgs) {
          var driver;

          driver = new WebDriverIO(config);

          expect(driver[testArgs.method]).to.exist;
          done();
        },
        driverPrototypeMethods
    );
  });
  beforeEach(function() {
    contextStub = sinon.stub({
      getElementSize:         function(){},
      isVisible:              function(){},
      getElementCssProperty:  function(){},
      getCssProperty:         function(){},
      buttonClick:            function(){},
      clearElement:           function(){},
      pause:                  function(){},
      getLocation:            function(){},
      getTagName:             function(){},
      getTitle:               function(){},
      getText:                function(){},
      value:                  function(){},
      getValue:               function(){},
      setValue:               function(){},
      hasValue:               function(){},
      isSelected:             function(){},
      submitForm:             function(){},
      getAttribute:           function(){},
      keys:                   function(){},
      end:                    function(){},
      endAll:                 function(){}
    });

    webdriverStub = sinon.stub({
      init: function() {},
      url: function() {}
    });

  });

  afterEach(function() {
    contextStub = null;
  });

  describe('init()', function() {
    it('should delegate correctly', function() {
      var driver,
          callback = function() {};

      driver = new WebDriverIO(config);
      driver._remoteDriver = webdriverStub;
      driver.init(callback);
      expect(driver._remoteDriver.init).to.have.been.calledWith(callback);
    });
  });

  describe('goTo()', function() {
    it('should delegate correctly', function() {
      var driver,
          url = 'aUrl';

      driver = new WebDriverIO(config);
      driver._remoteDriver = webdriverStub;
      driver.goTo(url);
      expect(driver._remoteDriver.url).to.have.been.calledWith(url);
    });
  });

  describe('value()', function() {
    it('should delegate correctly when getting value', function() {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.value('.selector');
      expect(driver.ctxt.getValue).to.have.been.calledWith('.selector');
    });

    it('should delegate correctly when setting value', function() {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.value('.selector', 'newValue', null, true);
      expect(driver.ctxt.setValue).to.have.been.calledWith('.selector', 'newValue');
    });

  });
  describe('hasValue()', function () {

    it('should delegate correctly', function() {
        var driver;

        driver = new WebDriverIO(config);
        driver.ctxt = contextStub;
        driver.hasValue('.selector', 'newValue');
        expect(driver.ctxt.value).to.have.been.calledWith('.selector', 'newValue');
    });
  });

  describe('keys()', function () {
    it('should delegate correctly when called', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.enter('.selector','enteredInput');
      expect(driver.ctxt.keys).to.have.been.calledWith('.selector', 'enteredInput');
    });
  });

  describe('wait()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.wait('delay');
      expect(driver.ctxt.pause).to.have.been.calledWith('delay');
    });
  });

  describe('klick()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.klick('.selector');
      expect(driver.ctxt.buttonClick).to.have.been.calledWith('.selector');
    });
  });

  describe('submit()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.submit('.selector');
      expect(driver.ctxt.submitForm).to.have.been.calledWith('.selector');
    });
  });

  describe('clear()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.clear('.selector');
      expect(driver.ctxt.clearElement).to.have.been.calledWith('.selector');
    });
  });

  describe('attr()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.attr('.selector', 'attrName');
      expect(driver.ctxt.getAttribute).to.have.been.calledWith('.selector', 'attrName');
    });
  });

  describe('selected()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.selected('.selector');
      expect(driver.ctxt.isSelected).to.have.been.calledWith('.selector');
    });
  });

  describe('text()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.text('.selector');
      expect(driver.ctxt.getText).to.have.been.calledWith('.selector');
    });
  });

  describe('nodeName()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.nodeName('.selector');
      expect(driver.ctxt.getTagName).to.have.been.calledWith('.selector');
    });
  });

  describe('location()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.location('.selector');
      expect(driver.ctxt.getLocation).to.have.been.calledWith('.selector');
    });
  });

  describe('visible()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.visible('.selector');
      expect(driver.ctxt.isVisible).to.have.been.calledWith('.selector');
    });
  });

  describe('invisible()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.invisible('.selector');
      expect(driver.ctxt.isVisible).to.have.been.calledWith('.selector');
    });
  });

  describe('cssProperty()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.cssProperty('.selector', 'width');
      expect(driver.ctxt.getElementCssProperty).to.have.been.calledWith('css selector', '.selector', 'width');
    });
  });

  describe('color()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.color('.selector');
      expect(driver.ctxt.getCssProperty).to.have.been.calledWith('.selector', 'color');
    });
  });

  describe('width()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.width('.selector');
      expect(driver.ctxt.getCssProperty).to.have.been.calledWith('.selector', 'width');
    });
  });

  describe('size()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.size('.selector');
      expect(driver.ctxt.getElementSize).to.have.been.calledWith('.selector');
    });
  });

  describe('getTitle()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.getTitle(null, 'title');
      expect(driver.ctxt.getTitle).to.have.been.calledWith(null, 'title');
    });
  });

  describe('end()', function () {
    it('should delegate correctly', function () {
      var driver,
          callback = function(){};

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.end(callback);
      expect(driver.ctxt.end).to.have.been.calledWith(callback);
    });
  });

  describe('endAll()', function () {
    it('should delegate correctly', function () {
      var driver,
          callback = function(){};

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.endAll(callback);
      expect(driver.ctxt.endAll).to.have.been.calledWith(callback);
    });
  });
});