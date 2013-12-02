var chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    webdriver   = require('webdriverjs'),
    Driver      = require('../lib/driver.js'),
    GithubPage  = require('./Github/pages/homepage.js');

describe('my webdriverjs tests', function() {

  this.timeout(99999999);
  var client = {};

  before(function(){
    var config = {
      desiredCapabilities: {
        browserName:  process.env.MOCHA_BROWSER || 'phantomjs'
      },
      logLevel: 'silent'
    };
    client = new Driver(webdriver.remote(config));
    client.init();
  });
  after(function() {
    client.endAll();
  });

  it('Github test (with callbacks)', function(done) {
    client
        .to(GithubPage)
        .at(GithubPage, function(err) {
          if(err) {
            return;
          }
          this.headerLogo()
              .size(function(err, result) {
                expect(err).to.be.null;
                assert.strictEqual(result.height , 32);
                assert.strictEqual(result.width, 89);
              })
              .width(function(err, result){
                expect(err).to.be.null;
                assert.strictEqual(result, '89px');
              })
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
              .visible()
              .signUpForm()
              .size({width: 320, height: 296})
              .call(done);
        });
  });

  after(function(done) {
    client.end(done);
  });
});

//TODO: write tests
//TODO: put methods on context object, perhaps using a mixin
//TODO: expand api to match webdriver
//TODO: change api to use is() as a option. Assertion library should be able to
//        be specifed
//        i.e .size().is({width:x, y: height});
//        i.e .color().is('#fff');
