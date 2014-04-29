var chai        = require('chai'),
    expect      = chai.expect,
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
    browser
        .resolveWith(done)
        .endAll();
  });

  afterEach(function(done) {
    browser
        .resolveWith(done)
        .end(done);
  });

  describe('when part of a Page definition', function() {
    it('is created correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            if(err) {
              throw new Error(err);
            }
            this.table.should.be.an('function');
            this.h1.should.be.an('function');
            this.headingTwos.should.be.an('function');
            this.end();
          })
          .resolveWith(done);
    });
  });

  describe('instances', function () {
    it('when referenced as an object accesses content correctly', function (done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.table.rows.text("Table Header 1");
            this.end();
          })
          .resolveWith(done);
    });

    it('when referenced as an function accesses content correctly', function (done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.table.rows(1).text("Table Header 1");
            this.table.rows(2).text("Division 1");
            this.table.rows(3).text("Division 2");
            this.table.rows(-1).text("Division 3");
            this.table.rows.text("Table Header 1");
            this.end();
          })
          .resolveWith(done);
    });
  });

  describe('nested modules', function() {
    it('should have their content use correctly nested selectors', function(done) {
      browser
        .to(CSSTestPage)
        .at(CSSTestPage, function(err) {
          if(err) {
            throw new Error(err);
          }
          this.table.rows.should.be.an('function');
          this.table.rows.data.text('Division 1');
            this.end();
        })
        .resolveWith(done);
    });
  });
});
