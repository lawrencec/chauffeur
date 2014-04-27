var sinonChai   = require('sinon-chai'),
    chai        = require('chai'),
    sinon       = require('sinon'),
    expect      = chai.expect,
    unroll      = require('unroll'),
    webdriver = require('webdriverjs'),
    Driver      = require('../../../lib/driver.js');
    WebDriverIO = require('../../../lib/drivers/webdriverio.js');

chai.use(sinonChai);

function expectToFailWithError(action, expectations) {
  var listeners = process.listeners('uncaughtException');
  //remove all current listeners
  process.removeAllListeners('uncaughtException');
  //provide our own
  process.on("uncaughtException", function (error) {
    //remove our own
    process.removeAllListeners('uncaughtException');
    //re-add original listeners
    listeners.forEach(function(item) {
      process.on('uncaughtException', item);
    });
    //run our expectations
    process.nextTick(function() {
      expectations(error);
    });
  });
  process.nextTick(action);
}

function expectedError(message, expected, actual) {
  return {
    message: message,
    expected: expected,
    actual: actual
  };
}
describe('WebDriverIO', function() {
  var config = {},
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
      click:                  function(){},
      doubleClick:            function(){},
      moveToObject:           function(){},
      clearElement:           function(){},
      pause:                  function(){},
      getLocation:            function(){},
      getTagName:             function(){},
      getTitle:               function(){},
      getText:                function(){},
      value:                  function(){},
      getValue:               function(){},
      setValue:               function(){},
      addValue:               function(){},
      hasValue:               function(){},
      isSelected:             function(){},
      submitForm:             function(){},
      getAttribute:           function(){},
      keys:                   function(){},
      end:                    function(){},
      endAll:                 function(){},
      elements:               function(){},
      back:                   function(){},
      forward:                function(){},
      execute:                function(){}
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
      driver.value('.selector', 'newValue', null, null, true);
      expect(driver.ctxt.addValue).to.have.been.calledWith('.selector', 'newValue');
    });

  });
  describe('hasValue()', function () {
    it('should delegate correctly', function() {
        var driver;

        driver = new WebDriverIO(config);
        driver.ctxt = contextStub;
        driver.hasValue('.selector', 'newValue');
        expect(driver.ctxt.getValue).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.value('.selector', 'aValue');
                driver.ctxt.getValue.yield(null, testArgs.result);
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
          ['result'   , 'expectation'],
          ['incorrect' , expectedError('Value does not match for selector ".selector".', 'aValue', 'incorrect')]
        ]
    );
  });

  describe('setValue()', function () {
    it('should delegate correctly when called', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.setValue('.selector','enteredInput');
      expect(driver.ctxt.setValue).to.have.been.calledWith('.selector', 'enteredInput');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.setValue('.selector', null);
                driver.ctxt.setValue.yield(null, testArgs.result);
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
          ['result'   , 'expectation'],
          [{status:1} , expectedError('Entered value does not match for ".selector".', true, false)]
        ]
    );
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
      expect(driver.ctxt.click).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.klick('.selector', null);
                driver.ctxt.click.yield(null, testArgs.result);
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
          ['result'                                                                       , 'expectation'],
          [{status:1} , expectedError('Element with ".selector" not clicked successfully.', true, false)]
        ]
    );

  });

  describe('doubleklick()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.doubleklick('.selector');
      expect(driver.ctxt.doubleClick).to.have.been.calledWith('.selector');
      driver.ctxt.doubleClick.yield(null, {status:0, orgStatusMessage:'The command executed successfully.'});
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.doubleklick('.selector', null);
                driver.ctxt.doubleClick.yield(null, testArgs.result);
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
          ['result'                                                                              , 'expectation'],
          [{status:1} , expectedError('Element with ".selector" not double-clicked successfully.', true, false)]
        ]
    );
  });

  describe('moveTo()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.moveTo('.selector');
      expect(driver.ctxt.moveToObject).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.moveTo('.selector', null);
                driver.ctxt.moveToObject.yield(null, testArgs.result);
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
          ['result'                                                                          , 'expectation'],
          [{status:1} , expectedError('Not moved cursor to element ".selector" successfully.', true, false)]
        ]
    );
  });

  describe('hover()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.hover('.selector');
      expect(driver.ctxt.moveToObject).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.moveTo('.selector', null);
                driver.ctxt.moveToObject.yield(null, testArgs.result);
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
          ['result'                                                                          , 'expectation'],
          [{status:1} , expectedError('Not moved cursor to element ".selector" successfully.', true, false)]
        ]
    );
  });

  describe('submit()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.submit('.selector');
      expect(driver.ctxt.submitForm).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.submit('.selector', null);
                driver.ctxt.submitForm.yield(null, testArgs.result);
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
          ['result'    , 'expectation'],
          [{status:1}  , expectedError('Form not submitted successfully with selector ".selector".', true, false)]
        ]
    );
  });

  describe('clear()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.clear('.selector');
      expect(driver.ctxt.clearElement).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.clear('.selector', null);
                driver.ctxt.clearElement.yield(null, testArgs.result);
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
          ['result'    , 'expectation'],
          [{status:1}  , expectedError('Values not cleared for element with selector ".selector".', true, false)]
        ]
    );
  });

  describe('attr()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.attr('.selector', 'attrName');
      expect(driver.ctxt.getAttribute).to.have.been.calledWith('.selector', 'attrName');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.attr('.selector', 'attrName', 'expectedValue');
                driver.ctxt.getAttribute.yield(null, testArgs.result);
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
          ['result' , 'expectation'],
          ['aValue' , expectedError('Attribute value does not match for selector ".selector".', 'expectedValue', 'aValue')]
        ]
    );
  });

  describe('selected()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.selected('.selector');
      expect(driver.ctxt.isSelected).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.selected('.selector', null, null);
                driver.ctxt.isSelected.yield(null, testArgs.result);
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
          ['result' , 'expectation'],
          [false     , expectedError('Element with selector ".selector" was expected to be selected. It was not.', true, false)]
        ]
    );
  });


  describe('unselected()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.selected('.selector');
      expect(driver.ctxt.isSelected).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.unselected('.selector', null, null);
                driver.ctxt.isSelected.yield(null, testArgs.result);
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
          ['result' , 'expectation'],
          [true     , expectedError('Element with selector ".selector" was expected to be unselected. It was not.', false, true)]
        ]
    );
  });

  describe('text()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.text('.selector');
      expect(driver.ctxt.getText).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.text('.selector', 'text', null, null);
                driver.ctxt.getText.yield(null, testArgs.result);
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
          ['result'             , 'expectation'],
          ['someincorrectText'  , expectedError('Text does not match for selector ".selector".', 'text', 'someincorrectText')]
        ]
    );
  });

  describe('nodeName()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.nodeName('.selector');
      expect(driver.ctxt.getTagName).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.nodeName('.selector', 'nodeName', null, null);
                driver.ctxt.getTagName.yield(null, testArgs.result);
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
          ['result'             , 'expectation'],
          ['incorrectNodeName'  , expectedError('Node name does not match for selector ".selector".', 'nodeName', 'incorrectNodeName')]
        ]
    );
  });

  describe('location()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.location('.selector');
      expect(driver.ctxt.getLocation).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.location('.selector', {x:3,y:43}, null, null);
                driver.ctxt.getLocation.yield(null, testArgs.result);
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
          [{x:0,y:0}  , expectedError('Location values for selector ".selector" do not match.', {x:3,y:43}, {x:0,y:0})],
          [{x:3,y:0}  , expectedError('Location values for selector ".selector" do not match.', {x:3,y:43}, {x:3,y:0})],
          [{x:0,y:43} , expectedError('Location values for selector ".selector" do not match.', {x:3,y:43}, {x:0,y:43})]
        ]
    );
  });

  describe('visible()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.visible('.selector');
      expect(driver.ctxt.isVisible).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.visible('.selector', null, null, null);
                driver.ctxt.isVisible.yield(null, testArgs.result);
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
          ['result'  , 'expectation'],
          [false     , expectedError('Element with selector ".selector" was expected to be visible. It was not.', true, false)]
        ]
    );
  });

  describe('invisible()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.invisible('.selector');
      expect(driver.ctxt.isVisible).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for result #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.invisible('.selector', null, null, null);
                driver.ctxt.isVisible.yield(null, testArgs.result);
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
          ['result'  , 'expectation'],
          [ true     , expectedError('Element with selector ".selector" was expected to be invisible. It was not.', false, true)]
        ]
    );
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

    unroll('should throw error correctly',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.color('.selector', '#fff', null, null);
                driver.ctxt.getCssProperty.yield(null, testArgs.result);
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
          ['result'           , 'expectation'],
          ["rgb(0,0,0,0)"     , expectedError('Color values do not match for selector ".selector".','#fff', 'rgb(0,0,0,0)')],
          ["#ffe"             , expectedError('Color values do not match for selector ".selector".','#fff', '#ffe')]
        ]
    );
  });

  describe('width()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.width('.selector');
      expect(driver.ctxt.getCssProperty).to.have.been.calledWith('.selector', 'width');
    });

    unroll('should throw error correctly for #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function() {
                driver.width('.selector', '100', null, null);
                driver.ctxt.getCssProperty.yield(null, testArgs.result);
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
          ['result' , 'expected'],
          [1000   , expectedError('Width values do not match for selector ".selector".', 100, 1000)]
        ]
    );
  });

  describe('size()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.size('.selector', {width: "100", height: "90"}, null, null);
      expect(driver.ctxt.getElementSize).to.have.been.calledWith('.selector');
    });

    unroll('should throw error correctly for #result',
     function (next, testArgs) {
        var driver;

        driver = new WebDriverIO(config);
        driver.ctxt = contextStub;
        expectToFailWithError(
          function() {
            driver.size('.selector', {width: '100', height: '200'}, null, null);
            driver.ctxt.getElementSize.yield(null, testArgs.result);
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

  describe('getTitle()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.getTitle('title');
      expect(driver.ctxt.getTitle).to.have.been.calledWith('title');
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

  describe('exists()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.exists('#notUsedSelector', false);
      expect(driver.ctxt.getTagName).to.have.been.calledWith('#notUsedSelector');
    });

    unroll('should throw error correctly for #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function() {
                driver.exists('#notUsedSelector', testArgs.mustExist);
                driver.ctxt.getTagName.yield(null, testArgs.result);
              },
              function(error) {
                expect(error.message).to.equal(testArgs.expected.message);
                expect(error.expected).to.equal(testArgs.expected.expected);
                expect(error.actual).to.equal(testArgs.expected.actual);
                next();
              }
          );
        },
        [
          ['mustExist'  , 'result'    ,   'expected'],
          [false        , 'aTagName'  ,   expectedError('Element with selector "#notUsedSelector" not expected to exist but does.', false, true)],
          [true         , null  ,   expectedError('Element with selector "#notUsedSelector" expected to exist but does not.', true, false)],
          [undefined    , null  ,   expectedError('Element with selector "#notUsedSelector" expected to exist but does not.', true, false)]
        ]
    );
  });

  describe('elements()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.elements('#selector');
      expect(driver.ctxt.elements).to.have.been.calledWith('#selector');
    });

    unroll('should throw error correctly for #result',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function() {
                driver.elements('.selector', 2);
                driver.ctxt.elements.yield(null, testArgs.result);
              },
              function(error) {
                expect(error.message).to.equal(testArgs.expected.message);
                expect(error.expected).to.equal(testArgs.expected.expected);
                expect(error.actual).to.equal(testArgs.expected.actual);
                next();
              }
          );
        },
        [
          ['result'   , 'expected'],
          [{status: 0, value:{length: 3}}   , expectedError('Found incorrect number of elements matching ".selector".', 2, 3)]
        ]
    );
  });

  describe('back()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.back();
      expect(driver.ctxt.back).to.have.been.calledWith();
    });
  });

  describe('forward()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.forward();
      expect(driver.ctxt.forward).to.have.been.calledWith();
    });
  });

  describe('hasClass()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.hasClass('selector');
      expect(driver.ctxt.getAttribute).to.have.been.calledWith('selector', 'className');
    });

    unroll('should throw error correctly',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.hasClass('.selector', '.className', null, null);
                driver.ctxt.getAttribute.yield(null, testArgs.result);
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
          [".incorrect"      , expectedError('Class name does not exist for selector ".selector".',true, false)],
          [".incorrect .foo" , expectedError('Class name does not exist for selector ".selector".',true, false)]
        ]
    );
  });

  describe('hasntClass()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.hasntClass('selector');
      expect(driver.ctxt.getAttribute).to.have.been.calledWith('selector', 'className');
    });

    unroll('should throw error correctly',
        function (next, testArgs) {
          var driver;

          driver = new WebDriverIO(config);
          driver.ctxt = contextStub;
          expectToFailWithError(
              function () {
                driver.hasntClass('.selector', '.className', null, null);
                driver.ctxt.getAttribute.yield(null, testArgs.result);
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
          [".className"             , expectedError('Class name exists for selector ".selector".', true, false)],
          [".incorrect .className"  , expectedError('Class name exists for selector ".selector".', true, false)]
        ]
    );
  });

  describe('executeScript()', function () {
    it('should delegate correctly', function () {
      var driver;

      driver = new WebDriverIO(config);
      driver.ctxt = contextStub;
      driver.executeScript('function() { return 1;}', 2);
      expect(driver.ctxt.execute).to.have.been.calledWith('function() { return 1;}');
    });
  });
});