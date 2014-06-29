## 0.3.0 (28-06-2014)


#### Features

* Now supports use of [selenium webdriverjs](http://selenium.googlecode.com/git/docs/api/javascript/index.html). [webdriverio](http://webdriver.io/) is still supported.

#### Breaking Changes

* Tests and after functions now need to be terminated with resolveWith(done) method instead of this.end(done) eg

    	//< 0.3.0
    	after(function(done) {
        browser.endAll();
        done();
        });

        afterEach(function(done) {
          browser.end();
          done();
        });
      
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
              this.end(done);
            });
        });

    	//0.3.0        	
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