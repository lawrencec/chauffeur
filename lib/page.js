var Content = require('./content');

function Page() {}

Page.prototype = {
  url: null,
  title: null,
  _content: {},
  at: function at(title) {
    return title === this.title;
  },

  init: function init(driver) {
    this._driver = driver;
    this.initialiseContent();
  },
  end: function end(cb) {
    return this.delegate('end').apply(this, arguments);
  }
};

Content.mixin(Content, Page.prototype);

Page.wait = 0;

module.exports = Page;