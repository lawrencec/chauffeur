var sinonChai   = require('sinon-chai'),
    chai        = require('chai'),
    expect      = chai.expect,
    unroll      = require('unroll'),
    Browser     = require('../../lib/browser.js'),
    Driver      = require('../../lib/driver.js'),
    Module      = require('../../lib/module.js');

chai.use(sinonChai);

describe('Driver()', function() {
  var config = {
        webDriverClass: 'webdriverio',
        webDriverConfig: {
          'foo': 'blah'
        }
      };

  describe('constructor', function () {
    it('should instantiate correctly and return an object instance', function() {
      var driver = new Driver(config);

      expect(driver).to.be.an('object');
    });
  });

  describe('unimplemented methods', function () {
    //dynamically determine methods to test
    var driverPrototypeMethods = function getDriverPrototypeMethods() {
      var unrollValues = [['method']];
      Object.keys(Driver.prototype).forEach(function(item) {
            unrollValues.push([item]);
          }
      );
      return unrollValues;
    }();

    unroll('#method should throw a NOT_IMPLEMENTED_EXCEPTION',
        function(done, testArgs) {
          var driver = new Driver();

          expect(function() {
            driver[testArgs.method]();
          }).to.throw('NOT_IMPLEMENTED_EXCEPTION');
          done();
        },
        driverPrototypeMethods
    );
  });

  describe('_getExpectationCallback()', function() {
    unroll('should not throw error when result #result matches expectation #expectation',
        function(done, testArgs) {
          var result,
              expectationCallback = Driver._getExpectationCallback(
                  testArgs.expectation,
                  testArgs.msg,
                  testArgs.keys
              );
          expect(expectationCallback).to.be.a('function');
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
            true,
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
              testArgs.expectation, testArgs.msg, testArgs.keys
          );

          expect(function() {
            expectationCallback(null, testArgs.result);
          }).to.throw(testArgs.exceptionMessage);
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

      expect(function() {
        expectationCallback('Error from browser', null);
      }).to.throw('Error from browser');
    });
  });

  describe('getWebDriver', function () {
    unroll('should return correct webdriver object if #wdClass exists',
        function(done, testArgs) {
          var wd;

          wd = Driver.getWebDriver(testArgs.wdClass);

          expect(wd).to.be.an('function');
          done();
        },
        [
          ['wdClass'    ],
          ['webdriverio']
        ]
    );

    it('should throw exception when webdriver class does not exist',
      function() {
        try {
          Driver.getWebDriver('unknown');
        } catch(e) {
          expect(e.code).to.equal("MODULE_NOT_FOUND");
        }
      }
    );
  });
});