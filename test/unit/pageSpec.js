var Page = require('../../lib/page.js'),
    sinonChai = require('sinon-chai'),
    chai   = require('chai'),
    expect = chai.expect,
    unroll = require('unroll');

chai.use(sinonChai);
chai.should();

describe('Page', function () {
  describe('constructor()', function() {
    it('should instantiate correctly and return an object instance', function() {
      var page = new Page();
      page.should.be.an('object');
      expect(page.url).to.equal(null);
      expect(page.title).to.equal(null);
      expect(Object.keys(page._content).length).to.equal(0);
      page.at.should.be.a('function');
      page.init.should.be.a('function');
      page._mixinApi.should.be.a('function');
      page.initialiseContent.should.be.a('function');
    });
  });

  describe('at()', function() {
    unroll('should correctly return correctly when page.title "foo" and browser page title is #title',
      function(done, testArgs) {
        var page = new Page();
        page.title = 'foo';
        page.at(testArgs.title);
        done();
      },
      [
        ['retValue' , 'title'],
        [true       , 'foo'  ],
        [true       , 'bar'  ]
      ]
    );
  });

  describe('init()', function() {
    it('should be called correctly', function() {
      var page = new Page();
      var x = page.init();
      expect(x).to.equal(undefined);
    });
  });
});
