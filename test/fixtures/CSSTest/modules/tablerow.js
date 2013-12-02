var inherits    = require('util').inherits,
    Module      = require('../../../../lib/module.js');

function TableRowModule() {
  this.required = true;
  this._content = {
    'data': 'td'
  };
}

inherits(TableRowModule, Module);

module.exports = TableRowModule;
