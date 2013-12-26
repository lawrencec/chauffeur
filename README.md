# Chauffeur [![build status](https://secure.travis-ci.org/lawrencec/chauffeur.png)](http://travis-ci.org/lawrencec/chauffeur)

Status: Experimental

A cross browser library for writing functional tests.

This is a wrapper around [webdriverjs](https://github.com/camme/webdriverjs/), a webdriver module for js, hoping to provide a
different api (using page objects) in which to write functional tests using webdriver. Currently the only example provided is for Mocha, though it should work fine in any test runner.

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

## Examples

### Github example

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

$ mocha -R spec ./examples/github.js

```

## Tests

### Unit tests

``` bash

$ npm run test

```

### Integration tests

The integration tests run against a browser using running instance of selenium server.
Download the selenium server standalone jar and run like so:

``` bash

java -jar path/to/your/selenium-server-standalone-2.35.0.jar

```

Then in a separate terminal run the following to run the integration tests against the default browser, Firefox.

``` bash

$ npm run test-int

```

To run the integration tests using a different browser i.e Chrome

``` bash

$ MOCHA_BROWSER=chrome npm run test-int

```

### Coverage

A coverage report can be found in target/lcov-report/index.html after the following command (requires global and non-global install of mocha)

``` bash

$ npm run coverage

```

## Todo

- Expose more of the webdriver api
- Allow nested page modules
- Provide examples using test runners other than Mocha


