/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.

/**
 * @ngdoc provider
 * @name hawkular.rest.HawkularMetric
 * @description
 * # HawkularRest
 * Provider in the hawkular.rest.
 */

module hawkularRest {

  _module.provider('HawkularMetric', function() {

    this.setProtocol = function(protocol) {
      this.protocol = protocol;
      return this;
    };

    this.setHost = function(host) {
      this.host = host;
      return this;
    };

    this.setPort = function(port) {
      this.port = port;
      return this;
    };

    this.$get = ['$resource', '$location', function($resource, $location) {
      // If available, used pre-configured values, otherwise use values from current browser location of fallback to
      // defaults
      this.setProtocol(this.protocol || $location.protocol() || 'http');
      this.setHost(this.host || $location.host() || 'localhost');
      this.setPort(this.port || $location.port() || 8080);

      var prefix = this.protocol + '://' + this.host + ':' + this.port;
      var metricUrlPart = '/hawkular/metrics';
      var url = prefix + metricUrlPart;
      var factory: any = {};

      factory.Tenant = $resource(url + '/tenants', {});

      factory.Metric = function(tenantId) {
        return $resource(url + '/metrics', null, {
          queryGauges: {
            method: 'GET',
            isArray: true,
            params: { type: 'gauge' },
            headers: {'Hawkular-Tenant': tenantId}
          },
          queryCounters: {
            method: 'GET',
            isArray: true,
            params: { type: 'counter' },
            headers: {'Hawkular-Tenant': tenantId}
          },
          queryAvailability: {
            method: 'GET',
            isArray: true,
            params: { type: 'availability' },
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      factory.GaugeMetric = function(tenantId){
        return $resource(url + '/gauges', null, {
          get: {
            method:'GET',
            headers: {'Hawkular-Tenant': tenantId}
          },
          query: {
            method:'GET',
            isArray:true,
            headers: {'Hawkular-Tenant': tenantId}
          },
          save: {
            method:'POST',
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      factory.GaugeMetricData = function(tenantId) {
        return $resource(url + '/gauges/:gaugeId/data', {
          gaugeId: '@gaugeId'
        }, {
          queryMetrics: {
            method: 'GET',
            isArray: true,
            headers: {'Hawkular-Tenant': tenantId}
          },
          queryMetricsTimeRange: {
            method: 'GET',
            isArray: true,
            params: {buckets: 60, start: '@startTimestamp', end: '@endTimestamp'},
            headers: {'Hawkular-Tenant': tenantId}
          },
          get: {
            method:'GET',
            headers: {'Hawkular-Tenant': tenantId}
          },
          save: {
            method:'POST',
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      factory.GaugeMetricMultiple = function(tenantId) {
        return $resource(url + '/gauges/data', {
          gaugeId : '@gaugeId'
        }, {
          get: {
            method:'GET',
            headers: {'Hawkular-Tenant': tenantId}
            ,
            query: {
              method:'GET',
              isArray:true,
              headers: {'Hawkular-Tenant': tenantId}
            }},
          save: {
            method:'POST',
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      factory.GaugeMetricMultipleStats = function (tenantId) {
        let metrics = '@metrics';
        let myRequest = $resource(url + '/gauges/data', {
            buckets: '@buckets'
        }, {
          get: {
            method: 'GET',
            headers: {'Hawkular-Tenant': tenantId},
            isArray: true,
            params: {metrics: metrics} // send metrics=id1,metrics=id2,...
          }
        });
       return myRequest;
      };


      factory.CounterMetric = function(tenantId){
        return $resource(url + '/counters', null, {
          get: {
            method:'GET',
            headers: {'Hawkular-Tenant': tenantId}
          },
          query: {
            method:'GET',
            isArray:true,
            headers: {'Hawkular-Tenant': tenantId}
          },
          save: {
            method:'POST',
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      factory.CounterMetricData = function(tenantId) {
        return $resource(url + '/counters/:counterId/data', {
          counterId: '@counterId'
        }, {
          queryMetrics: {
            method: 'GET',
            isArray: true,
            headers: {'Hawkular-Tenant': tenantId}
          },
          queryMetricsTimeRange: {
            method: 'GET',
            isArray: true,
            params: {buckets: 60, start: '@startTimestamp', end: '@endTimestamp'},
            headers: {'Hawkular-Tenant': tenantId}
          },
          get: {
            method:'GET',
            headers: {'Hawkular-Tenant': tenantId}
          },
          save: {
            method:'POST',
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      factory.CounterMetricMultiple = function(tenantId) {
        return $resource(url + '/counters/data', {
          counterId : '@counterId'
        }, {
          get: {
            method:'GET',
            headers: {'Hawkular-Tenant': tenantId}
            ,
            query: {
              method:'GET',
              isArray:true,
              headers: {'Hawkular-Tenant': tenantId}
            }},
          save: {
            method:'POST',
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      factory.CounterMetricRate = function(tenantId) {
        return $resource(url + '/counters/:counterId/rate', {
          counterId: '@counterId'
        }, {
          queryMetrics: {
            method: 'GET',
            isArray: true,
            headers: {'Hawkular-Tenant': tenantId}
          },
          queryMetricsTimeRange: {
            method: 'GET',
            isArray: true,
            params: {buckets: 60, start: '@startTimestamp', end: '@endTimestamp'},
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      factory.AvailabilityMetric = function(tenantId) {
        return $resource(url + '/availability', null, {
          get: {
            method:'GET',
            headers: {'Hawkular-Tenant': tenantId}
          },
          query: {
            method:'GET',
            isArray:true,
            headers: {'Hawkular-Tenant': tenantId}
          },
          save: {
            method:'POST',
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      factory.AvailabilityMetricData = function(tenantId) {
        return $resource(url + '/availability/:availabilityId/data', {
          availabilityId : '@availabilityId'
        }, {
          get: {
            method:'GET',
            headers: {'Hawkular-Tenant': tenantId}
          },
          query: {
            method:'GET',
            isArray:true,
            headers: {'Hawkular-Tenant': tenantId}
          },
          save: {
            method:'POST',
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      factory.AvailabilityMetricMultiple = function(tenantId) {
        return $resource(url + '/availability/data', null, {
          get: {
            method:'GET',
            headers: {'Hawkular-Tenant': tenantId}
          },
          query: {
            method:'GET',
            isArray:true,
            headers: {'Hawkular-Tenant': tenantId}
          },
          save: {
            method:'POST',
            headers: {'Hawkular-Tenant': tenantId}
          }
        });
      };

      return factory;
    }];

  });
}
