var sinonChai = require('sinon-chai'),
    chai      = require('chai'),
    expect    = chai.expect,
    mock      = require('sinon').mock,
    stub      = require('sinon').stub,
    unroll    = require('unroll'),
    Content   = require('../../lib/content.js'),
    Driver    = require('../../lib/browser.js');
    Module    = require('../../lib/module.js');

chai.use(sinonChai);

describe('Content', function() {
  describe('_initialiseContent()', function() {
    var dummyModule = function dummyModule() {
      return {
        baseSelector: 'h1',
        init: function init(){}
      };
    };
    unroll('should initialise page content correctly when module type is #moduleName',
        function(done, testArgs) {
          var ct;

          function ContentThing() {
            this._content = {
              aModule: {
                module: testArgs.module
              }
            };
          }

          ContentThing.prototype = {};
          Content.mixin(Content, ContentThing.prototype);

          ct = new ContentThing();
          ct.initialiseContent();
          done();
        },
        [
          ['moduleType' , 'moduleName'  ],
          [dummyModule  , 'dummyModule' ],
          [Module       , 'aModule'     ]
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
        getAttribute:           function(){},
        keys:                   function(){},
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
  describe('mixin()', function() {
    it('should add existing Content properties and methods to target', function() {
      var destObject = {};
      destObject.prototype = {};

      Content.mixin(Content, destObject.prototype);
      expect(destObject.prototype.initialiseContent).to.be.a('function');
    });
  });

  describe('delegation occurs correctly', function() {

    unroll('mixed in #method should delegate correctly',
      function(done, testArgs) {
        var contentObj = function(){},
            contentMock;

        contentObj.prototype = {};
        Content.mixin(Content, contentObj.prototype);

        contentObj = new contentObj();

        contentMock = mock(contentObj);
        contentMock.expects('delegate').withExactArgs(testArgs.method).returns(function(){});
        contentObj[testArgs.method]();
        contentMock.verify();

        done();
      },
      [
        ['method'     ],
        ['size'       ],
        ['width'      ],
        ['color'      ],
        ['cssProperty'],
        ['visible'    ],
        ['invisible'  ],
        ['wait'       ],
        ['klick'      ],
        ['clear'      ],
        ['location'   ],
        ['nodeName'   ],
        ['text'       ],
        ['selected'   ],
        ['value'      ],
        ['submit'     ],
        ['attr'       ],
        ['enter'      ],
        ['exists'     ]
      ]
    );

    describe('delegate()', function () {
      it('should delegate correctly when content has a baseSelector',
        function () {
          var contentObj = function(){};

          contentObj.prototype = {};
          Content.mixin(Content, contentObj.prototype);

          contentObj = new contentObj();

              contentObj._driver = stub({
            method: function() {}
          });

          contentObj.baseSelector = '.selector';
          contentObj.delegate('method')();
          expect(contentObj._driver.method).to.have.been.calledWith('.selector');
        }
      );

      it('should delegate correctly when content does not have a baseSelector',
          function () {
            var contentObj = function(){};

            contentObj.prototype = {};
            Content.mixin(Content, contentObj.prototype);

            contentObj = new contentObj();

            contentObj._driver = stub({
              method: function() {}
            });

            contentObj.delegate('method')();
            expect(contentObj._driver.method).to.have.been.calledWith();
          }
      );
    });
  });
});