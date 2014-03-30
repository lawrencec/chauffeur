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
chai.should();

describe('Content', function() {
  var ContentThing;

  ContentThing = function ContentThing() {
    this._content = {
      aModule: {
        module: 'aModule'
      }
    };
  };
  ContentThing.prototype = {};
  Content.mixin(ContentThing);

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
        ['setValue'   ],
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

      unroll('should delegate correctly when content matches multiple elements',
        function (done, testArgs) {
          var contentObj = function(){};

          contentObj.prototype = {};
          Content.mixin(Content, contentObj.prototype);

          contentObj = new contentObj();

          contentObj._driver = stub({
            method: function() {}
          });

          contentObj.baseSelector = '.selector';
          contentObj.childSelectorIndex = testArgs.childSelector;
          contentObj.delegate('method')();
          expect(contentObj._driver.method).to.have.been.calledWith(testArgs.expectation);
          done();
        },
        [
            ['childSelector'    , 'expectation'             ],
            [undefined          , '.selector'               ],
            [1                  , '.selector:first-child'   ],
            [2                  , '.selector:nth-child(2)'  ],
            [-1                 , '.selector:last-child'    ]
        ]
      );

    });
  });
});