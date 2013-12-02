var inherits  = require('util').inherits,
    Module    = require('../../../../lib/module.js');

function ParagraphSectionModule() {
  this.baseSelector = '#paragraphsSection';
  this.required = true;
  this._content = {
    'paragraphs': 'p'
  };
}

inherits(ParagraphSectionModule, Module);

module.exports = ParagraphSectionModule;
