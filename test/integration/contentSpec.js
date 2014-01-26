var chai        = require('chai'),
    expect      = chai.expect,
    browser     = require('../testConfig.js').browser,
    Driver      = require('../../lib/driver.js'),
    webdriver   = require('webdriverjs'),
    CSSTestPage  = require('./../fixtures/CSSTest/pages/cssTestPage.js');

describe('Content()', function() {
  var remoteDriver,
      driver;

  this.timeout(10000);

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

  describe('size()', function() {
    it('should calculate the size of an element correctly', function(done) {
      driver
        .to(CSSTestPage)
        .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1()
                .size({width:200, height: 96});
          })
          .call(done);
    });
  });

  describe('width()', function() {
    it('should calculate the width of an element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1()
                .width('200px');
          })
          .call(done);
    });
  });

  describe('color()', function() {
    it('should report the colour of an element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1()
                .color('rgba(0,0,0,1)');
          })
          .call(done);
    });
  });

  describe('cssProperty()', function() {
    it('should report the css property of element under context correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1()
              .cssProperty(null, 'display', function(err, displayValue) {
                expect(displayValue).to.equal('block');
              });
          })
          .call(done);
    });
    it('should report the css property correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.cssProperty('h1', 'display', function(err, displayValue) {
              expect(displayValue).to.equal('block');
            });
          })
          .call(done);
    });
  });

  describe('visible()', function() {
    it('should report the visibility of an element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1()
                .visible();
          })
          .call(done);
    });
  });

  describe('invisible()', function() {
    it('should report the invisibility of an element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.hidden()
                .invisible();
          })
          .call(done);
    });
  });

  describe('text()', function() {
    it('should report the text of an element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1()
                .text('CSS Basic Elements');
          })
          .call(done);
    });
  });

  describe('clear()', function() {
    it('should clear the text of an element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.textField()
                .value('text that should not be here', null, true)
                .clear()
                .value('');
          })
          .call(done);
    });
  });

  describe('klick()', function() {
    it('should click the element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.clearButton()
                .klick();
          })
          .call(done);
    });
  });

//  describe('submit()', function() {
//    it('should submit the element correctly', function(done) {
//      driver
//          .to(CSSTestPage)
//          .at(CSSTestPage, function(err) {
//            expect(err).to.equal(undefined);
//            this.form()
//                .submit();
//            this.submitButton()
//                .value('Submitted');
//          })
//          .call(done);
//    });
//  });

  describe('value()', function() {
    it('should set and get the value of an element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.textField()
                .value('a test value', null, true)
                .value('a test value');
          })
          .call(done);
    });
  });

  describe('selected()', function() {
    it('should report on the selected value of an element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.checkbox()
                .selected();
          })
          .call(done);
    });
  });

  describe('location()', function() {
    it('should report on the location of an element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1()
                .location({x: 8, y: 21});
          })
          .call(done);
    });
  });

  describe('nodeName()', function() {
    it('should report on the nodeName of an element correctly', function(done) {
      driver
          .to(CSSTestPage)
          .at(CSSTestPage, function(err) {
            expect(err).to.equal(undefined);
            this.h1()
                .nodeName('h1');
          })
          .call(done);
    });
  });

});
