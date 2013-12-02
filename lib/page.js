var Content = require('./content.js');

function Page() {}

Page.prototype = {
  url: null,
  title: null,
  _content: {},
  at: function at(title) {
    return title === this.title;
  },

  init: function init() {}
};

Content.mixin(Page);
Page.wait = 0;

module.exports = Page;