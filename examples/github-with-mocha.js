var assert      = require('assert'),
    webdriver   = require('webdriverjs'),
    Driver      = require('../lib/driver.js'),
    GithubPage  = require('./Github/pages/homepage.js');

describe('Github.com', function() {
  var client;

  this.timeout(99999999);

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

  it('homepage (with callbacks)', function(done) {
    client
        .to(GithubPage)
        .at(GithubPage, function(err) {
          if(err) {
            return;
          }
          this.headerLogo()
              .color(function(err, result) {
                assert(err === null);
                assert(result === 'rgba(51,51,51,1)');
              })
              .visible()
              .cssProperty('a[href="/plans"]', 'color', function(err, result) {
                assert(err === null);
                assert(result === 'rgba(65,131,196,1)');
              })
              .getTitle(function(err, title) {
                assert(err === null);
                assert(title === 'GitHub · Build software better, together.');
              })
          .signUpForm()
              .size(function(err, result) {
                assert(err === null);
                assert(result.width === 320);
                assert(result.height === 296);
              })
          .call(done);
        });
  });

  it('homepage (without callbacks)', function(done) {
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
              .visible()
          .signUpForm()
              .size({width: 320, height: 296})
          .commandBar()
              .field().click()
              .wait(500)
              .topNav()
              .cssProperty(null, 'opacity', function(err, result) {
                assert(err === null);
                assert(result === '0');
              })
          .call(done);
        });
  });

  after(function(done) {
    client.end(done);
  });
});