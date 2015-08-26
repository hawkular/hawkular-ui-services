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
        this.setProtocol = function (protocol) {
            this.protocol = protocol;
            return this;
        };
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', '$location', function ($resource, $location) {
            this.setProtocol(this.protocol || $location.protocol() || 'http');
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = this.protocol + '://' + this.host + ':' + this.port;
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
        this.setProtocol = function (protocol) {
            this.protocol = protocol;
            return this;
        };
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', '$location', function ($resource, $location) {
            this.setProtocol(this.protocol || $location.protocol() || 'http');
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = this.protocol + '://' + this.host + ':' + this.port;
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
    hawkularRest._module.provider('HawkularAddDeploymentOps', function () {
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$location', '$http', function ($location) {
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = 'ws://' + this.host + ':' + this.port;
            var opsUrlPart = '/hawkular/feed-comm/ui/ws';
            var url = prefix + opsUrlPart;
            var factory = {};
            var NotificationService;
            var ws = new WebSocket(url);
            var responseHandlers = [{
                prefix: 'GenericSuccessResponse=',
                handle: function (operationResponse) {
                    console.log('Operation Deployment Request : ', operationResponse.message);
                    NotificationService.info('Operation Deployment Request : ' + operationResponse.message);
                }
            }, {
                prefix: 'DeploymentOperationResponse=',
                handle: function (deploymentResponse) {
                    console.warn("Hey New Add Deployment works!!!");
                    if (deploymentResponse.status === "OK") {
                        NotificationService.success('Deployment "' + deploymentResponse.destinationFileName + '" on resource "' + deploymentResponse.resourcePath + '" succeeded.');
                    }
                    else if (deploymentResponse.status === "ERROR") {
                        NotificationService.error('Deployment File: "' + deploymentResponse.destinationFileName + '" on resource "' + deploymentResponse.resourcePath + '" failed: ' + deploymentResponse.message);
                    }
                    else {
                        console.log('Unexpected deploymentOperationResponse: ', deploymentResponse);
                    }
                }
            }, {
                prefix: 'GenericErrorResponse=',
                handle: function (operationResponse) {
                    NotificationService.error('Operation Deployment Add failed: ' + operationResponse.message);
                }
            }];
            ws.onopen = function () {
                console.log('Socket has been opened!');
            };
            ws.onmessage = function (message) {
                console.log('WebSocket received:', message);
                var data = message.data;
                for (var i = 0; i < responseHandlers.length; i++) {
                    var h = responseHandlers[i];
                    if (data.indexOf(h.prefix) === 0) {
                        var opResult = JSON.parse(data.substring(h.prefix.length));
                        h.handle(opResult);
                        return;
                    }
                }
                console.log('Unexpected WebSocket message: ', message);
            };
            factory.init = function (ns) {
                NotificationService = ns;
            };
            factory.performOperation = function (resourcePath, destinationFileName) {
                var json = 'DeployApplicationRequest={\"resourcePath\": \"' + resourcePath + '\", \"destinationFileName\":\"' + destinationFileName + '\" }';
                console.log('DeployApplicationRequest: ' + json);
                ws.send(json);
            };
            return factory;
        }];
    });
})(hawkularRest || (hawkularRest = {}));

var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module.constant("inventoryInterceptURLS", [new RegExp('.+/inventory/.+/resources/.+%2F.+')]);
    hawkularRest._module.config(['$httpProvider', 'inventoryInterceptURLS', function ($httpProvider, inventoryInterceptURLS) {
        var ENCODED_SLASH = new RegExp("%2F", 'g');
        $httpProvider.interceptors.push(function ($q) {
            return {
                'request': function (config) {
                    var url = config.url;
                    for (var i = 0; i < inventoryInterceptURLS.length; i++) {
                        if (url.match(inventoryInterceptURLS[i])) {
                            url = url.replace(ENCODED_SLASH, "/");
                            break;
                        }
                    }
                    config.url = url;
                    return config || $q.when(config);
                }
            };
        });
    }]);
    hawkularRest._module.provider('HawkularInventory', function () {
        this.setProtocol = function (protocol) {
            this.protocol = protocol;
            return this;
        };
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', '$location', function ($resource, $location) {
            this.setProtocol(this.protocol || $location.protocol() || 'http');
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = this.protocol + '://' + this.host + ':' + this.port;
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
        this.setProtocol = function (protocol) {
            this.protocol = protocol;
            return this;
        };
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', '$location', '$http', function ($resource, $location) {
            this.setProtocol(this.protocol || $location.protocol() || 'http');
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = this.protocol + '://' + this.host + ':' + this.port;
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
                    queryCounters: {
                        method: 'GET',
                        isArray: true,
                        params: { type: 'counter' },
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
            factory.CounterMetric = function (tenantId) {
                return $resource(url + '/counters', null, {
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
            factory.CounterMetricData = function (tenantId) {
                return $resource(url + '/counters/:counterId/data', {
                    counterId: '@counterId'
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
            factory.CounterMetricMultiple = function (tenantId) {
                return $resource(url + '/counters/data', {
                    counterId: '@counterId'
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

var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module.provider('HawkularOps', function () {
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$location', '$http', function ($location) {
            this.setHost(this.host || $location.host() || 'localhost');
            this.setPort(this.port || $location.port() || 8080);
            var prefix = 'ws://' + this.host + ':' + this.port;
            var opsUrlPart = '/hawkular/feed-comm/ui/ws';
            var url = prefix + opsUrlPart;
            var factory = {};
            var NotificationService;
            var ws = new WebSocket(url);
            var responseHandlers = [{
                prefix: 'GenericSuccessResponse=',
                handle: function (operationResponse) {
                    console.log('Operation request delivery: ', operationResponse.message);
                    NotificationService.info('Operation request delivery: ' + operationResponse.message);
                }
            }, {
                prefix: 'ExecuteOperationResponse=',
                handle: function (operationResponse) {
                    if (operationResponse.status === "OK") {
                        NotificationService.success('Operation "' + operationResponse.operationName + '" on resource "' + operationResponse.resourceId + '" succeeded.');
                    }
                    else if (operationResponse.status === "ERROR") {
                        NotificationService.error('Operation "' + operationResponse.operationName + '" on resource "' + operationResponse.resourceId + '" failed: ' + operationResponse.message);
                    }
                    else {
                        console.log('Unexpected operationResponse: ', operationResponse);
                    }
                }
            }, {
                prefix: 'GenericErrorResponse=',
                handle: function (operationResponse) {
                    NotificationService.error('Operation failed: ' + operationResponse.message);
                }
            }];
            ws.onopen = function () {
                console.log('Socket has been opened!');
            };
            ws.onmessage = function (message) {
                console.log('WebSocket received:', message);
                var data = message.data;
                for (var i = 0; i < responseHandlers.length; i++) {
                    var h = responseHandlers[i];
                    if (data.indexOf(h.prefix) === 0) {
                        var opResult = JSON.parse(data.substring(h.prefix.length));
                        h.handle(opResult);
                        return;
                    }
                }
                console.log('Unexpected WebSocket message: ', message);
            };
            factory.init = function (ns) {
                NotificationService = ns;
            };
            factory.performOperation = function (operation) {
                ws.send('ExecuteOperationRequest=' + JSON.stringify(operation));
            };
            return factory;
        }];
    });
})(hawkularRest || (hawkularRest = {}));
