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
          .call(done);
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
          .call(done);
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

### Coverage

A coverage report can be found in target/lcov-report/index.html after the following command (requires global and non-global install of mocha)

``` bash
$ npm run coverage
```

## Todo

- Expose more of the webdriver api with nicer syntax
- <del>Allow nested page modules</del>
- <del>Provide examples using test runners other than Mocha</del>


