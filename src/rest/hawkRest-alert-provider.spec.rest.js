describe('Provider: Hawkular live REST', function() {

  var HawkularInventory;
  var res;
  var httpReal;
  var $http;

  var restResolve = function(result, done){
    httpReal.submit();

    result.$promise.then(function(){
    }, function(error){
      fail(errorFn(error));
    }).finally(function(){
      done();
    });
  };

  beforeEach(module('hawkular.services', 'httpReal'));

  beforeEach(inject(function(_HawkularInventory_, _$resource_, _httpReal_, _$http_) {
    HawkularInventory = _HawkularInventory_;
    res = _$resource_;
    httpReal = _httpReal_;
    $http = _$http_;
  }));

  describe('Resources: ', function() {

    describe('creating a resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var data = {
          data : [
            { id: 'NumericData-01',
              type : 'numeric',
              value : 0.1
            }
          ]
        };

        var myres = res('http://localhost:8080/hawkular-bus/message/MetricsTopic', {});
        var result = myres.save(data);

        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });
});
