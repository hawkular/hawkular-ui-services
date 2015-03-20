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
            var factory = {};
            factory.Resource = $resource(prefix + '/hawkular/inventory/:tenantId/resources/:resourceId', {
                tenantId: '@tenantId',
                resourceId: '@resourceId'
            });
            factory.Metric = $resource(prefix + '/hawkular/inventory/:tenantId/resources/:resourceId/metrics/:metricId', {
                tenantId: '@tenantId',
                resourceId: '@resourceId',
                metricId: '@metricId'
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
    hawkularRest._module.provider('HawkularMetric', function () {
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
            var metricUrlPart = '/hawkular-metrics';
            var url = prefix + metricUrlPart;
            var factory = {};
            factory.Tenant = $resource(url + '/tenants', {});
            factory.Metric = $resource(url + '/:tenantId/metrics', {
                tenantId: '@tenantId'
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
                }
            });
            factory.NumericMetric = $resource(url + '/:tenantId/metrics/numeric', {
                tenantId: '@tenantId'
            });
            factory.NumericMetricData = $resource(url + '/:tenantId/metrics/numeric/:numericId/data', {
                tenantId: '@tenantId',
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
            factory.NumericMetricMeta = $resource(url + '/:tenantId/metrics/numeric/:numericId/meta', {
                tenantId: '@tenantId',
                numericId: '@numericId'
            }, {
                update: 'PUT'
            });
            factory.NumericMetricMultiple = $resource(url + '/:tenantId/metrics/numeric/data', {
                tenantId: '@tenantId',
                numericId: '@numericId'
            });
            factory.AvailabilityMetric = $resource(url + '/:tenantId/metrics/availability', {
                tenantId: '@tenantId'
            });
            factory.AvailabilityMetricData = $resource(url + '/:tenantId/metrics/availability/:availabilityId/data', {
                tenantId: '@tenantId',
                availabilityId: '@availabilityId'
            });
            factory.AvailabilityMetricMultiple = $resource(url + '/:tenantId/metrics/availability/data', {
                tenantId: '@tenantId'
            });
            return factory;
        }];
    });
})(hawkularRest || (hawkularRest = {}));
