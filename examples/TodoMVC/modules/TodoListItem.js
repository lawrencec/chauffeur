var Module = require('../../../').Module,
    Keys = require('../../../').Browser.Keys,
    inherits = require('util').inherits;

function TodoListItem() {
  this.baseSelector = 'li';

  this._content = {
    'toggle': 'input.toggle',
    'label' : 'label',
    'edit'  : 'input.edit',
    'remove': 'button.destroy'
  };
}

inherits(TodoListItem, Module);

TodoListItem.prototype.toggleStatus = function toggleStatus() {
  this.toggle.klick();
};

TodoListItem.prototype.editItem = function edit(itemText) {
  this.label.doubleklick();
  this.edit.setValue(itemText + Keys.RETURN);
};

TodoListItem.prototype.isCompleted = function isCompleted() {
  this.hasClass('completed');
};

TodoListItem.prototype.isNotCompleted = function isCompleted() {
  this.hasntClass('completed');
};

module.exports = TodoListItem;

