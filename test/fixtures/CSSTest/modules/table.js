var inherits    = require('util').inherits,
    Module      = require('../../../../lib/module.js'),
    TableRowModule = require('./tablerow.js');

function TableModule() {
  this.baseSelector = 'table#primaryTable';
  this.required = true;
  this._content = {
    'rows': {
      module: TableRowModule
    }
  };
}

inherits(TableModule, Module);

module.exports = TableModule;
