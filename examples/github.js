var chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    webdriver   = require('webdriverjs'),
    Driver      = require('../lib/driver.js'),
    GithubPage  = require('./Github/pages/homepage.js');

describe('my webdriverjs tests', function() {

  this.timeout(99999999);
  var client = {};

  before(function(done){
    var config = {
      desiredCapabilities: {
        browserName:  process.env.MOCHA_BROWSER || 'phantomjs'
      },
      logLevel: 'silent',
      singleton: false
    };
    client = new Driver(webdriver.remote(config));
    client.init(done);
  });

  after(function(done) {
    client.endAll(done);
  });

  it('Github test (with callbacks)', function(done) {
    client
        .to(GithubPage)
        .at(GithubPage, function(err) {
          if(err) {
            return;
          }
          this.headerLogo()
              .color(function(err, result) {
                expect(err).to.be.null;
                assert.strictEqual(result, 'rgba(51,51,51,1)');
              })
              .visible()
              .cssProperty('a[href="/plans"]', 'color', function(err, result) {
                expect(err).to.be.null;
                assert.strictEqual(result, 'rgba(65,131,196,1)');
              })
              .getTitle(function(err, title) {
                expect(err).to.be.null;
                assert.strictEqual(title,'GitHub · Build software better, together.');
              })
          .signUpForm()
              .size(function(err, result) {
                expect(err).to.be.null;
                assert.strictEqual(result.width, 320);
                assert.strictEqual(result.height , 296);
              })
              .call(done);
        });
  });

  it('Github test (without callbacks)', function(done) {
    client
        .to(GithubPage)
        .at(GithubPage, function(err) {
          if(err) {
            return;
          }
          this.headerLogo()
              .size({width:89, height: 32})
              .width('89px')
              .color('rgba(51,51,51,1)')
              .visible();

          this.signUpForm()
              .size({width: 320, height: 296});

          this.commandBar()
              .field().click()
              .wait(500)
              .topNav()
              .cssProperty(null, 'opacity', function(err, result) {
                expect(err).to.be.null;
                assert.strictEqual(result, '0');
              });
            this.call(done);
        });
  });

  after(function(done) {
    client.end(done);
  });
});