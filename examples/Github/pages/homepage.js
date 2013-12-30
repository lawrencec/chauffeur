var Page = require('../../../').Page,
    SignUpForm = require('../modules/signupForm.js'),
    CommandBar = require('../modules/commandBar.js'),
    inherits = require('util').inherits;

function GithubPage() {
  this.title = 'GitHub · Build software better, together.';
  this._content = {
    'headerLogo': {
      required: true,
      selector: '.header-logo-wordmark'
    },
    'signUpForm': {
      module: SignUpForm
    },
    'commandBar' : {
      module: CommandBar
    }
  };
}

inherits(GithubPage, Page);

GithubPage.prototype.url = 'https://github.com/';
GithubPage.wait = 0;
module.exports = GithubPage;