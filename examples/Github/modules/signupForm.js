var Module = require('../../../').Module,
    inherits = require('util').inherits;

function SignupForm() {
  this.baseSelector = '.form-signup-home';
}

inherits(SignupForm, Module);

module.exports = SignupForm;