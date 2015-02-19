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
        this.host = 'localhost';
        this.port = 8080;
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', function ($resource) {
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
                conditions: {
                    method: 'GET',
                    url: prefix + '/hawkular/alerts/triggers/:triggerId/conditions',
                    isArray: true,
                    params: {
                        triggerId: '@triggerId'
                    }
                }
            });
            factory.Dampening = $resource(prefix + '/hawkular/alerts/trigger/dampening/:triggerId', {
                triggerId: '@triggerId'
            }, {
                save: {
                    method: 'POST',
                    url: prefix + '/hawkular/alerts/trigger/dampening/'
                },
                put: {
                    method: 'PUT'
                }
            });
            factory.AvailabilityCondition = $resource(prefix + '/hawkular/alerts/conditions/availability/:conditionId', {
                conditionId: '@conditionId'
            }, {
                put: {
                    method: 'PUT'
                },
                trigger: {
                    method: 'GET',
                    url: prefix + '/hawkular/alerts/conditions/availability/trigger/:triggerId',
                    isArray: true,
                    params: {
                        triggerId: '@triggerId'
                    }
                }
            });
            factory.CompareCondition = $resource(prefix + '/hawkular/alerts/conditions/compare/:conditionId', {
                conditionId: '@conditionId'
            }, {
                put: {
                    method: 'PUT'
                },
                trigger: {
                    method: 'GET',
                    url: prefix + '/hawkular/alerts/conditions/compare/trigger/:triggerId',
                    isArray: true,
                    params: {
                        triggerId: '@triggerId'
                    }
                }
            });
            factory.StringCondition = $resource(prefix + '/hawkular/alerts/conditions/string/:conditionId', {
                conditionId: '@conditionId'
            }, {
                put: {
                    method: 'PUT'
                },
                trigger: {
                    method: 'GET',
                    url: prefix + '/hawkular/alerts/conditions/string/trigger/:triggerId',
                    isArray: true,
                    params: {
                        triggerId: '@triggerId'
                    }
                }
            });
            factory.ThresholdCondition = $resource(prefix + '/hawkular/alerts/conditions/threshold/:conditionId', {
                conditionId: '@conditionId'
            }, {
                put: {
                    method: 'PUT'
                },
                trigger: {
                    method: 'GET',
                    url: prefix + '/hawkular/alerts/conditions/threshold/trigger/:triggerId',
                    isArray: true,
                    params: {
                        triggerId: '@triggerId'
                    }
                }
            });
            factory.ThresholdRangeCondition = $resource(prefix + '/hawkular/alerts/conditions/range/:conditionId', {
                conditionId: '@conditionId'
            }, {
                put: {
                    method: 'PUT'
                },
                trigger: {
                    method: 'GET',
                    url: prefix + '/hawkular/alerts/conditions/range/trigger/:triggerId',
                    isArray: true,
                    params: {
                        triggerId: '@triggerId'
                    }
                }
            });
            factory.NotifierType = $resource(prefix + '/hawkular/alerts/notifierType/:notifierType', {
                notifierType: '@notifierType'
            }, {
                get: {
                    method: 'GET',
                    isArray: true
                }
            });
            factory.Notifier = $resource(prefix + '/hawkular/alerts/notifiers/:notifierId', {
                notifierId: '@notifierId'
            }, {
                put: {
                    method: 'PUT',
                    url: prefix + '/hawkular/alerts/notifiers/:notifierId',
                    params: {
                        notifierId: '@notifierId'
                    }
                },
                notifierType: {
                    method: 'GET',
                    isArray: true,
                    url: prefix + '/hawkular/alerts/notifiers/type/:notifierType',
                    params: {
                        notifierType: '@notifierType'
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
        this.host = 'localhost';
        this.port = 8080;
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', function ($resource) {
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
        this.host = 'localhost';
        this.port = 8080;
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', function ($resource) {
            var prefix = 'http://' + this.host + ':' + this.port;
            var metricUrlPart = '/rhq-metrics';
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
                },
                queryLog: {
                    method: 'GET',
                    isArray: true,
                    params: { type: 'log' }
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
                    isArray: false,
                    params: { type: 'num' }
                },
                queryMetricsTimeRange: {
                    method: 'GET',
                    isArray: false,
                    params: { type: 'num', buckets: 60, start: '@startTimestamp', end: '@endTimestamp' }
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
