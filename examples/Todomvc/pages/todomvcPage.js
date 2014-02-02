var Page = require('chauffeur').Page,
    TodoAppModule = require('../modules/todoMVCApp.js');
    inherits = require('util').inherits;

function TodoMVCPage() {
  this.title = 'Backbone.js • TodoMVC';
  this._content = {
    'todoApp': {
      module: TodoAppModule
    }
  };
}

inherits(TodoMVCPage, Page);

TodoMVCPage.prototype.url = 'http://http://todomvc.com/architecture-examples/';
TodoMVCPage.wait = 0;
module.exports = TodoMVCPage;