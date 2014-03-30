var Page = require('../../../').Page,
    TodoListModule = require('../modules/TodoListModule'),
    inherits = require('util').inherits;

function TodoMVCPage() {
  this.title = 'Backbone.js • TodoMVC';
  this._content = {
    'mainSection'     : '#main',
    'footerSection'   : '#footer',
    'newTodo'         : '#new-todo',
    'toggleAll'       : '#toggle-all',
    'todoCount'       : '#todo-count',
    'clearCompleted'  : '#clear-completed',
    'allFilter'       : '#filters li:nth-child(1) a',
    'activeFilter'    : '#filters li:nth-child(2) a',
    'completedFilter' : '#filters li:nth-child(3) a',
    'todoList'        : {
      required: true,
      module: TodoListModule
    }

  };
}

inherits(TodoMVCPage, Page);

TodoMVCPage.url = 'http://todomvc.com/{mvcLibUrl}';
TodoMVCPage.wait = 2000;


TodoMVCPage.prototype.newTodo = function newTodo(itemText) {
  this.newTodo.keys(itemText);
};

TodoMVCPage.prototype.filterByAllItems = function filterByAllItems() {
  this.filters(1).klick();
};

TodoMVCPage.prototype.filterByActiveItems = function filterByActiveItems() {
  this.filters(2) .klick();
};

TodoMVCPage.prototype.filterByCompletedItems = function filterByCompletedItems() {
  this.filters(3).klick();
};

module.exports = TodoMVCPage;

