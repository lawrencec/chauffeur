var sinonChai   = require('sinon-chai'),
    chai        = require('chai'),
    expect      = chai.expect,
    sinon       = require('sinon'),
    spy         = sinon.spy,
    stub        = sinon.stub,
    unroll      = require('unroll'),
    Browser     = require('../../lib/browser.js'),
    Driver      = require('../../lib/driver.js'),
    Module      = require('../../lib/module.js'),
    CSSTestPage = require('../fixtures/CSSTest/pages/cssTestPage.js');

chai.use(sinonChai);

describe('Browser()', function() {
  var config = {
        webDriverClass: 'webdriverio',
        webDriverConfig: {
          'foo': 'blah'
        }
      };

  describe('constructor', function () {
    it('should instantiate correctly and return an object instance', function() {
      var webDriverSpy,
          driverStub,
          browser;

      webDriverSpy = spy();
      driverStub = stub(Driver, 'getWebDriver', function() {
        return webDriverSpy;
      });

      browser = new Browser(config);
      expect(browser).to.be.an('object');
      expect(browser._driver).to.be.an('object');

      expect(driverStub).to.have.been.calledWithExactly(config.webDriverClass);
      expect(webDriverSpy).to.have.been.calledWithExactly(config.webDriverConfig);


    });
  });


  describe('Browser.init()', function () {
    it('should initialise correctly', function() {

      var driverStub = stub({
          init: function init() {}
        }),
        callback = function callback() {},
        browser;

      browser = new Browser(config);
      browser._driver = driverStub;
      browser.init(callback);
      expect(driverStub.init).to.have.been.calledWith(callback);

    });
  });

  describe('Browser._resolveProperty()', function() {

    unroll('should resolve propertyName #propertyName with value of #value for #parameter',
        function(done, testArgs) {
          var browser = new Browser(config);
              var result = browser._resolveProperty(
                  testArgs.parameter,
                  testArgs.propertyName);

          expect(result).to.equal(testArgs.value);
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

  describe('Browser.to()', function() {
    unroll('should open browser at #url when a #type object',
        function(done, testArgs) {
          var driverStub = stub({
              goTo: function goTo() {}
            }),
            browser;

          browser = new Browser(config);
          browser._driver = driverStub;

          browser.to(testArgs.url);
          expect(driverStub.goTo).to.have.been.calledWith(testArgs.expectation);

          done();
        },
        [
          ['url',         'expectation',  'type'],
          [{url: 'aUrl'}, 'aUrl',         'page'],
          ['aUrl',        'aUrl',         'string']
        ]
    );

    unroll('should open browser at correct #url when url parameters are #params',
      function(done, testArgs) {
          var driverStub = stub({
                goTo: function goTo() {}
              }),
              browser;

          browser = new Browser(config);
          browser._driver = driverStub;

          browser.to(testArgs.url, testArgs.params);
          expect(driverStub.goTo).to.have.been.calledWith(testArgs.expectation);
          done();
        },
        [
          ['url',                 'params',        'expectation'],
          [
            'aUrl/{foo}',                {foo:'bar'},    "aUrl/bar"
          ],
          [
            {url: "aUrl/{foo}"},  {foo:'bar'},     "aUrl/bar"
          ],
          [
            "aUrl?foo={foo}",  {foo:'bar'}, "aUrl?foo=bar"
          ],
          [
            {url: "aUrl?foo={foo}"},  {foo:'bar'}, "aUrl?foo=bar"
          ]
        ]
    );
  });

  describe('Browser.end()', function () {
    it('should close current session', function() {
      var driverStub = stub({
          end: function end() {}
        }),
        browser = new Browser(config);

      browser._driver = driverStub;
      browser.end();

      expect(driverStub.end).to.have.been.calledOnce;
    });
  });

  describe('Browser.endAll()', function () {
    it('should close all sessions', function() {
      var driverStub = stub({
            endAll: function endAll() {}
          }),
          browser = new Browser(config);

      browser._driver = driverStub;
      browser.endAll();

      expect(driverStub.endAll).to.have.been.calledOnce;
    });
  });

  describe('Browser.at()', function() {
    unroll('callback should be called correctly if at() is unsuccessful when error arg is #titleCallbackErrorArgument and #titleCallbackTitleArgument',
        function(done, testArgs) {
          var spyCallback,
              driverStub,
              browser;

          driverStub =  stub({
            getTitle: function getTitle() {}
          });

          driverStub.getTitle.yields(
              testArgs.titleCallbackErrorArgument,
              testArgs.titleCallbackTitleArgument
          );

          browser = new Browser(config);
          browser._driver = driverStub;

          spyCallback = spy();

          browser.at(CSSTestPage, spyCallback);

          expect(spyCallback.callCount).to.equal(1);
          expect(spyCallback).to.have.been.calledWithExactly(testArgs.errorMessage);

          done();
        },
        [
          ['titleCallbackErrorArgument', 'titleCallbackTitleArgument'      , 'errorMessage'],
          [ //error from browser
            'error message'             , null                             , 'error message'
          ],
          [ // incorrect title
            null                        ,'title page'                      , 'Not at correct page. Expected "chauffeur Test Page" but found "title page "'
          ]
        ]
    );

    it('callback should be called correctly when at() is successful',
        function(done) {
          var spyCallback,
              driverStub,
              browser;

          driverStub =  stub({
            getTitle: function getTitle() {}
          });

          driverStub.getTitle.yields(null, 'chauffeur Test Page');

          browser = new Browser(config);
          browser._driver = driverStub;

          spyCallback = spy();

          browser.at(CSSTestPage, spyCallback);

          expect(spyCallback.callCount).to.equal(1);
          expect(spyCallback).to.have.been.calledWithExactly();
          done();
        }
    );
  });
});