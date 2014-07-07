var Page = require('../../../../lib/page.js'),
    inherits = require('util').inherits;

function screenshotTestPage() {
  this.title = 'Screenshot Test Page';

  this._content = {
    body: {
      selector: '#screenshotTestPage'
    }
  };
}

inherits(screenshotTestPage, Page);

screenshotTestPage.url = 'http://localhost:9001/screenshot-test.html';
screenshotTestPage.wait = 0;
module.exports = screenshotTestPage;