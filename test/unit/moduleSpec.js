var Module = require('../../lib/module.js'),
    sinonChai = require('sinon-chai'),
    chai   = require('chai'),
    expect = chai.expect,
    unroll = require('unroll');

chai.use(sinonChai);

describe('Module', function () {
  it('should instantiate correctly and return an object instance', function() {
    var mod = new Module();
    expect(mod).to.be.an('object');
    expect(mod.baseSelector).to.equal(null);
    expect(mod.baseNode).to.equal(null);
    expect(mod.required).to.equal(false);
    expect(mod.element).to.equal(null);
    expect(mod.initialiseContent).to.be.a('function');
  });

  unroll('init should set property #property correctly from config for expectation #propertyExpectation',
    function(done, testArgs) {
      var mod = new Module(),
          config = {
            parentSelector: ''
          };

      config[testArgs.configProperty] = testArgs.value;
      mod.init({}, config);
      expect(mod[testArgs.property]).to.equal(testArgs.propertyExpectation);
      done();
    },
    [
      ['configProperty', 'value'     , 'property'     , 'propertyExpectation' ],
      ['selector'      , 'selector'  , 'baseSelector' , 'selector'            ],
      ['selector'      , ''          , 'baseSelector' , 'null'                ],
      ['required'      , false       , 'required'     , false                 ],
      ['required'      , true        , 'required'     , true                  ],
      ['element'       , 'aSelector' , 'baseNode'     , 'aSelector'           ]
    ]
  );
});
