/*
 * Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
describe('Provider: Hawkular live REST', function() {

  var HawkularMetric;
  var httpReal;
  var $http;

  var debug = false;
  var suffix = '-test-' + new Date().getTime();
  var tenantId1 = 'com.acme.sk' + suffix;
  var tenantId2 = 'com.acme.sk2' + suffix;
  var metricId = 'mymetric' + suffix;
  var counterId = 'mycounter' + suffix;

  var arrayContainsField = function(array, field, value) {
    for (var i = 0; i < array.length; i++) {
      var item = array[i];
      if (item.hasOwnProperty(field) && item[field] === value){
        return true;
      }
    }
    return false;
  };

  beforeEach(module('hawkular.services', 'httpReal', function(HawkularMetricProvider) {
    HawkularMetricProvider.setHost(__karma__.config.hostname);
    HawkularMetricProvider.setPort(__karma__.config.port);
  }));

  beforeEach(inject(function(_HawkularMetric_, _httpReal_, _$http_) {
    HawkularMetric = _HawkularMetric_;
    httpReal = _httpReal_;
    $http = _$http_;

    // it assumes we are running the tests against the hawkular built with -Pdev profile
    // 'amRvZTpwYXNzd29yZA==' ~ jdoe:password in base64
    $http.defaults.headers.common['Authorization'] = 'Basic amRvZTpwYXNzd29yZA==';
  }));

  describe('Tenants: ', function() {

    describe('creating a tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var tenant = {
          id: tenantId1
        };

        debug && dump('creating tenant..', tenant);
        result = HawkularMetric.Tenant.save(tenant);
        httpReal.submit();

        result.$promise.then(function(data){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('querying tenants', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        debug && dump('querying tenants..');
        result = HawkularMetric.Tenant.query();
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get previously created tenant only', function() {
        expect(result.$resolved).toBe(true);
        expect(arrayContainsField(result, 'id', tenantId1)).toBe(true);
      });
    });

    describe('creating another tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var tenant = {
          id: tenantId2
        };

        debug && dump('creating tenant..', tenant);
        result = HawkularMetric.Tenant.save(tenant);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('querying tenants', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        debug && dump('querying tenants..');
        result = HawkularMetric.Tenant.query();
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get two previously created tenants', function() {
        expect(result.$resolved).toBe(true);
      });
    });
  });

  describe('Metrics: ', function() {

    /*
     Numeric
     */

    describe('creating a gauge metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var metric = {
          id: metricId
        };

        debug && dump('creating gauge metric..', metric);
        result = HawkularMetric.GaugeMetric(tenantId1).save(metric);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('querying a gauge metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        debug && dump('querying gauge metric..');
        result = HawkularMetric.Metric(tenantId1).queryGauges();
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get previously created gauge metrics only', function() {
        expect(result.$resolved).toBe(true);
        expect(arrayContainsField(result, 'id', metricId)).toBe(true);
      });
    });

    describe('creating a gauge metric data for single metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {"timestamp": 1416857688195, "value": 2.1},
          {"timestamp": 1436857688195, "value": 2.2},
          {"timestamp": 1456857688195, "value": 2.3}
        ];


        debug && dump('creating gauge metric data..', data);
        result = HawkularMetric.GaugeMetricData(tenantId1).save({ gaugeId: metricId }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('creating data for multiple gauge metrics', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {
            "id": "appsrv1.request_time",
            "data": [
              {"timestamp": 1416857688195, "value": 2.1},
              {"timestamp": 1436857688195, "value": 2.2}
            ]
          },
          {
            "id": "appsrv1.response_time",
            "data": [
              {"timestamp": 1416857688195, "value": 2.1},
              {"timestamp": 1436857688195, "value": 2.2}
            ]
          }
        ];

        debug && dump('creating gauge metric multiple data..', data);
        result = HawkularMetric.GaugeMetricMultiple(tenantId1).save(data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    /*
     Counter
     */

    describe('creating a counter metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var metric = {
          id: counterId
        };

        debug && dump('creating counter metric..', metric);
        result = HawkularMetric.CounterMetric(tenantId1).save(metric);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('querying a gauge metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        debug && dump('querying counter metric..');
        result = HawkularMetric.Metric(tenantId1).queryCounters();
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get previously created counter metrics only', function() {
        expect(result.$resolved).toBe(true);
        expect(arrayContainsField(result, 'id', counterId)).toBe(true);
      });
    });

    describe('creating a counter metric data for single metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {"timestamp": 1437751962019, "value": 21.0},
          {"timestamp": 1456857688195, "value": 22.5},
          {"timestamp": 1476857688195, "value": 23.9}
        ];


        debug && dump('creating counter metric data..', data);
        result = HawkularMetric.CounterMetricData(tenantId1).save({ counterId: counterId }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('creating data for multiple counter metrics', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {
            "id": "appsrv1.request_time",
            "data": [
              {"timestamp": 1437751962019, "value": 21.0},
              {"timestamp": 1457751962019, "value": 22.5}
            ]
          },
          {
            "id": "appsrv1.response_time",
            "data": [
              {"timestamp": 1437751962019, "value": 22.5},
              {"timestamp": 1457751962019, "value": 23.9}
            ]
          }
        ];

        debug && dump('creating counter metric multiple data..', data);
        result = HawkularMetric.CounterMetricMultiple(tenantId1).save(data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    /*
     Availability
     */

    describe('creating a availability metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var metric = {
          "id": "myavail_" + new Date().getTime(),
          "tags": {
            "attribute1": "value1",
            "attribute2": "value2"
          }
        };

        debug && dump('creating availability metric..', metric);
        result = HawkularMetric.AvailabilityMetric(tenantId1).save(null, metric);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('creating a availability data for single metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {"timestamp": 1416857688195, "value": "down"},
          {"timestamp": 1416857688195, "value": "up"}
        ];

        debug && dump('creating availability metric data..', data);
        result = HawkularMetric.AvailabilityMetricData(tenantId1).save({ availabilityId: 'myavail' }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('querying availability metrics', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        debug && dump('querying availability metric..');
        result = HawkularMetric.Metric(tenantId1).queryAvailability();
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get previously saved metric only', function() {
        expect(result.$resolved).toBe(true);
        expect(arrayContainsField(result, 'id', 'myavail')).toBe(true);
      });
    });

    describe('creating data for multiple availability metrics', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {
            "id": "appsrv1",
            "data": [
              {"timestamp": 1416857688195, "value": "up"},
              {"timestamp": 1436857688195, "value": "up"}
            ]
          },
          {
            "id": "appsrv2",
            "data": [
              {"timestamp": 1416857688195, "value": "down"},
              {"timestamp": 1436857688195, "value": "up"}
            ]
          }
        ];

        debug && dump('creating availability metric multiple data..', data);
        result = HawkularMetric.AvailabilityMetricMultiple(tenantId1).save(data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });
});
