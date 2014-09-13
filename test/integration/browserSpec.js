var chai        = require('chai'),
    expect      = chai.expect,
    testConfig  = require('../testConfig.js'),
    Browser     = require('../../lib/browser.js'),
    CSSTestPage = require('./../fixtures/CSSTest/pages/cssTestPage.js'),
    JsTestPage = require('./../fixtures/CSSTest/pages/jsTestPage.js');

testConfig.withDrivers(
    'Browser',
    function(webDriverLib) {
    return function () {
      var browser;

      this.timeout(15000);

      beforeEach(function (done) {
        var config = {
          webDriverClass: webDriverLib,
          webDriverConfig: {
            desiredCapabilities: {
              browserName: testConfig.browser
            },
            logLevel: 'silent',
            singleton: false
          }
        };
        browser = new Browser(config);
        browser.init(done);
      });

      after(function (done) {
        browser
            .resolveWith(done)
            .endAll();
      });

      afterEach(function (done) {
        browser
            .resolveWith(done)
            .end();
      });

      describe('at()', function () {
        it('should not throw an error if browser is at correct page', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.end();
              })
              .resolveWith(done);
        });

        it('should throw an error if browser is not at correct page', function (done) {
          browser
              .to(JsTestPage)
              .at(CSSTestPage, function (err) {
                expect(err.message).to.equal('Not at correct page.');
                expect(err.expected).to.equal('chauffeur Test Page');
                expect(err.actual).to.equal('JS Test Page');
                this.end();
              })
              .resolveWith(done);
        });
      });

//      commenting out temporarily because of https://code.google.com/p/selenium/issues/detail?id=7445
//      describe('window sizes', function() {
//        it('should set and get the size of the browser window correctly', function (done) {
//          browser
//            .setSize({width: 1000, height: 500})
//            .getSize(function(err, result) {
//              expect(result.width).to.equal(1000);
//            })
//            .to(JsTestPage)
//            .at(CSSTestPage, function (err) {
//              this.end();
//            })
//            .resolveWith(done);
//
//        });
//      });
    };
  }
);






