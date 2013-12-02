var Page = require('../../../../lib/page.js'),
    ParagraphSectionModule = require('../modules/paragraph.js'),
    TableModule = require('../modules/table.js'),
    inherits = require('util').inherits;

function CssTestPage() {
  this.url = 'file:///'+__dirname +'/../../html-elements.html';

  this.title = 'chauffeur Test Page';

  this._content = {
    'h1': {
      selector: 'h1'
    },
    'paragraphSection': {
      module: ParagraphSectionModule,
      required: true
    },
    'headingTwos': {
      selector: 'h2',
      required: true
    },
    'table': TableModule
  };
}

inherits(CssTestPage, Page);

CssTestPage.url = 'file:///'+__dirname +'/../../html-elements.html';
CssTestPage.wait = 0;
module.exports = CssTestPage;