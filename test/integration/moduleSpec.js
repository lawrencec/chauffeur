var chai        = require('chai'),
    browserName     = require('../testConfig.js').browser,
    Browser      = require('../../lib/browser.js'),
    Module      = require('../../lib/module.js'),
    CSSTestPage  = require('./../fixtures/CSSTest/pages/cssTestPage.js');

chai.should();

describe('Module', function() {
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
    browser.endAll(done);
  });

  afterEach(function(done) {
    browser.end(done);
  });

  describe('when part of a Page definition', function() {
    it('is created correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            if(err) {
              throw new Error(err);
            }
            this.table.should.be.an('object');
            this.h1.should.be.an('object');
            this.headingTwos.should.be.an('object');
            this.end(done);
          });
    });
  });
});
