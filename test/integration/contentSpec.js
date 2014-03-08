var chai        = require('chai'),
    expect      = chai.expect,
    browserName     = require('../testConfig').browser,
    Browser      = require('../../lib/browser'),
    Driver      = require('../../lib/driver'),
    CSSTestPage  = require('./../fixtures/CSSTest/pages/cssTestPage.js');

describe('Content()', function() {
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

  describe('size()', function() {
    it('size() should calculate the size of an element correctly', function(done) {
      browser
        .to(CSSTestPage)
        .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1.size({width:200, height: 96});
            this.end(done);
          });
    });
  });

  describe('width()', function() {
    it('should calculate the width of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1.width('200');
            this.end(done);
          });
    });
  });

  describe('color()', function() {
    it('should report the colour of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1.color('rgba(0,0,0,1)');
            this.end(done);
          });

    });
  });

  describe('cssProperty()', function() {
    it('should report the css property of element under context correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1.cssProperty('display', function(err, displayValue) {
                expect(displayValue).to.equal('block');
              });
            this.end(done);
          });

    });

    it('should report the css property correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.cssProperty('h1', 'display', function(err, displayValue) {
              expect(displayValue).to.equal('block');
            });
            this.end(done);
          });
    });
  });

  describe('visible()', function() {
    it('should report the visibility of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1.visible();
            this.end(done);
          });

    });
  });

  describe('invisible()', function() {
    it('should report the invisibility of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.hidden.invisible();
            this.end(done);
          });
    });
  });

  describe('text()', function() {
    it('should report the text of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1.text('CSS Basic Elements');
            this.end(done);
          });
    });
  });

  describe('clear()', function() {
    it('should clear the text of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.textField
                .value('text that should not be here', null, true)
                .clear()
                .value('');
            this.end(done);
          });
    });
  });

  describe('klick()', function() {
    it('should click the element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.clearButton
                .klick();
            this.end(done);
          });
    });
  });

  describe('submit()', function() {
    it('should submit the element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.form()
                .submit();
            this.wait(1000);
            this.submitButton()
                .value('Submitted!');
            this.end(done);
          });
    });
  });

  describe('value()', function() {
    it('should set and get the value of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.textField
                .value('a test value', null, true)
                .value('a test value');
            this.end(done);
          });
    });
  });

  describe('selected()', function() {
    it('should report on the selected value of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.checkbox.selected();
            this.end(done);
          });

    });
  });

  describe('unselected()', function() {
    it('should report on the selected value of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.checkbox.klick();
            this.checkbox.unselected();
            this.end(done);
          });

    });
  });

  describe('location()', function() {
    it('should report on the location of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1.location({x: 8, y: 21});
            this.end(done);
          });
    });
  });

  describe('nodeName()', function() {
    it('should report on the nodeName of an element correctly', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1.nodeName('h1');
            this.end(done);
          });
    });
  });

  describe('exists()', function() {
    it('should report correctly if element exists on the page and is expected to', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1.exists();
            this.end(done);
          });
    });

    it('should report correctly if element does not exists on the page and is not expected to', function(done) {
      browser
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.notUsedElement.exists(false);
            this.end(done);
          });
    });
  });

});
