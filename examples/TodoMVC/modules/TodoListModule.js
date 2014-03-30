var Module = require('../../../').Module,
    inherits = require('util').inherits,
    TodoListItem = require('./TodoListItem');

function TodoListModule() {
  this.baseSelector = '#todo-list';

  this._content = {
    items             : {
      module: TodoListItem
    },
    'nonCompleted'    : 'li:not(.completed)'
  };
}

inherits(TodoListModule, Module);

TodoListModule.prototype.clearCompleted = function clearCompleted() {
  this.clearCompleted.klick();
};

TodoListModule.prototype.markAllCompleted = function markAllCompleted() {
  this.toggleAll.klick();
};



module.exports = TodoListModule;