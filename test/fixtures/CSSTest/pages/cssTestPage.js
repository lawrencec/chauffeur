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
    'table': {
      module: TableModule
    },
    'hidden': {
      selector: '#hiddenElement'
    },
    'textField': {
      selector: '#text_field'
    },
    'checkbox': {
      selector: '#checkbox1'
    },
    'clearButton': {
      selector: '#clearButton'
    },
    'submitButton': {
      selector: '#submitButton'
    },
    'form': {
      selector: '#formSection'
    }
  };
}

inherits(CssTestPage, Page);

CssTestPage.url = 'file:///'+__dirname +'/../../html-elements.html';
CssTestPage.wait = 0;
module.exports = CssTestPage;