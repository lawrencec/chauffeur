var chai        = require('chai'),
    expect      = chai.expect,
    browser     = require('../testConfig.js').browser,
    Driver      = require('../../lib/driver.js'),
    webdriver   = require('webdriverjs'),
    CSSTestPage  = require('./../fixtures/CSSTest/pages/cssTestPage.js');

describe('Driver()', function() {
  var remoteDriver,
      driver;

  this.timeout(99999999);

  beforeEach(function(done){
    remoteDriver = webdriver.remote({
      desiredCapabilities: {
        browserName: browser
      },
      logLevel: 'silent',
      singleton: false
    });

    driver = new Driver(remoteDriver);
    driver.init(done);
  });

  afterEach(function(done) {
    driver.endAll(done);
  });

  describe('at()', function() {
    it('should not throw an error if browser is at correct page', function(done) {
      driver
        .to(CSSTestPage)
        .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.endAll(done);
          });
    });

    it('should throw an error if browser is not at correct page', function(done) {
        driver
          .to('https://duckduckgo.com')
          .at(CSSTestPage, function(err) {
            expect(err).to.equal('Not at correct page. Expected "chauffeur Test Page" but found "Search DuckDuckGo "');
            this.endAll(done);
          });
    });
  });
});
