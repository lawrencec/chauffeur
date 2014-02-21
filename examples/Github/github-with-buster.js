var buster = require("buster"),
    assert      = buster.referee.assert,
    Browser      = require('../../').Browser,
    GithubPage  = require('./pages/homepage.js'),
    browserName = process.env.CHAUFFEUR_BROWSER || 'phantomjs',
    browser;

buster.testCase("my webdriverjs tests", {

  'setUp': function(done) {
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

    this.timeout = 9999999;
    browser = new Browser(config);
    browser.init(done);
  },

  'tearDown': function(done) {
    browser.endAll(done);
  },

  'homepage (with callbacks)': function (done) {
    browser
        .to(GithubPage)
        .at(GithubPage, function(err) {
          if(err) {
            return;
          }
          this.headerLogo
            .color(function(err, result) {
              assert.isNull(err);
              assert(result, 'rgba(51,51,51,1)');
            })
            .visible();

          this.signUpForm
              .size(function(err, result) {
                assert.isNull(err);
                assert(result.width, 320);
                assert(result.height, 296);
              });
          this.end(done);
        });
  },

  'homepage (without callbacks)': function(done) {
    browser
        .to(GithubPage)
        .at(GithubPage, function(err) {
          if(err) {
            return;
          }
          this.headerLogo
              .size({width:89, height: 32})
              .width('89px', parseInt)
              .color('rgba(51,51,51,1)')
              .visible();
          this.signUpForm
                .width('320px');
          this.commandBar
            .field.klick()
            .wait(1000);

          this.commandBar
              .topNav
                .cssProperty('opacity', function(err, result) {
                  assert.isNull(err);
                  assert(parseInt(result), 0);
                });
          this.end(done);
        });
  }
});