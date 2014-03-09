# Chauffeur [![build status](https://secure.travis-ci.org/lawrencec/chauffeur.png)](http://travis-ci.org/lawrencec/chauffeur)

Status: Experimental

A cross browser library for writing functional tests.

This is a wrapper around [webdriverjs](https://github.com/camme/webdriverjs/), a webdriver module for js, hoping to provide a
different api (using page objects) in which to write functional tests using webdriver.

## Installation

This module can be installed via npm:

``` bash
$ npm install page-chauffeur
```

or via a git clone :

``` bash
$ npm install .
```

Once installed, require it like so:

``` js
var chauffeur = require('page-chauffeur');
```

## Github example

The following is an example of what the current api looks like using existing webdriverjs callbacks

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

And with no callbacks:

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
Requires selenium to be running and phantomjs if no other browser is specified (see integration tests section).

``` bash
$ mocha -R spec ./examples/github-with-mocha.js
```

## Examples

The examples directory, following the example given by the webdriverjs project, provides a few examples of how to run tests using various test frameworks. See the following code snippet for information on how to run each:

``` bash
$ cd examples
$ npm install
$ node github-with-buster.js 
$ mocha github-with-jasmine.js
$ mocha github-with-mocha.js
$ mocha github-with-mocha-with-chai.js
```

## Running under other browsers

By default these examples (and the integration tests for chauffeur) will run under phantomjs. Other browsers can be specified using the <code>CHAUFFEUR_BROWSER</code> environment variable.

``` bash
CHAUFFEUR_BROWSER=firefox npm run test-int
cd examples
CHAUFFEUR_BROWSER=firefox mocha github-with-mocha.js
```

There is a single command, defined in the scripts section of <code>examples/package.json</code> which will run all the examples in a specific browser(s).

``` bash
$ cd examples
$ npm run examples
$ npm run examples-ff
$ npm run examples-chrome
$ npm run examples-all # all the above
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
$ npm run test
```

### Integration tests

The integration tests run against a browser using a running instance of selenium server.

Using the selenium-standalone package, start a selenium server

``` bash
$ npm install --production selenium-standalone -g
$ start-selenium
```

Then in a separate terminal run the following to run the integration tests against the default browser, Firefox.

``` bash
$ npm run test-int
```

To run the integration tests using a different browser i.e Chrome

``` bash
$ CHAUFFEUR_BROWSER=chrome npm run test-int
```

Like the examples, there is a single command, defined in the scripts section of <code>package.json</code> which will run all the examples in a specific browser(s).

``` bash
$ npm run test-int
$ npm run test-int-ff
$ npm run test-chrome
$ npm run test-int-all # all the above
```


### Coverage

A coverage report can be found in target/lcov-report/index.html after the following command (requires global and non-global install of mocha)

``` bash
$ npm run coverage
```

## Todo

- <del>Expose more of the webdriver api with nicer syntax</del>
- <del>Allow nested page modules</del>
- <del>Provide examples using test runners other than Mocha</del>


