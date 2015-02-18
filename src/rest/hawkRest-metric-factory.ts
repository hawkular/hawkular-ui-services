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
    // time (in ms) the notifications are shown

    this.host = 'localhost';
    this.port = 8080;

    this.setHost = function(host) {
      this.host = host;
      return this;
    };

    this.setPort = function(port) {
      this.port = port;
      return this;
    };

    this.$get = ['$resource', function($resource) {

      var prefix = 'http://' + this.host + ':' + this.port;
      var metricUrlPart = '/rhq-metrics';
      var url = prefix + metricUrlPart;
      var factory: any = {};

      factory.Tenant = $resource(url +'/tenants', {});

      factory.Metric = $resource(url+'/:tenantId/metrics', {
        tenantId : '@tenantId'
      }, {
        queryNum: {
          method: 'GET',
          isArray: true,
          params: { type: 'num' }
        },
        queryAvail: {
          method: 'GET',
          isArray: true,
          params: { type: 'avail' }
        },
        queryLog: {
          method: 'GET',
          isArray: true,
          params: { type: 'log' }
        }
      });

      factory.NumericMetric = $resource(url + '/:tenantId/metrics/numeric', {
        tenantId : '@tenantId'
      });


      factory['NumericMetricData'] = $resource(url + '/:tenantId/metrics/numeric/:numericId/data', {
        tenantId: '@tenantId',
        numericId: '@numericId'
      }, {
        queryMetrics: {
          method: 'GET',
          isArray: false,
          params: {type: 'num'}
        },
        queryMetricsTimeRange: {
          method: 'GET',
          isArray: false,
          params: {type: 'num', buckets: 60, start: '@startTimestamp', end: '@endTimestamp'}
        }
      });


      factory.NumericMetricMeta = $resource(url + '/:tenantId/metrics/numeric/:numericId/meta', {
        tenantId : '@tenantId',
        numericId : '@numericId'
      }, {
        update: 'PUT'
      });

      factory.NumericMetricMultiple = $resource(url + '/:tenantId/metrics/numeric/data', {
        tenantId : '@tenantId',
        numericId : '@numericId'
      });

      factory.AvailabilityMetric = $resource(url + '/:tenantId/metrics/availability', {
        tenantId : '@tenantId'
      });

      factory.AvailabilityMetricData = $resource(url + '/:tenantId/metrics/availability/:availabilityId/data', {
        tenantId : '@tenantId',
        availabilityId : '@availabilityId'
      });

      factory.AvailabilityMetricMultiple = $resource(url + '/:tenantId/metrics/availability/data', {
        tenantId : '@tenantId'
      });

      return factory;
    }];

  });
}
