var Module = require('../../../').Module,
    inherits = require('util').inherits;

function TopNav() {
  this.baseSelector = 'ul.top-nav';

  this._content = {
    'links': {
      selector: 'li'
    }
  };
}

inherits(TopNav, Module);

module.exports = TopNav;