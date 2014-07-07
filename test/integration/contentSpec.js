var chai        = require('chai'),
    expect      = chai.expect,
    testConfig  = require('../testConfig'),
    Browser     = require('../../lib/browser'),
    Driver      = require('../../lib/driver'),
    CSSTestPage = require('./../fixtures/CSSTest/pages/cssTestPage.js'),
    ScreenshotTestPage = require('./../fixtures/CSSTest/pages/screenshotTestPage.js');


testConfig.withDrivers(
  'Content',
  function(webDriverLib) {
    return function () {
      var browser;

      this.timeout(15000);

      beforeEach(function (done) {
        var config = {
          webDriverClass: webDriverLib,
          webDriverConfig: {
            desiredCapabilities: {
              browserName: testConfig.browser
            },
            logLevel: 'silent',
            singleton: false
          }
        };
        browser = new Browser(config);
        browser.init(done);
      });

      after(function (done) {
        browser
            .resolveWith(done)
            .endAll();
      });

      afterEach(function (done) {
        browser
            .resolveWith(done)
            .end();
      });

      describe('size()', function () {
        it('size() should calculate the size of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);

                this.h1.size({width: 200, height: 96});
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('width()', function () {
        it('should calculate the width of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.h1.width('200');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('color()', function () {
        it('should report the colour of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.h1.color('rgba(0,0,0,1)');
                this.end();
              })
              .resolveWith(done);

        });
      });

      describe('cssProperty()', function () {
        it('should report the css property of element under context correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.h1.cssProperty('display', function (err, displayValue) {
                  expect(displayValue).to.equal('block');
                });
                this.end();
              })
              .resolveWith(done);

        });

        it('should report the css property correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.cssProperty('h1', 'display', function (err, displayValue) {
                  expect(displayValue).to.equal('block');
                });
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('visible()', function () {
        it('should report the visibility of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.h1.visible();
                this.end();
              })
              .resolveWith(done);

        });
      });

      describe('invisible()', function () {
        it('should report the invisibility of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.hidden.invisible();
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('text()', function () {
        it('should report the text of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.h1.text('CSS Basic Elements');
                this.end();
              })
              .resolveWith(done);

        });
      });

      describe('clear()', function () {
        it('should clear the text of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.textField
                    .setValue('text that should not be here')
                    .clear()
                    .value('');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('klick()', function () {
        it('should click the element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.clearButton
                    .klick();
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('submit()', function () {
        it('should submit the element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.form()
                    .submit();
                this.wait(1000);
                this.submitButton()
                    .value('Submitted!');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('value()', function () {
        it('should set and get the value of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.textField
                    .setValue('a test value')
                    .value('a test value');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('selected()', function () {
        it('should report on the selected value of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.checkbox.selected();
                this.end();
              })
              .resolveWith(done);

        });
      });

      describe('unselected()', function () {
        it('should report on the selected value of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.checkbox.klick();
                this.checkbox.unselected();
                this.end();
              })
              .resolveWith(done);

        });
      });

      describe('location()', function (done) {
        it('should report on the location of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.h1.location({x: 8, y: 21});
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('nodeName()', function () {
        it('should report on the nodeName of an element correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.h1.nodeName('h1');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('exists()', function () {
        it('should report correctly if element exists on the page and is expected to', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.h1.exists();
                this.end();
              })
              .resolveWith(done);
        });

        it('should report correctly if element does not exists on the page and is not expected to', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.notUsedElement.exists(false);
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('executeScript()', function () {
        it('should execute a script and return results correctly', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.executeScript('return document.title', 'chauffeur Test Page');
                this.end();
              })
              .resolveWith(done);
        });
      });


      describe('hasClass()', function () {
        it('should report correctly if element has a specified class', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.h1.hasClass('aClassName');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('hasntClass()', function () {
        it('should report correctly if element does not have a specified class', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.h1.hasntClass('incorrect');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('attr()', function () {
        it('should report correctly if element has a specified attribute', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.textField.attr('type', 'text');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('moveTo()', function () {
        it('should move to element', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.testLink.moveTo();
                this.testLink.color('rgba(255, 0, 0, 1)');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('hover()', function () {
        it('should move to element', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.testLink.hover();
                this.testLink.color('rgba(255, 0, 0, 1)');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('back', function () {
        it('navigate browser backwards in browser history', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.testLink.klick();
                this.executeScript('return document.location.hash', '#foo');
                this.back();
                this.executeScript('return document.location.hash', '');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('forward', function () {
        it('navigate browser forward in browser history', function (done) {
          browser
              .to(CSSTestPage)
              .at(CSSTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.testLink.klick();
                this.executeScript('return document.location.hash', '#foo');
                this.back();
                this.executeScript('return document.location.hash', '');
                this.forward();
                this.executeScript('return document.location.hash', '#foo');
                this.end();
              })
              .resolveWith(done);
        });
      });

      describe('takeScreenshot', function() {
        it('should save screenshot correctly', function (done) {
          browser
              .setSize(Browser.sizes.IPHONE)
              .to(ScreenshotTestPage)
              .at(ScreenshotTestPage, function (err) {
                expect(err).to.equal(undefined);
                this.takeScreenshot('./target/testScreenshot.png');
                this.end();
              })
              .resolveWith(done);
        });
      });
    };
  }
);
