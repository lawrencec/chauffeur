var Page = require('../../../../lib/page.js'),
    ParagraphSectionModule = require('../modules/paragraph.js'),
    TableModule = require('../modules/table.js'),
    inherits = require('util').inherits;

function CssTestPage() {
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
    },
    'notUsedElement': {
      selector: '#notUsedSelector'
    },
    testLink: {
      selector: 'a[title="test link"]'
    }
  };
}

inherits(CssTestPage, Page);

CssTestPage.url = 'http://localhost:9001/html-elements.html';
CssTestPage.wait = 0;
module.exports = CssTestPage;