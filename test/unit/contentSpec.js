var sinonChai = require('sinon-chai'),
    chai        = require('chai'),
    mock = require('sinon').mock,
    spy = require('sinon').spy,
    unroll = require('unroll'),
    Content      = require('../../lib/content.js'),
    Driver = require('../../lib/driver.js');
    Module = require('../../lib/module.js');

chai.use(sinonChai);
chai.should();

describe('Content', function() {
  describe('_initialiseContent()', function() {
    var dummyModule = function dummyModule() {
      return {
        baseSelector: 'h1',
        init: function init(){}
      };
    };
    unroll('should initialise page content correctly',
        function(done, testArgs) {
          var spyThing,
              ctxt = {},
              ct;

          function ContentThing() {
            this._content = {
              aModule: {
                module: testArgs.module
              }
            };
          }

          ContentThing.prototype = {};
          Content.mixin(ContentThing);

          ct = new ContentThing();
          ct.initialiseContent(ctxt);

          ctxt.aModule.should.be.an('function');
          spyThing = spy(ctxt, 'aModule');
          ctxt.aModule();
          ctxt.currentScope = testArgs.moduleType.baseSelector;
          spyThing.returned(ctxt);
          done();
        },
        [
          ['moduleType'],
          [dummyModule],
          [Module]
        ]);
  });
});

describe('Content', function() {
  describe('mixin()', function() {
    it('should add existing Content properties and methods to target', function() {
      var destObject = {};
      destObject.prototype = {};

      Content.mixin(destObject);
      destObject.prototype.initialiseContent.should.be.a('function');
    });
  });

  describe('_mixinApi()', function() {
    unroll('mixed in #method should delegate to #delegate correctly',
        function(done, testArgs) {
          var ctxt,
              ct;

          ctxt = {
            getElementSize: function() {},
            isVisible: function(){},
            getElementCssProperty: function(){},
            getCssProperty: function(){},
            buttonClick: function(){}
          };

          function ContentThing() {
            this._content = {
              aModule: {
                module: testArgs.module
              }
            };
          }

          ContentThing.prototype = {};
          Content.mixin(ContentThing);

          ct = new ContentThing();
          ct._mixinApi(ctxt);
          ctxt[testArgs.method].should.be.a('function');
          mock(Driver);
          mockContext = mock(ctxt);
          mockContext.expects(testArgs.delegate).once();
          ctxt[testArgs.method]();
          mockContext.verify();
          done();
        },
        [
          ['method'     , 'delegate'],
          ['size'       , 'getElementSize'],
          ['width'      , 'getCssProperty'],
          ['color'      , 'getCssProperty'],
          ['cssProperty', 'getElementCssProperty'],
          ['visible'    , 'isVisible'],
          ['visible'    , 'isVisible'],
          ['invisible'  , 'isVisible'],
          ['click'      , 'buttonClick']
        ]
    );
  });
});