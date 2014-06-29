var Page = require('../../../../lib/page.js'),
    inherits = require('util').inherits;

function JsTestPage() {
  this.title = 'chauffeur Js Test Page';

  this._content = {
    body: {
      selector: '#jsTestPage'
    }
  };
}

inherits(JsTestPage, Page);

JsTestPage.url = 'http://localhost:9001/js-test.html';
JsTestPage.wait = 0;
module.exports = JsTestPage;