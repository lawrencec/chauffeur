var chai        = require('chai'),
    browser     = require('../testConfig.js').browser,
    Driver      = require('../../lib/driver.js'),
    Module      = require('../../lib/module.js'),
    webdriver   = require('webdriverjs'),
    CSSTestPage  = require('./../fixtures/CSSTest/pages/cssTestPage.js');

chai.should();

describe('Module', function() {
  this.timeout(99999999);
  var remoteDriver,
      driver;
  beforeEach(function(){
    remoteDriver = webdriver.remote({
      desiredCapabilities: {
        browserName: browser
      },
      logLevel: 'silent'
    });

    driver = new Driver(remoteDriver);
    driver.init();
  });

  afterEach(function(done) {
    driver.end(done);
  });

  describe('when part of a Page definition', function() {
    it('is created correctly', function() {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            if(err) {
              throw new Error(err);
            }
            this.table.should.be.a('function');
            this.h1.should.be.a('function');
            this.headingTwos.should.be.a('function');
            this.table().should.be.an('object');
            this.h1().should.be.an('object');
            this.headingTwos().should.be.an('object');
          });
    });
  });
});
