var sinonChai = require('sinon-chai'),
    chai        = require('chai'),
    mock = require('sinon').mock,
    spy = require('sinon').spy,
    stub = require('sinon').stub,
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
  var ct,
      ContentThing,
      ctxt = {
        getElementSize:         function(){},
        isVisible:              function(){},
        getElementCssProperty:  function(){},
        getCssProperty:         function(){},
        buttonClick:            function(){},
        clearElement:           function(){},
        pause:                  function(){},
        getLocation:            function(){},
        getTagName:             function(){},
        getText:                function(){},
        getValue:               function(){},
        setValue:               function(){},
        isSelected:             function(){},
        submitForm:             function(){},
        currentScope:           '.selector'
      };

  ContentThing = function ContentThing() {
    this._content = {
      aModule: {
        module: 'aModule'
      }
    };
  };
  ContentThing.prototype = {};
  Content.mixin(ContentThing);

  ct = new ContentThing();
  ct._mixinApi(ctxt);
  describe('mixin()', function() {
    it('should add existing Content properties and methods to target', function() {
      var destObject = {};
      destObject.prototype = {};

      Content.mixin(destObject);
      destObject.prototype.initialiseContent.should.be.a('function');
    });
  });

  describe('delegation occurs correctly', function() {

    describe('_mixinApi()', function() {
      unroll('mixed in #method should delegate to #delegate correctly',
        function(done, testArgs) {
          var mockContext = mock(ctxt);

          ctxt[testArgs.method].should.be.a('function');
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
          ['wait'       , 'pause'],
          ['klick'      , 'buttonClick'],
          ['clear'      , 'clearElement'],
          ['location'   , 'getLocation'],
          ['nodeName'   , 'getTagName'],
          ['text'       , 'getText'],
          ['selected'   , 'isSelected'],
          ['value'      , 'getValue'],
          ['submit'     , 'submitForm']
        ]
      );
    });

    it('value() should delegate correctly when getting value', function() {
      var mockContext = mock(ctxt);

      ctxt.value.should.be.a('function');
      mockContext.expects('getValue').once().withArgs('.selector');
      ctxt.value();
      mockContext.verify();
    });

   it('value() should delegate correctly when setting value', function() {
      var mockContext = mock(ctxt);

      ctxt.value.should.be.a('function');
      mockContext.expects('setValue').once().withArgs('.selector', 'newValue');
      ctxt.value('newValue', null, true);
      mockContext.verify();
    });
  });
});