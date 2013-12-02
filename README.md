# Chauffeur [![build status](https://secure.travis-ci.org/lawrencec/chauffeur.png)](http://travis-ci.org/lawrencec/chauffeur)

Status: Experimental

A cross browser library for writing functional tests.

This is a wrapper around [webdriverjs](https://github.com/camme/webdriverjs/), a webdriver module for js, hoping to provide a
different api in which to write functional tests using webdriver.

## Installation

This module can be installed via npm:

``` bash

$ npm install chauffeur

```

or via a git clone :

``` bash

$ npm install .

```

## Examples

### Github

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

A coverage report can be found in target/lcov-report/index.html after the following command

``` bash

$ npm run coverage

```

