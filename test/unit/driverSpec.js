var sinonChai   = require('sinon-chai'),
    chai        = require('chai'),
    mock        = require('sinon').mock,
    spy         = require('sinon').spy,
    unroll      = require('unroll'),
    expect      = chai.expect,
    webdriver   = require('webdriverjs'),
    browser     = require('../testConfig.js').browser,
    Driver      = require('../../lib/driver.js'),
    Module      = require('../../lib/module.js'),
    CSSTestPage = require('../fixtures/CSSTest/pages/cssTestPage.js');

chai.use(sinonChai);
chai.should();

describe('Driver()', function() {
  var remoteDriver;

  before(function(){
    remoteDriver = webdriver.remote({
      desiredCapabilities: {
        browserName: browser
      },
      logLevel: 'silent'
    });
  });

  afterEach(function() {
    remoteDriver.endAll();
  });

  describe('constructor', function () {
    it('should instantiate correctly return an object instance', function() {
      var driver = new Driver(remoteDriver);
      driver.should.be.an('object');
      driver._remoteDriver.should.be.an('object');
      driver._remoteDriver.should.equal(remoteDriver);
    });
  });


  describe('Driver.init()', function () {
    it('should initialise correctly', function() {
      var mockRemoteDriver = mock(remoteDriver);
      var driver = new Driver(remoteDriver);

      mockRemoteDriver.expects('init').once();

      driver.init();

      mockRemoteDriver.verify();
      mockRemoteDriver.restore();
    });
  });

  describe('Driver._resolveProperty()', function() {

    unroll('should resolve propertyName #propertyName with value of #value for #parameter',
        function(done, testArgs) {
          var driver = new Driver(remoteDriver);
              var result = driver._resolveProperty(
                  testArgs.parameter,
                  testArgs.propertyName);

          result.should.equal(testArgs.value);
          done();
        },
        [
          ['parameter',               'propertyName',       'value'],
          [ 'aString',                'aProperty',          'aString' ],
          [ {aProperty: true},        'aProperty',          true ],
          [ (function() {
              var o = {};
              o.prototype = {
                prototypeProperty: true
              };
            return o;
          })(),                        'prototypeProperty',  true ]
        ]
    );
  });

  describe('Driver.to()', function() {
    unroll('should open browser at #url when a #type object',
        function(done, testArgs) {

          var mockRemoteDriver = mock(remoteDriver);
          var driver = new Driver(remoteDriver);
          mockRemoteDriver.expects('url').withArgs('aUrl');
          driver.to(testArgs.url);
          mockRemoteDriver.verify();
          mockRemoteDriver.restore();
          done();
        },
        [
          ['url',         'type'],
          [{url: 'aUrl'}, 'page'],
          ['aUrl',        'string']
        ]
    );
  });

  describe('Driver._getExpectationCallback', function() {
    unroll('should not throw error when result matches expectation',
        function(done, testArgs) {
          var result,
              expectationCallback = Driver._getExpectationCallback(
                testArgs.expectation,
                testArgs.msg,
                testArgs.keys
              );
          expectationCallback.should.be.a('function');
          result = expectationCallback(null, testArgs.result);
          expect(result).to.equal(testArgs.callbackResult);
          done();
        },
        [
          [
            'result',
            'callbackResult',
            'expectation',
            'msg',
            'keys'
          ],
          [
            'foo',
            true,
            function(err, result) {
              return result === 'foo';
            } ,
            '',
            ''
          ],
          [
            'foo',
            true,
            'foo',
            '',
            ''
          ],
          [
            {
              width: 100,
              height: 50
            },
            undefined,
            { width: 100,
              height: 50
            },
            '""',
            ['width','height']]
        ]
    );

    unroll('should throw error when result does not match expectation',
        function(done, testArgs) {
          var expectationCallback = Driver._getExpectationCallback(
                testArgs.expectation,
                testArgs.msg,
                testArgs.keys
              );

          try {
            expectationCallback(null, testArgs.result);
          }
          catch(e) {
            e.message.should.equal(testArgs.exceptionMessage);
          }
          done();
        },
        [
          [
            'result',
            'exceptionMessage',
            'expectation',
            'msg',
            'keys'
          ],
          [
            'foo',
            'Value does not match. Expected bar but got foo',
            'bar',
            'Value does not match. Expected %s but got %s',
            null
          ],
          [
            {
              width: 90,
              height: 50
            },
            'Value does not match. Expected 100 but got 90',
            { width: 100,
              height: 50
            },
            'Value does not match. Expected %s but got %s',
            ['width','height']]
        ]
    );

    it('should throw error if there was an error retrieving value', function() {
      var expectationCallback = Driver._getExpectationCallback('foo');
      try {
        expectationCallback('Error from browser', null);
      }
      catch(e) {
        e.message.should.equal('Error from browser');
      }
    });
  });

  describe('Driver.end()', function () {
    it('should close current session', function() {
      var mockRemoteDriver = mock(remoteDriver),
          driver = new Driver(remoteDriver);
      mockRemoteDriver.expects('end').once();
      driver.end();
      mockRemoteDriver.verify();
      mockRemoteDriver.restore();
    });
  });

  describe('Driver.endAll()', function () {
    it('should close all sessions', function() {
      var mockRemoteDriver = mock(remoteDriver),
          driver = new Driver(remoteDriver);
      mockRemoteDriver.expects('endAll').once();
      driver.endAll();
      mockRemoteDriver.verify();
      mockRemoteDriver.restore();
    });
  });

  describe('Driver.at()', function() {
    unroll('callback should be called correctly when at() is unsuccessful',
        function(done, testArgs) {
          var callbackObject,
              spyCallback,
              mockDriver,
              driver;

          driver = new Driver(remoteDriver);
          driver.ctxt = {
            getTitle: function getTitleCallback(spiedCallback) {
              spiedCallback.apply(this.ctxt, testArgs.titleCallbackArgs);
            }
          };

          callbackObject = {
            callback: function callbackFunc() {}
          };
          spyCallback = spy(callbackObject, 'callback');
          mockDriver = mock(driver);
          driver.at(CSSTestPage, spyCallback);
          spyCallback.callCount.should.equal(1);
          spyCallback.firstCall.args[0].should.equal(testArgs.errorMessage);
          mockDriver.verify();
          done();
        },
      [
        ['titleCallbackArgs'      , 'errorMessage'],
        [ //error from browser
          ['error message']       , 'error message'
        ],
        [ // incorrect title
          [null, 'title page']    , 'Not at correct page. Expected "chauffeur Test Page" but found "title page "'
        ]
      ]
    );

    it('callback should be called correctly when at() is successful',
        function(done) {
          var callbackObject,
              spyCallback,
              mockDriver,
              driver;

          driver = new Driver(remoteDriver);
          driver.ctxt = {
            getTitle: function getTitleCallback(spiedCallback) {
              spiedCallback(null, 'chauffeur Test Page');
            }
          };

          callbackObject = {
            callback: function callbackFunc() {}
          };
          spyCallback = spy(callbackObject, 'callback');
          mockDriver = mock(driver);
          driver.at(CSSTestPage, spyCallback);
          spyCallback.callCount.should.equal(1);
          spyCallback.firstCall.args.length.should.equal(0);
          mockDriver.verify();
          done();
        }
    );
  });
});