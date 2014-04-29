var chai        = require('chai'),
    expect      = chai.expect,
    browserName     = require('../testConfig.js').browser,
    Browser      = require('../../lib/browser.js'),
    CSSTestPage  = require('./../fixtures/CSSTest/pages/cssTestPage.js');

describe('Browser()', function() {
  var browser;

  this.timeout(10000);

  beforeEach(function(done){
    var config = {
      webDriverClass: 'webdriverio',
      webDriverConfig: {
        desiredCapabilities: {
          browserName:  browserName
        },
        logLevel: 'silent',
        singleton: false
      }
    };
    browser = new Browser(config);
    browser.init(done);
  });

  after(function(done) {
    browser
        .resolveWith(done)
        .endAll();
  });

  afterEach(function(done) {
    browser
        .resolveWith(done)
        .end();
  });

  describe('at()', function() {
    it('should not throw an error if browser is at correct page', function(done) {
      browser
        .to(CSSTestPage)
        .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.end();
          })
          .resolveWith(done);
    });

    it('should throw an error if browser is not at correct page', function(done) {
        browser
          .to('https://duckduckgo.com')
          .at(CSSTestPage, function(err) {
            expect(err.message).to.equal('Not at correct page.');
            expect(err.expected).to.equal('chauffeur Test Page');
            expect(err.actual).to.equal('Search DuckDuckGo');
              this.end();
            })
            .resolveWith(done);
    });
  });
});
