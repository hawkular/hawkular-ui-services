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

      factory.Tenant = $resource(url + '/tenants/:tenantId', {
        tenantId: '@tenantId'
      }, {
        put: {
          method: 'PUT'
        }
      });

      factory.Environment = $resource(url + '/:tenantId/environments/:environmentId', {
        id: '@environmentId'
      }, {
        put: {
          method: 'PUT'
        }
      });

      factory.Resource = $resource(url + '/:tenantId/:environmentId/resources/:resourceId', {
          tenantId: '@tenantId',
          environmentId: '@environmentId',
          resourceId: '@resourceId',
          type: {
            id: '@resourceTypeId',
            version: '1.0'
          }
      });

      factory.ResourceType = $resource(url + '/:tenantId/resourceTypes/:resourceTypeId', {
          id: '@resourceTypeId',
          version: '1.0'
      });

      factory.MetricType = $resource(url + '/:tenantId/metricTypes/:metricTypeId', {
        id: '@metricTypeId'
      }, {
        put: {
          method: 'PUT'
        }
      });

      factory.ResourceMetric = $resource(url + '/:tenantId/:environmentId/resources/:resourceId/metrics/:metricId', {
        tenantId : '@tenantId',
        environmentId : '@environmentId',
        resourceId: '@resourceId',
        metricId: '@metricId'
      }, {
        put: {
          method: 'PUT'
        }
      });

      factory.ResourceMetricType = $resource(url + '/:tenantId/resourceTypes/:resourceTypeId/metricTypes/:metricTypeId', {
          tenantId : '@tenantId',
          resourceTypeId : '@resourceTypeId',
          metricTypeId : '@metricTypeId'
      });

      factory.ResourceOfType = $resource(url + '/:tenantId/resourceTypes/:resourceTypeId/resources', {
          tenantId : '@tenantId',
          resourceTypeId : '@resourceTypeId'
      });

      factory.Metric = $resource(url + '/:tenantId/:environmentId/metrics/:metricId', {
        // metric type id?
        tenantId : '@tenantId',
        environmentId : '@environmentId',
        id: '@metricId'
      }, {
        put: {
          method: 'PUT'
        }
      });

      return factory;
    }];

  });
}
