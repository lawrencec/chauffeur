var chai        = require('chai'),
    expect      = chai.expect,
    Browser      = require('../../').Browser,
    GithubPage  = require('./pages/homepage'),
    browserName = process.env.CHAUFFEUR_BROWSER || 'phantomjs';

describe('Github.com', function() {
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

  it('homepage (with callbacks)', function(done) {
    browser
      .to(GithubPage)
      .at(GithubPage, function(err) {
        if(err) {
          return;
        }
          this.headerLogo
              .color(function(err, result) {
                expect(err).to.be.null;
                expect(result).to.equal('rgba(51,51,51,1)');
              })
              .visible();

          this.signUpForm
              .width(function(err, width) {
                expect(err).to.be.null;
                expect(width).to.equal('320px');
              });
          this.end();
      })
      .resolveWith(done);
  });

  it('homepage (without callbacks)', function(done) {
    browser
        .to(GithubPage)
        .at(GithubPage, function(err) {
          if(err) {
            return;
          }
          this.headerLogo
              .size({width:89, height: 32})
              .width('89px', parseInt)
              .color('rgba(51,51,51,1)');

          this.signUpForm
              .width('320px');

          this.commandBar
              .field
              .klick()
              .wait(1000);

          this.end();
        })
        .resolveWith(done);
  });
});