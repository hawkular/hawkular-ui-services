describe('Provider: Hawkular live REST', function() {
  // todo: put credentials to each request, find out what is my tenant uuid and do the testsuite against it
  // also test if the stuff was precreated correctly

  var HawkularInventory;
  var res;
  var httpReal;
  var $http;

  var debug = false;
  var suffix = '-test-' + new Date().getTime();
  var tId;
  var typeId = 'type' + suffix;
  var eId = 'environment' + suffix;
  var rId = 'resource-1' + suffix;
  var rId2 = 'resource-2' + suffix;
  var rId3 = 'resource-3' + suffix;
  var mtId = 'cpu.freq' + suffix;
  var mId1 = 'metric.cpu1.freq' + suffix;
  var mId2 = 'metric.cpu2.freq' + suffix;

  var restPromiseResolve = function(promise, done, finallyDo){
    httpReal.submit();

    promise.then(function(){},
      function(error){
        debug && dump('call failed with: ' + JSON.stringify(error));
        done();
        fail(errorFn(error));
      }).finally(function(){
        debug && dump('..done');
        finallyDo && finallyDo();
        done();
      });
  };

  var restResolve = function(result, done){
    restPromiseResolve(result.$promise, done);
  };

  beforeEach(module('hawkular.services', 'httpReal', function(HawkularInventoryProvider) {
    /** @namespace __karma__.config.hostname */
    HawkularInventoryProvider.setHost(__karma__.config.hostname);
    /** @namespace __karma__.config.port */
    HawkularInventoryProvider.setPort(__karma__.config.port);
  }));

  beforeEach(inject(function(_HawkularInventory_, _$resource_, _httpReal_, _$http_) {
    HawkularInventory = _HawkularInventory_;
    res = _$resource_;
    httpReal = _httpReal_;
    $http = _$http_;

    // it assumes we are running the tests against the hawkular built with -Pdev profile
    // 'amRvZTpwYXNzd29yZA==' ~ jdoe:password in base64
    $http.defaults.headers.common['Authorization'] = 'Basic amRvZTpwYXNzd29yZA==';

    // current rest implementation doesn't allow for different origins (despite the fact the
    // 'Access-Control-Allow-Origin: *' header is set)
    // $http.defaults.headers.common['Origin'] = 'http://127.0.0.1:8080';
  }));

  describe('Resources: ', function() {

    var resolved = false;
    describe('creating a resource', function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var environment = {
          id: eId
        };
        var resourceType = {
          id: typeId
        };
        var resource = {
          id: rId,
          resourceTypeId: typeId
        };

        var deleteTenant = function() {
          debug && dump('deleting auto-created tenant..');
          return HawkularInventory.Tenant.delete({}).$promise;
        };
        var getTenant = function() {
          debug && dump('retrieving auto-created tenant..');
          return HawkularInventory.Tenant.get({}).$promise;
        };
        var createEnv = function() {
          debug && dump('creating environment..', environment);
          return HawkularInventory.Environment.save({}, environment).$promise;
        };
        var createResourceType = function() {
          debug && dump('creating resource type..', resourceType);
          return HawkularInventory.ResourceType.save({}, resourceType).$promise;
        };
        var createResource = function() {
          debug && dump('creating resource' + rId + '..');
          return HawkularInventory.Resource.save({environmentId: eId}, resource).$promise;
        };
        var err = function(fault) {
          debug && dump('call failed with: ' + JSON.stringify(fault));
          done();
          fail(errorFn(fault));
        };
        var finish = function(){
          resolved = true;
        };

        result = deleteTenant()
        .then(getTenant())
        .then(function(tenant) {
          tId = tenant.id;
          createEnv();
        })
        .then(createResourceType)
        .then(createResource)
        .catch(err);
        restPromiseResolve(result, done, finish);
      });

      it('should resolve', function() {
        expect(resolved).toBeTruthy();
      });
    });

    describe('getting a resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        debug && dump('querying resource ' + rId + '..');
        result = HawkularInventory.Resource.query({environmentId: eId});
        restResolve(result, done);
      });
      it('should get previously created resource', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(1);
        expect(result[0].id).toEqual(rId);
      });
    });

    describe('creating another resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var resource = {
          id: rId2,
          resourceTypeId: typeId
        };
        debug && dump('creating resource ' + rId2 + '..');
        result = HawkularInventory.Resource.save({environmentId: eId}, resource);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('getting a resource list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({environmentId: eId});
        restResolve(result, done);
      });

      it('should get two resources', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(2);
      });
    });

    describe('getting the resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.get({environmentId: eId, resourceId: rId2});
        restResolve(result, done);
      });

      it('should get only previously created resource', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.id).toEqual(rId2);
      });
    });

    describe('deleting the resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        debug && dump('deleting resource ' + rId2 + '..');
        result = HawkularInventory.Resource.delete({environmentId: eId, resourceId: rId2});
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('getting a resource list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({environmentId: eId});
        restResolve(result, done);
      });

      it('should get only a single resource after deleting one', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(1);
      });
    });

    describe('creating yet another resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var resource = {
          id: rId3,
          resourceTypeId: typeId
        };

        debug && dump('creating resource ' + rId3 + '..');
        result = HawkularInventory.Resource.save({environmentId: eId}, resource);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

  });

  describe('Metrics: ', function() {

    describe('creating a metric', function() {
      var resolved = false;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var metricType = {
          id: mtId,
          unit: 'SECONDS'
        };
        var metric = {
          id: mId1,
          metricTypeId: mtId
        };

        var createMetricType = function() {
          debug && dump('creating metric type ' + mtId + '..');
          return HawkularInventory.MetricType.save({}, metricType).$promise;
        };
        var createMetric = function() {
          debug && dump('creating metric ' + mId1 + '..');
          return HawkularInventory.Metric.save({environmentId: eId}, metric).$promise;
        };
        var associateMetric = function() {
          debug && dump('associating metric ' + mId1 + ' with resource ' + rId3 + '..');
          return HawkularInventory.ResourceMetric.save({environmentId: eId, resourceId: rId3}, [mId1]).$promise;
        };
        var err = function(fault) {
          debug && dump('call failed with: ' + JSON.stringify(fault));
          done();
          fail(errorFn(fault));
        };
        var finish = function() {
          resolved = true;
        };

        var result = createMetricType().then(createMetric).then(associateMetric).catch(err);
        restPromiseResolve(result, done, finish);
      });

      it('should resolve', function() {
        expect(resolved).toBeTruthy();
      });
    });

    describe('getting a metric on resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.ResourceMetric.query({environmentId: eId, resourceId: rId3});
        restResolve(result, done);
      });

      it('should be there', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(1);
        expect(result[0].id).toEqual(mId1);
      });
    });

    describe('getting a metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Metric.get({environmentId: eId, metricId: mId1});
        restResolve(result, done);
      });

      it('should get previously created metric', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.id).toEqual(mId1);
        expect(result.type.unit).toEqual('SECONDS');
      });
    });

    describe('creating a metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var metric = {
          id: mId2,
          metricTypeId: mtId
        };
        debug && dump('creating metric ' + mId2 + '..');
        result = HawkularInventory.Metric.save({environmentId: eId}, metric);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('getting a metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Metric.get({environmentId: eId, metricId: mId2});
        restResolve(result, done);
      });

      it('should get the newly created metric', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.id).toEqual(mId2);
        expect(result.type).toBeDefined();
        expect(result.type.unit).toEqual('SECONDS');
      });
    });
  });

  describe('Tenants/Environments: ', function() {

    describe('creating an environment', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var environment = {
          id: eId + 2
        };
        debug && dump('creating environment ' + eId + 2 + '..');
        result = HawkularInventory.Environment.save({}, environment);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('after creating new environment', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        debug && dump('creating metric ' + mId2 + '..');
        result = HawkularInventory.Environment.query({});
        restResolve(result, done);
      });

      it('there should be 3 of them', function() {
        // 2 manually created + 1 auto created
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(3);
      });
    });

    describe('deleting an environment', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        debug && dump('deleting environment ' + eId + '..');
        result = HawkularInventory.Environment.delete({environmentId: eId});
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('after deleting one environment', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Environment.query({});
        restResolve(result, done);
      });

      it('there should be still two left', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(2);
      });
    });

    describe('after deleting an environment', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({environmentId: eId});
        restResolve(result, done);
      });

      it('there should be no resources in it', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(0);
      });
    });

    describe('deleting tenant', function() {
      // delete everything with the tenant to make the test suite repeatable
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        debug && dump('deleting tenant ' + tId + '..');
        result = HawkularInventory.Tenant.delete({});
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('after deleting the tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Environment.query({});
        restResolve(result, done);
      });

      it('there should be one predefined environment in the auto-created tenant', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(1);
      });
    });

    describe('after deleting the tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({environmentId: eId});
        restResolve(result, done);
      });

      it('there should be no resources in it', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(0);
      });
    });

  });
});
