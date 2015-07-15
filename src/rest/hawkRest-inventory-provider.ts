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
 * @name hawkular.rest.HawkularInventory
 * @description
 * # HawkularInventory
 * Provider in the hawkular.rest.
 */

module hawkularRest {

  _module.provider('HawkularInventory', function() {

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
      this.setHost(this.host || $location.host() || 'localhost');
      this.setPort(this.port || $location.port() || 8080);

      var prefix = 'http://' + this.host + ':' + this.port;
      var inventoryUrlPart = '/hawkular/inventory';
      var url = prefix + inventoryUrlPart;
      var factory: any = {};

      factory.Tenant = $resource(url + '/tenant', {
        put: {
          method: 'PUT'
        }
      });

      factory.Environment = $resource(url + '/environments/:environmentId', null, {
        put: {
          method: 'PUT'
        },
        relationships: {
          method: 'GET',
          url: url + '/environments/:environmentId/relationships'
        }
      });

      factory.Feed = $resource(url + '/:environmentId/feeds/:feedId', null, {
        put: {
          method: 'PUT'
        },
        relationships: {
          method: 'GET',
          url: url + '/:environmentId/feeds/:feedId/relationships'
        }
      });

      factory.Resource = $resource(url + '/:environmentId/resources/:resourceId', null, {
        relationships: {
          method: 'GET',
          url: url + '/:environmentId/resources/:resourceId/relationships'
        }
      });

      factory.FeedResource = $resource(url + '/:environmentId/:feedId/resources/:resourceId', null, {
        relationships: {
          method: 'GET',
          url: url + '/:environmentId/:feedId/resources/:resourceId/relationships'
        }
      });

      factory.ResourceType = $resource(url + '/resourceTypes/:resourceTypeId', null, {
        relationships: {
          method: 'GET',
          url: url + '/resourceTypes/:resourceTypeId/relationships'
        }
      });

      factory.MetricType = $resource(url + '/metricTypes/:metricTypeId', null, {
        put: {
          method: 'PUT'
        },
        relationships: {
          method: 'GET',
          url: url + '/metricTypes/:metricTypeId/relationships'
        }
      });

      factory.ResourceMetric = $resource(url + '/:environmentId/resources/:resourceId/metrics/:metricId', null, {
        put: {
          method: 'PUT'
        }
      });

      factory.ResourceMetricType = $resource(url + '/resourceTypes/:resourceTypeId/metricTypes/:metricTypeId', null, {
        relationships: {
          method: 'GET',
          url: url + '/resourceTypes/:resourceTypeId/metricTypes/:metricTypeId/relationships'
        }
      });

      factory.ResourceOfType = $resource(url + '/resourceTypes/:resourceTypeId/resources');

      factory.Metric = $resource(url + '/:environmentId/metrics/:metricId', null, {
        put: {
          method: 'PUT'
        },
        relationships: {
          method: 'GET',
          url: url + '/:environmentId/metrics/:metricId/relationships'
        }
      });

      factory.FeedMetric = $resource(url + '/:environmentId/:feedId/metrics/:metricId', null, {
        put: {
          method: 'PUT'
        },
        relationships: {
          method: 'GET',
          url: url + '/:environmentId/:feedId/metrics/:metricId/relationships'
        }
      });

      return factory;
    }];

  });
}
