var Module = require('../../../').Module,
    TopNav = require('./topNav'),
    inherits = require('util').inherits;

function CommandBar() {
  this.baseSelector = '.command-bar';

  this._content = {
    'field' : {
      'selector': '#js-command-bar-field'
    },
    'topNav': {
      required: true,
      module: TopNav
    }
  };
}

inherits(CommandBar, Module);

module.exports = CommandBar;