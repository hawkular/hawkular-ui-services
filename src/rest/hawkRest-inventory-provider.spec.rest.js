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
        var resource = {
          type: 'URL',
          id: 'inventoryResource',
          parameters: {
            url: 'http://hawkular.org'
          }
        };

        result = HawkularInventory.Resource.save({tenantId: 'rest-test'}, resource);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({tenantId: 'rest-test'});
        restResolve(result, done);
      });

      it('should get previously created resource', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].id).toEqual('inventoryResource');
      });
    });

    describe('creating another resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var resource = {
          type: 'URL',
          id: 'inventoryResource2',
          parameters: {
            url: 'http://hawkular.org'
          }
        };

        result = HawkularInventory.Resource.save({tenantId: 'rest-test'}, resource);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a resource list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({tenantId: 'rest-test'});
        restResolve(result, done);
      });

      it('should get two resources', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(2);
      });
    });

    describe('getting the resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({tenantId: 'rest-test', resourceId: 'inventoryResource'});
        restResolve(result, done);
      });

      it('should get only previously created resource', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.id).toEqual('inventoryResource');
      });
    });

    describe('deleting the resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.delete({tenantId: 'rest-test', resourceId: 'inventoryResource2'});
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a resource list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({tenantId: 'rest-test'});
        restResolve(result, done);
      });

      it('should get only a single resource after deleting one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
      });
    });

  });

  describe('Metrics: ', function() {

    describe('creating a metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var metric = {
          name:'cpu.load1',
          unit:'NONE',
          description:null
        };

        result = HawkularInventory.Metric.put({tenantId: 'rest-test', resourceId: 'inventoryResource'}, metric);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({tenantId: 'rest-test', resourceId: 'inventoryResource'});
        restResolve(result, done);
      });

      it('should get previously created resource', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual('cpu.load1');
        expect(result[0].unit).toEqual('NONE');
      });
    });

    describe('updating a metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var metric = {
          name:'cpu.load1',
          unit:'CM',
          description:null
        };

        result = HawkularInventory.Metric.put({tenantId: 'rest-test', resourceId: 'inventoryResource', metricId: 'cpu.load1'}, metric);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.get({tenantId: 'rest-test', resourceId: 'inventoryResource', metricId: 'cpu.load1'});
        restResolve(result, done);
      });

      it('should get previously updated metric', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.name).toEqual('cpu.load1');
        expect(result.unit).toEqual('CM');
      });
    });

  });
});
