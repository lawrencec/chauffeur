var Page = require('../../lib/page.js'),
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    mock = sinon.mock,
    spy = sinon.spy,
    chai   = require('chai'),
    expect = chai.expect,
    unroll = require('unroll');

chai.use(sinonChai);

describe('Page', function () {
  describe('constructor()', function() {
    it('should instantiate correctly and return an object instance', function() {
      var page = new Page();
      expect(page).to.be.an('object');
      expect(page.url).to.equal(null);
      expect(page.title).to.equal(null);
      expect(Object.keys(page._content).length).to.equal(0);
      expect(page.at).to.be.a('function');
      expect(page.init).to.be.a('function');
      expect(page.initialiseContent).to.be.a('function');
    });
  });

  describe('at()', function() {
    unroll('should correctly return correctly when page.title "foo" and browser page title is #title',
      function(done, testArgs) {
        var page = new Page(),
            retValue;

        page.title = 'foo';

        retValue = page.at(testArgs.title);
        expect(retValue).to.equal(testArgs.retValue);
        done();
      },
      [
        ['retValue' , 'title'],
        [true       , 'foo'  ],
        [false      , 'bar'  ]
      ]
    );
  });

  describe('init()', function() {
    it('should be called correctly', function() {
      var pageMock = mock(Page.prototype),
          pageInstance = new Page(),
          driver = 'aDriver';

      pageMock.expects('initialiseContent').withExactArgs();
      pageInstance.init(driver);
      expect(pageInstance._driver).to.equal(driver);
      pageMock.verify();
    });
  });

  describe('end()', function() {
    it('should be called correctly', function() {
      var pageMock = mock(Page.prototype),
          pageInstance = new Page(),
          callback = spy();

      pageMock.expects('delegate').withExactArgs('end').returns(callback);
      pageInstance.end(callback);

      expect(callback).to.have.been.called;

      pageMock.verify();
    });
  });
});
