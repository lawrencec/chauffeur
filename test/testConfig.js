var Driver = require('../lib/driver'),
    drivers = require('../lib/drivers');

module.exports = {
  browser:        process.env.CHAUFFEUR_BROWSER || 'phantomjs',
  webdriverLib: process.env.CHAUFFEUR_WEBDRIVER_LIB,
  withDrivers: function(testSuiteName, testSuite) {
    var webdriverLibNames =  this.webdriverLib ?
                                [this.webdriverLib] : Object.keys(drivers);

    for (var i = 0, iLen = webdriverLibNames.length; i < iLen; i++) {
      var webDriverLib = webdriverLibNames[i];
      describe(testSuiteName +' ['+webDriverLib+']', testSuite(webDriverLib));
    }
  },
  expectToFailWithError: function expectToFailWithError(action, expectations) {
    Driver.resolveWith(expectations);
    action();
  },
  expectedError: function expectedError(message, expected, actual) {
    var error = new Error(message);
    error.expected = expected;
    error.actual = actual;
    return error;
  }
};