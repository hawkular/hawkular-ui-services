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
var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module = angular.module('hawkular.services', ['ngResource']);
})(hawkularRest || (hawkularRest = {}));

var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module.provider('HawkularAccount', function () {
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', '$location', function ($resource, $location) {
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = 'http://' + this.host + ':' + this.port;
            var factory = {};
            factory.Organization = $resource(prefix + '/hawkular-accounts/organizations/:id', { id: '@id' });
            factory.Persona = $resource(prefix + '/hawkular-accounts/personas/:id', { id: '@id' });
            return factory;
        }];
    });
})(hawkularRest || (hawkularRest = {}));

var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module.provider('HawkularAlert', function () {
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', '$location', function ($resource, $location) {
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = 'http://' + this.host + ':' + this.port;
            var factory = {};
            factory.Alert = $resource(prefix + '/hawkular/alerts', {}, {
                reload: {
                    method: 'GET',
                    url: prefix + '/hawkular/alerts/reload'
                }
            });
            factory.Trigger = $resource(prefix + '/hawkular/alerts/triggers/:triggerId', {
                triggerId: '@triggerId'
            }, {
                save: {
                    method: 'POST',
                    url: prefix + '/hawkular/alerts/triggers/'
                },
                put: {
                    method: 'PUT'
                },
                reload: {
                    method: 'GET',
                    url: prefix + '/hawkular/alerts/reload/:triggerId',
                    params: {
                        triggerId: '@triggerId'
                    }
                }
            });
            factory.Dampening = $resource(prefix + '/hawkular/alerts/triggers/:triggerId/dampenings/:dampeningId', {
                triggerId: '@triggerId',
                dampeningId: '@dampeningId'
            }, {
                save: {
                    method: 'POST',
                    url: prefix + '/hawkular/alerts/triggers/:triggerId/dampenings/'
                },
                put: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    isArray: true,
                    url: prefix + '/hawkular/alerts/triggers/:triggerId/dampenings/'
                }
            });
            factory.Condition = $resource(prefix + '/hawkular/alerts/triggers/:triggerId/conditions/:conditionId', {
                triggerId: '@triggerId',
                conditionId: '@conditionId'
            }, {
                get: {
                    method: 'GET',
                    url: prefix + '/hawkular/alerts/triggers/:triggerId/conditions/:conditionId'
                },
                save: {
                    method: 'POST',
                    isArray: true,
                    url: prefix + '/hawkular/alerts/triggers/:triggerId/conditions/'
                },
                put: {
                    method: 'PUT',
                    isArray: true
                },
                query: {
                    method: 'GET',
                    isArray: true,
                    url: prefix + '/hawkular/alerts/triggers/:triggerId/conditions/'
                },
                delete: {
                    method: 'DELETE',
                    isArray: true
                }
            });
            factory.ActionPlugin = $resource(prefix + '/hawkular/alerts/plugins/:actionPlugin', {
                actionPlugin: '@actionPlugin'
            }, {
                get: {
                    method: 'GET',
                    isArray: true
                }
            });
            factory.Action = $resource(prefix + '/hawkular/alerts/actions/:actionId', {
                actionId: '@actionId'
            }, {
                save: {
                    method: 'POST',
                    url: prefix + '/hawkular/alerts/actions/'
                },
                put: {
                    method: 'PUT'
                },
                get: {
                    method: 'GET',
                    isArray: false
                },
                plugin: {
                    method: 'GET',
                    isArray: true,
                    url: prefix + '/hawkular/alerts/actions/plugin/:actionPlugin',
                    params: {
                        actionPlugin: '@actionPlugin'
                    }
                }
            });
            return factory;
        }];
    });
})(hawkularRest || (hawkularRest = {}));

var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module.provider('HawkularInventory', function () {
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', '$location', function ($resource, $location) {
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = 'http://' + this.host + ':' + this.port;
            var inventoryUrlPart = '/hawkular/inventory';
            var url = prefix + inventoryUrlPart;
            var factory = {};
            factory.Tenant = $resource(url + '/tenant/:tenantId', {
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
                resourceTypeId: '@resourceTypeId'
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
                tenantId: '@tenantId',
                environmentId: '@environmentId',
                resourceId: '@resourceId',
                metricId: '@metricId'
            }, {
                put: {
                    method: 'PUT'
                }
            });
            factory.ResourceMetricType = $resource(url + '/:tenantId/resourceTypes/:resourceTypeId/metricTypes/:metricTypeId', {
                tenantId: '@tenantId',
                resourceTypeId: '@resourceTypeId',
                metricTypeId: '@metricTypeId'
            });
            factory.ResourceOfType = $resource(url + '/:tenantId/resourceTypes/:resourceTypeId/resources', {
                tenantId: '@tenantId',
                resourceTypeId: '@resourceTypeId'
            });
            factory.Metric = $resource(url + '/:tenantId/:environmentId/metrics/:metricId', {
                tenantId: '@tenantId',
                environmentId: '@environmentId',
                id: '@metricId'
            }, {
                put: {
                    method: 'PUT'
                }
            });
            return factory;
        }];
    });
})(hawkularRest || (hawkularRest = {}));

var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module.provider('HawkularMetric', ['$httpProvider', function ($httpProvider) {
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', '$location', function ($resource, $location) {
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = 'http://' + this.host + ':' + this.port;
            var metricUrlPart = '/hawkular/metrics';
            var url = prefix + metricUrlPart;
            var factory = {};
            factory.Tenant = $resource(url + '/tenants', {});
            factory.Metric = $resource(url + '/', null, {
                queryNum: {
                    method: 'GET',
                    isArray: true,
                    params: { type: 'gauges' }
                },
                queryAvail: {
                    method: 'GET',
                    isArray: true,
                    params: { type: 'availability' }
                }
            });
            factory.NumericMetric = $resource(url + '/gauges');
            factory.NumericMetricData = $resource(url + '/gauges/:numericId/data', {
                numericId: '@numericId'
            }, {
                queryMetrics: {
                    method: 'GET',
                    isArray: true
                },
                queryMetricsTimeRange: {
                    method: 'GET',
                    isArray: true,
                    params: { buckets: 60, start: '@startTimestamp', end: '@endTimestamp' }
                }
            });
            factory.NumericMetricMultiple = $resource(url + '/gauges/data', {
                numericId: '@numericId'
            });
            factory.AvailabilityMetric = $resource(url + '/availability');
            factory.AvailabilityMetricData = $resource(url + '/availability/:availabilityId/data', {
                availabilityId: '@availabilityId'
            });
            factory.AvailabilityMetricMultiple = $resource(url + '/availability/data');
            factory.configureTenantId = function (tenantId) {
                $httpProvider.defaults.headers.get['Hawkular-Tenant'] = this.tenantId;
            };
            return factory;
        }];
    }]);
})(hawkularRest || (hawkularRest = {}));
