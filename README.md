# Chauffeur [![Build Status](https://drone.io/github.com/lawrencec/chauffeur/status.png)](https://drone.io/github.com/lawrencec/chauffeur/latest)


A cross browser library for writing functional tests. Based around the page object pattern, it improves the ease of writing functional tests. The general priniciple is that instead of explicity asserting on a specific value, you pass in the values you expect and the assertation is done implicitly. If you prefer callback syntax chauffeur allows that too.

## Dependencies:

Chauffeur requires a webdriver library in order to run tests in a browser. Currently support is for the following of which only one is needed.

* [WebdriverIO](http://webdriver.io/) [Default]
* [selenium webdriverjs](http://selenium.googlecode.com/git/docs/api/javascript/index.html)

# Usage

An example of what a functional test can look like with chauffeur:
``` js
 client
    .to(GithubPage)
    .at(GithubPage, function(err) {
      if(err) {
        return;
      }
      this.headerLogo()
          .size({width:89, height: 32})
          .width('89px')
          .color('rgba(51,51,51,1)')
          .visible()
          .signUpForm()
          .size({width: 320, height: 296})
          .end(done);
    });
```

and with callbacks:

``` js
client
    .to(GithubPage)
    .at(GithubPage, function(err) {
      if(err) {
        return;
      }
      this.headerLogo()
          .size(function(err, result) {
            expect(err).to.be.null;
            assert.strictEqual(result.height , 32);
            assert.strictEqual(result.width, 89);
          })
          .width(function(err, result){
            expect(err).to.be.null;
            assert.strictEqual(result, '89px');
          })
          .color(function(err, result) {
            expect(err).to.be.null;
            assert.strictEqual(result, 'rgba(51,51,51,1)');
          })
          .visible()
          .cssProperty('a[href="/plans"]', 'color', function(err, result) {
            expect(err).to.be.null;
            assert.strictEqual(result, 'rgba(65,131,196,1)');
          })
          .getTitle(function(err, title) {
            expect(err).to.be.null;
            assert.strictEqual(title,'GitHub · Build software better, together.');
          })
      .signUpForm()
          .size(function(err, result) {
            expect(err).to.be.null;
            assert.strictEqual(result.width, 320);
            assert.strictEqual(result.height , 296);
          })
          .end(done);
    });
```

## Installation

This module can be installed via npm:

``` bash
$ npm install page-chauffeur
```

or via a git clone :

``` bash
$ cd page-chauffeur
$ npm install .
```

Once installed, require it like so:

``` js
var chauffeur = require('page-chauffeur');
```

## Examples

The examples are setup with their own package.json file and dependecies. First install the dependencies.

``` bash
$ cd examples
$ npm install
```

### TodoMVC

The TodoMVC subdirectory is an ported example of the tests that exist for the [TodoMVC](http://todomvc.com/) project. Running the todomvc grunt task runs the tests against the default library, Backbone. At the time of writing, phantomjs does not support localstorage so the tests need to run in something other than phantomjs eg firefox:

``` bash
cd examples/TodoMVC
CHAUFFEUR_BROWSER=firefox grunt todomvc
```

The tests can also be setup to run against another framework supported by the TodoMVC project. Just set the *mvcLib* property to the relevant url (without the domain):

``` bash
cd examples/TodoMVC
CHAUFFEUR_BROWSER=firefox mvcLib=mvcLib=architecture-examples/angularjs/ grunt todomvc
```

### Github example

The examples/Github directory, following the example given by the webdriverjs project, provides a few examples of how to run tests using various test frameworks. See the following code snippet for information on how to run each:

``` bash
$ cd Github
$ node github-with-buster.js
$ mocha github-with-jasmine.js
$ mocha github-with-mocha.js
$ mocha github-with-mocha-with-chai.js
```

There is a single command, defined in the scripts section of <code>examples/package.json</code> which will run all the examples in a specific browser(s).

``` bash
$ cd examples/Github
$ npm run examples
$ npm run examples-ff
$ npm run examples-chrome
$ npm run examples-all # all the above
```

## Running under other browsers

By default these examples (and the integration tests for chauffeur) will run under phantomjs. Other browsers can be specified using the <code>CHAUFFEUR_BROWSER</code> environment variable.

``` bash
CHAUFFEUR_BROWSER=firefox grunt test-int
cd examples
CHAUFFEUR_BROWSER=firefox grunt github
```

## Specifying different webdriver library

Chauffeur can switch which webdriver library it uses via a env var called `CHAUFFEUR_WEBDRIVER_LIB`. The valid values for this var is `webdriverio` or `webdriverjs`. The default is webdriverio.

``` bash
CHAUFFEUR_BROWSER=firefox CHAUFFEUR_WEBDRIVER_LIB=webdriverjs grunt test-int
```

## API

The following is an example of the current supported API. This snippet is for documentation purposes only as the [ContentSpec integration test](https://github.com/lawrencec/chauffeur/blob/master/test/integration/contentSpec.js) shows working code example of every method currently supported.

``` js
 client
    .to(MyOwnPage)
    .at(MyOwnPage, function(err) {
      if(err) {
        return;
      }
 	this.headerLogo()
            .size({width:89, height: 32})
            .width('89px')
            .color('rgba(51,51,51,1)')
            .visible()
            .invisible()
            .location({x:1, y:1})
            .nodeName('div');
	this.subHeading
	      .text('text')
	      .exists()
            .exists(false);
	this.checkbox
            .selected()
           .unselected();
        this.textField
            .hasValue('someValue')
            .value('newValue')
            .clear()
            .attr('id', 'username')
            .enter('some keys');
        this.todoList(1)
            .text('book')
        this.todoList(2)
            .text('bluray')
        this.actionBtn
            .klick()
	    .wait('500');
        this.loginForm.submit();
            .end(done);
    });
```


## Tests

### Unit tests

``` bash
$ grunt test
```

### Integration tests

The integration tests run against a browser using a running instance of selenium server.

The grunt task test-int runs a selenium server (via grunt-selenium-webdriver) prior to running the tests and since npm test-int is 'aliased' to grunt test-int both can be used to run the integration tests:

``` bash
$ npm run test-int
```

or
``` bash
$ grunt test-int
```

To run the integration tests using a different browser i.e Chrome

``` bash
$ CHAUFFEUR_BROWSER=chrome grunt test-int
```

### Coverage

A coverage report can be found in target/unit/lcov-report/index.html after the following command (requires global and non-global install of mocha)

``` bash
$ grunt coverage
```

## Todo

- Provide CucumberJS examples
- <del>Provide alternative to WebdriverIO (selenium webdriverjs)</del>


