var chai        = require('chai'),
    expect      = chai.expect,
    Browser     = require('../../../').Browser,
    Keys        = Browser.Keys,
    TodoMVCPage = require('../pages/TodoMVCPage'),
    browserName = process.env.CHAUFFEUR_BROWSER || 'phantomjs';

describe('TodoMVC', function() {
  var browser,
      mvcLib = {
        mvcLibUrl: process.env.mvcLib || 'architecture-examples/backbone/'
      },
      TODO_ITEM_ONE,
      TODO_ITEM_TWO,
      TODO_ITEM_THREE;

  TODO_ITEM_ONE = 'buy some cheese';
  TODO_ITEM_TWO = 'feed the cat';
  TODO_ITEM_THREE = 'book a doctors appointment';

  this.timeout(200000);
  function createStandardItems(page) {
    page.newTodo.setValue(TODO_ITEM_ONE + Keys.RETURN);
    page.newTodo.setValue(TODO_ITEM_TWO + Keys.RETURN);
    page.newTodo.setValue(TODO_ITEM_THREE + Keys.RETURN);
  }

  beforeEach(function(done){
    var config = {
      webDriverClass: 'webdriverio',
      webDriverConfig: {
        desiredCapabilities: {
          browserName:  browserName,
          databaseEnabled: true,
          webStorageEnabled: true // for future phantomjs when it supports it
        },
        logLevel: 'silent',
        singleton: false
      }
    };
    browser = new Browser(config);
    browser.init(done);
  });

  after(function(done) {
    browser
        .resolveWith(done)
        .endAll();
  });

  afterEach(function(done) {
    browser
        .resolveWith(done)
        .end();
  });

  describe(mvcLib.mvcLibUrl.toString(), function() {
    describe('No todos', function () {
      it('should hide #main and #footer', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                return;
              }
              this.todoList.items.exists(false);
              this.mainSection.invisible();
              this.footerSection.invisible();
              this.end();
            })
            .resolveWith(done);
      });
    });

    describe('New Todo', function () {
      it('should allow me to add todo items', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              this.newTodo.setValue(TODO_ITEM_ONE + Keys.RETURN);
              this.todoList.items(1).text(TODO_ITEM_ONE);

              this.newTodo.setValue(TODO_ITEM_TWO + Keys.RETURN);
              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.end();
            })
            .resolveWith(done);
      });

      it('should clear text input field when an item is added', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              this.newTodo.setValue(TODO_ITEM_ONE + Keys.RETURN);
              this.newTodo.hasValue('');
              this.end();
            })
            .resolveWith(done);
      });

      it('should append new items to the bottom of the list', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.todoList.items.count(3);
              this.todoList.items(1).text(TODO_ITEM_ONE);
              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.todoList.items(3).text(TODO_ITEM_THREE);
              this.end();
            })
            .resolveWith(done);
      });

      it('should trim text input', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              this.newTodo.setValue('   ' + TODO_ITEM_ONE + '  ' + Keys.RETURN);
              this.todoList.items(1).text(TODO_ITEM_ONE);
              this.end();
            })
            .resolveWith(done);
      });

      it('should show #main and #footer when items added', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              this.newTodo.setValue(TODO_ITEM_ONE + Keys.RETURN);
              this.mainSection.visible();
              this.footerSection.visible();
              this.end();
            })
            .resolveWith(done);
      });
    });
    describe('Mark all as completed', function () {
      it('should allow me to mark all items as completed', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.toggleAll.klick();
              this.todoList.items(1).isCompleted();
              this.todoList.items(2).isCompleted();
              this.todoList.items(3).isCompleted();
              this.end();
            })
            .resolveWith(done);
      });

      it('should allow me to clear the completion state of all items', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.toggleAll.klick();
              this.toggleAll.klick();

              this.todoList.items(1).isNotCompleted();
              this.todoList.items(2).isNotCompleted();
              this.todoList.items(3).isNotCompleted();
              this.end();
            })
            .resolveWith(done);
      });

      it('complete all checkbox should update state when items are completed / cleared', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.toggleAll.klick();

              this.todoList.items(1).isCompleted();
              this.todoList.items(2).isCompleted();
              this.todoList.items(3).isCompleted();

              // all items are complete, now mark one as not-complete
              this.todoList.items(1).toggleStatus();
              this.toggleAll.unselected();

              // now mark as complete, so that once again all items are completed
              this.todoList.items(1).toggleStatus();
              this.toggleAll.selected();
              this.end();
            })
            .resolveWith(done);
      });
    });

    describe('Item', function () {
      it('should allow me to mark items as complete', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }

              this.newTodo.setValue(TODO_ITEM_ONE + Keys.RETURN);
              this.newTodo.setValue(TODO_ITEM_TWO + Keys.RETURN);

              this.todoList.items(1).toggleStatus();
              this.todoList.items(1).isCompleted();
              this.todoList.items(2).isNotCompleted();

              this.todoList.items(2).toggleStatus();
              this.todoList.items(1).isCompleted();
              this.todoList.items(2).isCompleted();
              this.end();
            })
            .resolveWith(done);
      });

      it('should allow me to un-mark items as complete', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }

              this.newTodo.setValue(TODO_ITEM_ONE + Keys.RETURN);
              this.newTodo.setValue(TODO_ITEM_TWO + Keys.RETURN);

              this.todoList.items(1).toggleStatus();
              this.todoList.items(1).isCompleted();
              this.todoList.items(2).isNotCompleted();

              this.todoList.items(1).toggleStatus();
              this.todoList.items(1).isNotCompleted();
              this.todoList.items(2).isNotCompleted();
              this.end();
            })
            .resolveWith(done);
      });

      it('should allow me to edit an item', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }

              createStandardItems(this);
              this.todoList.items(1).editItem('buy some sausages');
              this.todoList.items(1).text('buy some sausages');
              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.todoList.items(3).text(TODO_ITEM_THREE);
              this.end();
            })
            .resolveWith(done);
      });

      it('should show the remove button on hover', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }

              createStandardItems(this);
              this.todoList.items(1).remove.invisible();
              this.todoList.items(1).moveTo();
              this.todoList.items(1).remove.visible();
              this.end();
            })
            .resolveWith(done);
      });
    });

    describe('Editing', function () {
      it('should hide other controls when editing', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }

              createStandardItems(this);
              this.todoList.items(1).toggle.visible();
              this.todoList.items(1).label.doubleklick();
              this.todoList.items(1).toggle.invisible();
              this.todoList.items(1).label.invisible();
              this.end();
            })
            .resolveWith(done);
      });

      it('should save edits on enter', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }

              createStandardItems(this);
              this.todoList.items(1).label.doubleklick();
              this.todoList.items(1).edit.setValue('buy some sausages' + Keys.RETURN);
              this.todoList.items(1).text('buy some sausages');
              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.todoList.items(3).text(TODO_ITEM_THREE);
              this.end();
            })
            .resolveWith(done);
      });

      it('should save edits on blur', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }

              createStandardItems(this);
              this.todoList.items(1).label.doubleklick();

              this.todoList.items(1).edit.setValue('buy some sausages' + Keys.RETURN);
              this.todoList.items(1).toggleStatus();
              this.todoList.items(1).text('buy some sausages');
              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.todoList.items(3).text(TODO_ITEM_THREE);
              this.end();
            })
            .resolveWith(done);
      });

      it('should trim entered text', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }

              createStandardItems(this);
              this.todoList.items(1).label.doubleklick();
              this.todoList.items(1).edit.setValue('    buy some sausages  ' + Keys.RETURN);

              this.todoList.items(1).text('buy some sausages');
              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.todoList.items(3).text(TODO_ITEM_THREE);
              this.end();
            })
            .resolveWith(done);
      });

      it('should remove the item if an empty text string was entered', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.todoList.items(1).label.doubleklick();
              this.todoList.items(1).edit.setValue('' + Keys.RETURN);

              this.todoList.items(1).text(TODO_ITEM_TWO);
              this.todoList.items(2).text(TODO_ITEM_THREE);
              this.end();
            })
            .resolveWith(done);
      });

      it('should cancel edits on escape', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }

              createStandardItems(this);
              this.todoList.items(1).label.doubleklick();

              this.todoList.items(1).edit.setValue('foo' + Keys.ESCAPE);

              this.todoList.items(1).text(TODO_ITEM_ONE);
              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.todoList.items(3).text(TODO_ITEM_THREE);
              this.end();
            })
            .resolveWith(done);
      });
    });

    describe('Counter', function () {
      it('should display the current number of todo items', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              this.newTodo.setValue(TODO_ITEM_ONE + Keys.RETURN);
              this.todoCount.text('1 item left');
              this.newTodo.setValue(TODO_ITEM_TWO + Keys.RETURN);
              this.todoCount.text('2 items left');
              this.end();
            })
            .resolveWith(done);
      });
    });

    describe('Clear completed button', function () {
      it('should display the number of completed items', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }

              createStandardItems(this);
              this.todoList.items(1).toggleStatus();
              this.clearCompleted.text('Clear completed (1)');
              this.todoList.items(2).toggleStatus();
              this.clearCompleted.text('Clear completed (2)');
              this.end();
            })
            .resolveWith(done);
      });

      it('should remove completed items when clicked', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.todoList.items(1).toggleStatus();
              this.clearCompleted.klick();
              this.todoList.items.count(2);
              this.todoList.items(1).text(TODO_ITEM_TWO);
              this.todoList.items(2).text(TODO_ITEM_THREE);
              this.end();
            })
            .resolveWith(done);
      });

      it('should be hidden when there are no items that are completed', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.todoList.items(1).toggleStatus();
              this.clearCompleted.visible();
              this.clearCompleted.klick();
              this.clearCompleted.exists(false);
              this.end();
            })
            .resolveWith(done);
      });
    });

    describe('Routing', function () {
      it('should allow me to display active items', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.todoList.items(2).toggleStatus();
              this.activeFilter.klick();
              this.todoList.items(1).text(TODO_ITEM_ONE);
              this.todoList.items(3).text(TODO_ITEM_THREE);
              this.todoList.items(2).invisible();
              this.end();
            })
            .resolveWith(done);
      });

      it('should respect the back button', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.todoList.items(2).toggleStatus();

              this.activeFilter.klick();
              this.completedFilter.klick();

              // should show completed items
              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.todoList.items(2).visible();

              // then active items
              this.back();
              this.todoList.items(1).text(TODO_ITEM_ONE);
              this.todoList.items(3).text(TODO_ITEM_THREE);
              this.todoList.items(2).invisible();

              // then all items
              this.back();
              this.todoList.items(1).text(TODO_ITEM_ONE);
              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.todoList.items(3).text(TODO_ITEM_THREE);
              this.todoList.items(2).visible();
              this.end();
            })
            .resolveWith(done);
      });

      it('should allow me to display completed items', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.todoList.items(2).toggleStatus();
              this.completedFilter.klick();

              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.todoList.items(1).invisible();
              this.todoList.items(2).visible();
              this.todoList.items(3).invisible();
              this.end();
            })
            .resolveWith(done);
      });

      it('should allow me to display all items', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);
              this.todoList.items(2).toggleStatus();

              // apply the other filters first, before returning to the 'all' state
              this.activeFilter.klick();
              this.completedFilter.klick();
              this.allFilter.klick();

              this.todoList.items(1).text(TODO_ITEM_ONE);
              this.todoList.items(2).text(TODO_ITEM_TWO);
              this.todoList.items(3).text(TODO_ITEM_THREE);
              this.end();
            })
            .resolveWith(done);
      });

      it('should highlight the currently applied filter', function (done) {
        browser
            .to(TodoMVCPage, mvcLib)
            .at(TodoMVCPage, function (err) {
              if (err) {
                done(err);
              }
              createStandardItems(this);

              // initially 'all' should be selected
              this.allFilter.klick();

              this.activeFilter.klick();
              this.activeFilter.hasClass('selected');
              this.allFilter.hasntClass('selected');
              this.completedFilter.hasntClass('selected');

              this.completedFilter.klick();
              this.completedFilter.hasClass('selected');
              this.activeFilter.hasntClass('selected');
              this.allFilter.hasntClass('selected');
              this.end();
            })
            .resolveWith(done);
      });
    });
  });
});