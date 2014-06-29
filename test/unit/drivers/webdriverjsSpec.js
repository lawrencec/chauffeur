var sinonChai   = require('sinon-chai'),
    chai        = require('chai'),
    sinon       = require('sinon'),
    expect      = chai.expect,
    unroll      = require('unroll'),
    Driver      = require('../../../lib/driver.js');
    WebDriverJS = require('../../../lib/drivers/webdriverjs.js'),
    seleniumWD  = require('selenium-webdriver'),
    expectedError = require('../../testConfig').expectedError;
    expectToFailWithError = require('../../testConfig').expectToFailWithError;

chai.use(sinonChai);

describe('WebDriverJS', function() {
  var config = {},
      webdriverBuilderStub,
      contextStub;

  beforeEach(function() {
    config.desiredCapabilities = {
      browserName: 'phantomjs'
    };
    webdriverBuilderStub = sinon.stub({
      build: function() {
        return webdriverStub;
      }
    });

    webdriverStub = sinon.stub({
      get:          function() {},
      getLocation:  function() {},
      size:         function() {},
      getTitle:     function() {},
      quit:         function() {},
      wait:         function() {},
      findElement:  function() {},
      findElements: function() {},
      executeScript:function() {}
    });

  });

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

          driver = new WebDriverJS(config);

          expect(driver[testArgs.method]).to.exist;
          done();
        },
        driverPrototypeMethods
    );
  });

  afterEach(function() {
    contextStub = null;
  });

  describe('init()', function() {
    it('should delegate correctly', function() {
      var driver,
          callback = sinon.spy();

      driver = new WebDriverJS(config);
      driver._remoteDriverBuilder = webdriverBuilderStub;
      driver.init(callback);
      expect(driver._remoteDriverBuilder.build).to.have.been.calledOnce;
      expect(callback).to.have.been.calledOnce;
    });
  });

  describe('goTo()', function() {
    it('should delegate correctly', function() {
      var driver,
          url = 'aUrl';

      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      driver.goTo(url);
      expect(driver._remoteDriver.get).to.have.been.calledWith(url);
    });
  });

  describe('location()', function () {
    it('should delegate correctly', function () {
      var driver,
          delegateStub;

      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
      driver.location('.selector');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'getLocation');
    });

    unroll('should errback correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverJS(config);
          sinon.stub(driver, '_delegate');
          expectToFailWithError(
              function () {
                driver.location('.selector', {x:3,y:43}, null, null);
                driver._delegate.yield(null, testArgs.result);
              },

              function (error) {
                expect(error.message).to.equal(testArgs.expectation.message);
                expect(error.expected).to.eql(testArgs.expectation.expected);
                expect(error.actual).to.eql(testArgs.expectation.actual);
                next();
              }
          );
        },
        [
          ['result'   , 'expectation'],
          [{x:0,y:0}  , expectedError('Location values do not match for selector ".selector".', {x:3,y:43}, {x:0,y:0})],
          [{x:3,y:0}  , expectedError('Location values do not match for selector ".selector".', {x:3,y:43}, {x:3,y:0})],
          [{x:0,y:43} , expectedError('Location values do not match for selector ".selector".', {x:3,y:43}, {x:0,y:43})]
        ]
    );
  });

  describe('size()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.size('.selector', {width: "100", height: "90"}, null, null);
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'getSize');
    });

    unroll('should errback correctly for #result',
        function (next, testArgs) {

          expectToFailWithError(
              function() {
                driver.size('.selector', {width: '100', height: '200'}, null, null);
                delegateStub.yield(null, testArgs.result);
              },
              function(error) {
                expect(error.message).to.equal(testArgs.expected.message);
                expect(error.expected).to.eql(testArgs.expected.expected);
                expect(error.actual).to.eql(testArgs.expected.actual);
                next();
              }
          );
        },
        [
          ['result'                          , 'expected'],
          [{width: '1000', height: '1000'}   , expectedError('Size values do not match for selector ".selector".', {width: '100', height: '200'}, {width: '1000', height: '1000'})],
          [{width: '1000', height: '200'}    , expectedError('Size values do not match for selector ".selector".', {width: '100', height: '200'}, {width: '1000', height: '200'})],
          [{width: '100' , height: '1000'}   , expectedError('Size values do not match for selector ".selector".', {width: '100', height: '200'}, {width: '100', height: '1000'})]
        ]
    );
  });

  describe('width()', function() {
    var driver,
        cssPropertyStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      cssPropertyStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.width('.selector', 100);
      expect(cssPropertyStub).to.have.been.calledWith('.selector', sinon.match.func);
    });

    it('should errback correctly if incorrect', function (next) {
      expectToFailWithError(
          function() {
            driver.width('.selector', 100, null, null);
            cssPropertyStub.yield(null, 1000);
          },
          function(error) {
            expect(error.message).to.equal('Width values do not match for selector ".selector".');
            expect(error.expected).to.eql(100);
            expect(error.actual).to.eql(1000);
            next();
          }
      );
    });
  });

  describe('color()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.color('.selector', '#fff000', null, null);
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'getCssValue', 'color');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.color('.selector', '#FFFFFF');
            delegateStub.yield(null, '#FFFFFEE');
          },
          function (error) {
            expect(error.message).to.equal('Color values do not match for selector ".selector".');
            expect(error.expected).to.eql('#FFFFFF');
            expect(error.actual).to.eql('#FFFFFEE');
          }
      );
    });
  });

  describe('visible()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.visible('.selector');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'isDisplayed');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.visible('.selector');
            delegateStub.yield(null, false);
          },
          function (error) {
            expect(error.message).to.equal('Visibility values do not match for selector ".selector".');
            expect(error.expected).to.eql(true);
            expect(error.actual).to.eql(false);
          }
      );
    });
  });

  describe('invisible()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.invisible('.selector');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'isDisplayed');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.invisible('.selector');
            delegateStub.yield(null, true);
          },
          function (error) {
            expect(error.message).to.equal('Invisibility values do not match for selector ".selector".');
            expect(error.expected).to.eql(false);
            expect(error.actual).to.eql(true);
          }
      );
    });
  });

  describe('klick()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.klick('.selector');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'click');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.klick('.selector');
            delegateStub.yield(null, false);
          },
          function (error) {
            expect(error.message).to.equal('Click unsuccessful for element with selector ".selector".');
            expect(error.expected).to.eql(true);
            expect(error.actual).to.eql(false);
          }
      );
    });
  });

  describe('doubleklick()', function () {
    var driver,
        byCssStub,
        actionSeqStub;

    beforeEach(function () {
      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      byCssStub = sinon.stub(seleniumWD.By, 'css');
      actionSeqStub = sinon.stub(seleniumWD, 'ActionSequence');
    });

    afterEach(function() {
      byCssStub.restore();
      actionSeqStub.restore();
    });

    it('should delegate correctly', function () {
      actionSeqStub.returns({
        doubleClick: sinon.stub().returns({
          perform: sinon.stub()
        })
      });

      driver.doubleklick('.selector');
      expect(byCssStub).to.have.been.calledWithExactly('.selector');
      expect(actionSeqStub).to.have.been.calledOnce;
    });
  });

  describe('moveTo()', function () {
    var driver,
        byCssStub,
        actionSeqStub;

    beforeEach(function () {
      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      byCssStub = sinon.stub(seleniumWD.By, 'css');
      actionSeqStub = sinon.stub(seleniumWD, 'ActionSequence');
    });

    afterEach(function() {
      byCssStub.restore();
      actionSeqStub.restore();
    });

    it('should delegate correctly', function () {
      actionSeqStub.returns({
        mouseMove: sinon.stub().returns({
          perform: sinon.stub()
        })
      });

      driver.moveTo('.selector');
      expect(byCssStub).to.have.been.calledWithExactly('.selector');
      expect(actionSeqStub).to.have.been.calledOnce;
    });
  });

  describe('hover()', function () {
    var driver;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
    });

    it('should delegate correctly', function () {
      driver.moveTo = sinon.spy();
      driver.hover('.selector');
      expect(driver.moveTo).to.have.been.calledWith('.selector');
    });
  });

  describe('clear()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.clear('.selector');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'clear');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.clear('.selector');
            delegateStub.yield(null, false);
          },
          function (error) {
            expect(error.message).to.equal('Values not cleared for element with selector ".selector".');
            expect(error.expected).to.eql(true);
            expect(error.actual).to.eql(false);
          }
      );
    });
  });

  describe('nodeName()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.nodeName('.selector');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'getTagName');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.nodeName('.selector', 'span');
            delegateStub.yield(null, 'div');
          },
          function (error) {
            expect(error.message).to.equal('Node name does not match selector ".selector".');
            expect(error.expected).to.eql('span');
            expect(error.actual).to.eql('div');
          }
      );
    });
  });

  describe('text()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.text('.selector');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'getText');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.text('.selector', 'some text');
            delegateStub.yield(null, 'another text');
          },
          function (error) {
            expect(error.message).to.equal('Text values do not match for selector ".selector".');
            expect(error.expected).to.eql('some text');
            expect(error.actual).to.eql('another text');
          }
      );
    });
  });

  describe('wait()', function () {
    var driver;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
    });

    it('should delegate correctly', function () {
      driver.wait(1000);
      expect(driver._remoteDriver.wait).to.have.been.calledWithExactly(sinon.match.func, 1000);

    });
  });

  describe('selected()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.selected('.selector');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'isSelected');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.selected('.selector');
            delegateStub.yield(null, false);
          },
          function (error) {
            expect(error.message).to.equal('Expected element with selector ".selector" to be selected.');
            expect(error.expected).to.eql(true);
            expect(error.actual).to.eql(false);
          }
      );
    });
  });

  describe('unselected()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.unselected('.selector');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'isSelected');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.unselected('.selector');
            delegateStub.yield(null, true);
          },
          function (error) {
            expect(error.message).to.equal('Expected element with selector ".selector" to be unselected.');
            expect(error.expected).to.eql(false);
            expect(error.actual).to.eql(true);
          }
      );
    });
  });

  describe('submit()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.submit('.selector');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'submit');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.submit('.selector');
            delegateStub.yield(null, false);
          },
          function (error) {
            expect(error.message).to.equal('Submit unsuccessful for element with selector ".selector".');
            expect(error.expected).to.eql(true);
            expect(error.actual).to.eql(false);
          }
      );
    });
  });

  describe('attr()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.attr('.selector', 'id');
      expect(delegateStub).to.have.been.calledWith('.selector', sinon.match.func, 'getAttribute', 'id');
    });

    it('should errback correctly', function() {
      expectToFailWithError(
          function () {
            driver.attr('.selector', 'id', 'foo');
            delegateStub.yield(null, 'bar');
          },
          function (error) {
            expect(error.message).to.equal('Expected attribute with selector ".selector" to exist.');
            expect(error.expected).to.eql('foo');
            expect(error.actual).to.eql('bar');
          }
      );
    });
  });

  describe('hasClass()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.hasClass('.selector');
      expect(delegateStub).to.have.been.calledWithExactly('.selector', sinon.match.func, 'getAttribute', 'class');
    });

    unroll('should errback correctly',
        function (next, testArgs) {

          expectToFailWithError(
              function () {
                driver.hasClass('.selector', '.className', null, null);
                delegateStub.yield(null, testArgs.result);
              },

              function (error) {
                expect(error.message).to.equal(testArgs.expectation.message);
                expect(error.expected).to.equal(testArgs.expectation.expected);
                expect(error.actual).to.equal(testArgs.expectation.actual);
                next();
              }
          );
        },
        [
          ['result'          , 'expectation'],
          [".incorrect"      , expectedError('Expected class with selector ".selector" to exist.',true, false)],
          [".incorrect .foo" , expectedError('Expected class with selector ".selector" to exist.',true, false)]
        ]
    );
  });

  describe('hasntClass()', function () {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.hasntClass('.selector');
      expect(delegateStub).to.have.been.calledWithExactly('.selector', sinon.match.func, 'getAttribute', 'class');
    });

    unroll('should errback correctly',
        function (next, testArgs) {

          expectToFailWithError(
              function () {
                driver.hasntClass('.selector', '.className', null, null);
                delegateStub.yield(null, testArgs.result);
              },

              function (error) {
                expect(error.message).to.equal(testArgs.expectation.message);
                expect(error.expected).to.equal(testArgs.expectation.expected);
                expect(error.actual).to.equal(testArgs.expectation.actual);
                next();
              }
          );
        },
        [
          ['result'                 , 'expectation'],
          [".className"             , expectedError('Expected class with selector ".selector" to not exist.', true, false)],
          [".incorrect .className"  , expectedError('Expected class with selector ".selector" to not exist.', true, false)]
        ]
    );
  });

  describe('getTitle()', function () {
    it('should delegate correctly', function () {
      var driver,
          getTitlePromise = seleniumWD.promise.fulfilled('aTitle'),
          callback = sinon.spy();

      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      driver._remoteDriver.getTitle.returns(getTitlePromise);
      driver.getTitle(callback);
      expect(driver._remoteDriver.getTitle).to.have.been.calledOnce;
      expect(callback).to.have.been.calledWithExactly(null, 'aTitle');
    });

    it('should error correctly', function () {
      var driver,
          getTitlePromise = seleniumWD.promise.rejected('anError'),
          callback = sinon.spy();

      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      driver._remoteDriver.getTitle.returns(getTitlePromise);
      driver.getTitle(callback);
      expect(driver._remoteDriver.getTitle).to.have.been.calledOnce;
      expect(callback).to.have.been.calledWithExactly('anError');
    });
  });

  describe('end()', function () {
    var driver,
        resolveSpy;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      driver.ctxt = {
        isPending: sinon.stub(),
        thenFinally: sinon.stub()
      };
      resolveSpy = sinon.spy(Driver, 'resolve');
    });

    afterEach(function() {
      resolveSpy.restore();
    });

    it('should delegate correctly when all actions are not finished', function () {

      driver.ctxt.isPending.returns(true);
      driver.ctxt.thenFinally.yields();
      driver._remoteDriver = webdriverStub;
      driver._remoteDriver.session_ = {};

      driver._remoteDriver.quit.returns(seleniumWD.promise.fulfilled());
      driver.end();
      expect(driver._remoteDriver.quit).to.have.been.calledOnce;
      expect(driver.ctxt).to.equal(null);
      expect(resolveSpy).to.have.been.calledOnce;
    });

    it('should delegate correctly when all actions are finished', function () {
      driver.ctxt.isPending.returns(false);
      driver._remoteDriver = webdriverStub;
      driver._remoteDriver.session_ = {};
      driver._remoteDriver.quit.returns(seleniumWD.promise.fulfilled());
      driver.end();
      expect(driver._remoteDriver.quit).to.have.been.calledOnce;
      expect(driver.ctxt).to.equal(null);
      expect(resolveSpy).to.have.been.calledOnce;
    });
  });

  describe('endAll()', function () {
    var driver,
        resolveSpy;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      driver.ctxt = {
        isPending: sinon.stub(),
        thenFinally: sinon.stub()
      };
      resolveSpy = sinon.spy(Driver, 'resolve');
    });

    afterEach(function() {
      resolveSpy.restore();
    });

    it('should delegate correctly', function () {
      driver.ctxt.thenFinally.returns(false);
      driver._remoteDriver = webdriverStub;
      driver._remoteDriver.session_ = {};
      driver._remoteDriver.quit.returns(seleniumWD.promise.fulfilled());
      driver.endAll();
      expect(driver._remoteDriver.quit).to.have.been.calledOnce;
      expect(driver.ctxt).to.equal(null);
      expect(resolveSpy).to.have.been.calledOnce;
    });

    it('should delegate correctly when not in session', function () {
      driver.ctxt.thenFinally.returns(false);
      driver._remoteDriver = webdriverStub;
      driver.endAll();
      expect(resolveSpy).to.have.been.calledOnce;
    });
  });

  describe('value()', function() {
    var driver,
        delegateStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      delegateStub = sinon.stub(driver, '_delegate');
    });

    it('should delegate correctly', function () {
      driver.value('.selector');
      expect(delegateStub).to.have.been.calledWithExactly('.selector', sinon.match.func, 'getAttribute', 'value');
    });
  });

  describe('setValue()', function () {
    var driver,
        actionSeqStub;

    beforeEach(function () {
      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      actionSeqStub = sinon.stub(seleniumWD, 'ActionSequence');
    });

    afterEach(function() {
      actionSeqStub.restore();
    });

    it('should delegate correctly', function () {
      var delegateStub = sinon.stub(driver, 'clear');

      actionSeqStub.returns({
        click: sinon.stub().returns({
          sendKeys: sinon.stub().returns({
            perform: sinon.stub()
          })
        })
      });

      driver.setValue('.selector');
      delegateStub.yield();
      expect(actionSeqStub).to.have.been.calledOnce;
    });
  });

  describe('exists()', function() {
    var driver,
        byCssStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      byCssStub = sinon.stub(seleniumWD.By, 'css');
    });

    afterEach(function() {
      byCssStub.restore();
    });

    it('should delegate correctly', function () {
      var findElementPromise = seleniumWD.promise.fulfilled(true);

      driver._remoteDriver.findElement.returns(findElementPromise);
      driver.exists('.selector');
      expect(driver._remoteDriver.findElement).to.have.been.calledOnce;
      expect(byCssStub).to.have.been.calledWithExactly('.selector');
    });

    unroll('should error correctly when error is #error',
      function (done, testArgs) {
        var driver,
            findElementPromise = seleniumWD.promise.rejected(testArgs.error);

        driver = new WebDriverJS(config);
        driver._remoteDriver = webdriverStub;
        driver._remoteDriver.findElement.returns(findElementPromise);
        driver.exists('.selector');
        expect(driver._remoteDriver.findElement).to.have.been.calledOnce;
        done();
      },
      [
        ['error'],
        [{state: 'no such element'}],
        ['anError']
      ]
    );
  });

  describe('back()', function () {
    var driver,
        navigationStub;

    beforeEach(function () {
      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      navigationStub = sinon.stub(seleniumWD.WebDriver, 'Navigation');
    });

    afterEach(function() {
      navigationStub.restore();
    });

    it('should delegate correctly', function () {
      navigationStub.returns({
        back: sinon.spy()
      });

      driver.back();
      expect(navigationStub).to.have.been.calledOnce;
    });
  });

  describe('forward()', function () {
    var driver,
        navigationStub;

    beforeEach(function () {
      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      navigationStub = sinon.stub(seleniumWD.WebDriver, 'Navigation');
    });

    afterEach(function() {
      navigationStub.restore();
    });

    it('should delegate correctly', function () {
      navigationStub.returns({
        forward: sinon.spy()
      });

      driver.forward();
      expect(navigationStub).to.have.been.calledOnce;
    });
  });

  describe('executeScript()', function () {
    var driver,
        executeScriptPromise = seleniumWD.promise.fulfilled(2);

    beforeEach(function () {
      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      driver._remoteDriver.executeScript.returns(executeScriptPromise);
    });

    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      driver.executeScript('function() { return 1;}', 2);
      expect(driver._remoteDriver.executeScript).to.have.been.calledWith('function() { return 1;}');
    });


    it('should error correctly', function () {
      var driver,
          executeScriptPromise = seleniumWD.promise.rejected(1);

      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      driver._remoteDriver.executeScript.returns(executeScriptPromise);
      driver.executeScript('function() { return 1;}', 2);
      expect(driver._remoteDriver.executeScript).to.have.been.calledOnce;
    });
  });

  describe('elements()', function() {
    var driver,
        byCssStub;

    beforeEach(function() {
      driver = new WebDriverJS(config);
      driver._remoteDriver = webdriverStub;
      byCssStub = sinon.stub(seleniumWD.By, 'css');
    });

    afterEach(function() {
      byCssStub.restore();
    });

    it('should delegate correctly', function () {
      var findElementsPromise = seleniumWD.promise.fulfilled(true);

      driver._remoteDriver.findElements.returns(findElementsPromise);
      driver.elements('.selector');
      expect(driver._remoteDriver.findElements).to.have.been.calledOnce;
      expect(byCssStub).to.have.been.calledWithExactly('.selector');
    });

    unroll('should error correctly when error is #error',
        function (done, testArgs) {
          var driver,
              findElementsPromise = seleniumWD.promise.rejected(testArgs.error);

          driver = new WebDriverJS(config);
          driver._remoteDriver = webdriverStub;
          driver._remoteDriver.findElements.returns(findElementsPromise);
          driver.elements('.selector');
          expect(driver._remoteDriver.findElements).to.have.been.calledOnce;
          done();
        },
        [
          ['error'],
          [{state: 'no such element'}],
          ['anError']
        ]
    );
  });
});