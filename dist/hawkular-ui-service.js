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
                },
                resolve: {
                    method: 'PUT',
                    url: prefix + '/hawkular/alerts/resolve'
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
            factory.Action = $resource(prefix + '/hawkular/alerts/actions/:pluginId/:actionId', {
                pluginId: '@pluginId',
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
        this.$get = ['$resource', '$location', '$http', function ($resource, $location) {
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = 'http://' + this.host + ':' + this.port;
            var metricUrlPart = '/hawkular/metrics';
            var url = prefix + metricUrlPart;
            var factory = {};
            factory.Tenant = $resource(url + '/tenants', {});
            factory.Metric = function (tenantId) {
                return $resource(url + '/metrics', null, {
                    queryGauges: {
                        method: 'GET',
                        isArray: true,
                        params: { type: 'gauge' },
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    queryAvailability: {
                        method: 'GET',
                        isArray: true,
                        params: { type: 'availability' },
                        headers: { 'Hawkular-Tenant': tenantId }
                    }
                });
            };
            factory.GaugeMetric = function (tenantId) {
                return $resource(url + '/gauges', null, {
                    get: {
                        method: 'GET',
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    query: {
                        method: 'GET',
                        isArray: true,
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    save: {
                        method: 'POST',
                        headers: { 'Hawkular-Tenant': tenantId }
                    }
                });
            };
            factory.GaugeMetricData = function (tenantId) {
                return $resource(url + '/gauges/:gaugeId/data', {
                    gaugeId: '@gaugeId'
                }, {
                    queryMetrics: {
                        method: 'GET',
                        isArray: true,
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    queryMetricsTimeRange: {
                        method: 'GET',
                        isArray: true,
                        params: { buckets: 60, start: '@startTimestamp', end: '@endTimestamp' },
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    get: {
                        method: 'GET',
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    save: {
                        method: 'POST',
                        headers: { 'Hawkular-Tenant': tenantId }
                    }
                });
            };
            factory.GaugeMetricMultiple = function (tenantId) {
                return $resource(url + '/gauges/data', {
                    gaugeId: '@gaugeId'
                }, {
                    get: {
                        method: 'GET',
                        headers: { 'Hawkular-Tenant': tenantId },
                        query: {
                            method: 'GET',
                            isArray: true,
                            headers: { 'Hawkular-Tenant': tenantId }
                        }
                    },
                    save: {
                        method: 'POST',
                        headers: { 'Hawkular-Tenant': tenantId }
                    }
                });
            };
            factory.AvailabilityMetric = function (tenantId) {
                return $resource(url + '/availability', null, {
                    get: {
                        method: 'GET',
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    query: {
                        method: 'GET',
                        isArray: true,
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    save: {
                        method: 'POST',
                        headers: { 'Hawkular-Tenant': tenantId }
                    }
                });
            };
            factory.AvailabilityMetricData = function (tenantId) {
                return $resource(url + '/availability/:availabilityId/data', {
                    availabilityId: '@availabilityId'
                }, {
                    get: {
                        method: 'GET',
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    query: {
                        method: 'GET',
                        isArray: true,
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    save: {
                        method: 'POST',
                        headers: { 'Hawkular-Tenant': tenantId }
                    }
                });
            };
            factory.AvailabilityMetricMultiple = function (tenantId) {
                return $resource(url + '/availability/data', null, {
                    get: {
                        method: 'GET',
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    query: {
                        method: 'GET',
                        isArray: true,
                        headers: { 'Hawkular-Tenant': tenantId }
                    },
                    save: {
                        method: 'POST',
                        headers: { 'Hawkular-Tenant': tenantId }
                    }
                });
            };
            return factory;
        }];
    });
})(hawkularRest || (hawkularRest = {}));
