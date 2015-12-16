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
/// <reference path="../../lib/hawtio-core-dts/angular.d.ts" />
var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module = angular.module('hawkular.services', ['ngResource']);
})(hawkularRest || (hawkularRest = {}));

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
                factory.Persona = $resource(prefix + '/hawkular/accounts/personas/:id', { id: '@id' });
                factory.Role = $resource(prefix + '/hawkular/accounts/roles/:id', { id: '@id' });
                factory.Permission = $resource(prefix + '/hawkular/accounts/permissions/:id', { id: '@id' });
                factory.Token = $resource(prefix + '/hawkular/secret-store/v1/tokens/:id', { id: '@id' });
                factory.Organization = $resource(prefix + '/hawkular/accounts/organizations/:id', {
                    id: '@id'
                }, {
                    'update': { method: 'PUT' }
                });
                factory.OrganizationMembership = $resource(prefix + '/hawkular/accounts/organizationMemberships/:id', {
                    id: '@id'
                }, {
                    'update': { method: 'PUT' }
                });
                factory.OrganizationInvitation = $resource(prefix + '/hawkular/accounts/invitations/:id', null, {
                    'update': { method: 'PUT' }
                });
                factory.Settings = $resource(prefix + '/hawkular/accounts/settings', null, {
                    'update': { method: 'PUT' }
                });
                return factory;
            }];
    });
})(hawkularRest || (hawkularRest = {}));

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
                factory.Alert = $resource(prefix + '/hawkular/alerts/alert/:alertId', {
                    alertId: '@alertId'
                }, {
                    query: {
                        method: 'GET',
                        isArray: true,
                        url: prefix + '/hawkular/alerts'
                    },
                    delete: {
                        method: 'PUT',
                        url: prefix + '/hawkular/alerts/delete'
                    },
                    ack: {
                        method: 'PUT',
                        url: prefix + '/hawkular/alerts/ack/:alertId'
                    },
                    ackmany: {
                        method: 'PUT',
                        url: prefix + '/hawkular/alerts/ack'
                    },
                    resolve: {
                        method: 'PUT',
                        url: prefix + '/hawkular/alerts/resolve/:alertId'
                    },
                    resolvemany: {
                        method: 'PUT',
                        url: prefix + '/hawkular/alerts/resolve'
                    },
                    note: {
                        method: 'PUT',
                        url: prefix + '/hawkular/alerts/note/:alertId',
                        params: {
                            user: '@user',
                            text: '@text'
                        }
                    },
                    send: {
                        method: 'POST',
                        url: prefix + '/hawkular/alerts/data'
                    }
                });
                factory.Trigger = $resource(prefix + '/hawkular/alerts/triggers/:triggerId', {
                    triggerId: '@triggerId'
                }, {
                    query: {
                        method: 'GET',
                        isArray: true,
                        url: prefix + '/hawkular/alerts/triggers'
                    },
                    save: {
                        method: 'POST',
                        url: prefix + '/hawkular/alerts/triggers/'
                    },
                    put: {
                        method: 'PUT'
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
                factory.Conditions = $resource(prefix + '/hawkular/alerts/triggers/:triggerId/conditions/', {
                    triggerId: '@triggerId'
                }, {
                    save: {
                        method: 'PUT',
                        isArray: true,
                        url: prefix + '/hawkular/alerts/triggers/:triggerId/conditions/:triggerMode',
                        params: {
                            triggerId: '@triggerId',
                            triggerMode: '@triggerMode'
                        }
                    },
                    query: {
                        method: 'GET',
                        isArray: true,
                        url: prefix + '/hawkular/alerts/triggers/:triggerId/conditions/'
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
                    },
                    queryHistory: {
                        method: 'GET',
                        isArray: true,
                        url: prefix + '/hawkular/alerts/actions/history'
                    },
                    deleteHistory: {
                        method: 'PUT',
                        isArray: true,
                        url: prefix + '/hawkular/alerts/actions/history/delete'
                    }
                });
                return factory;
            }];
    });
})(hawkularRest || (hawkularRest = {}));

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
    hawkularRest._module.constant('inventoryInterceptURLS', [new RegExp('.+/inventory/.+/resources/.+%2F.+', 'i'), new RegExp('.+/inventory/.+/resources/.+%252F.+', 'i')]);
    hawkularRest._module.config(['$httpProvider', 'inventoryInterceptURLS', function ($httpProvider, inventoryInterceptURLS) {
            var SLASH = '/';
            var ENCODED_SLASH = '%2F';
            var ENCODED_SLASH_RE = new RegExp(ENCODED_SLASH, 'gi');
            var DOUBLE_ENCODED_SLASH = '%252F';
            var DOUBLE_ENCODED_SLASH_RE = new RegExp(DOUBLE_ENCODED_SLASH, 'gi');
            $httpProvider.interceptors.push(function ($q) {
                return {
                    'request': function (config) {
                        var url = config.url;
                        for (var i = 0; i < inventoryInterceptURLS.length; i++) {
                            if (url.match(inventoryInterceptURLS[i])) {
                                url = url.replace(ENCODED_SLASH_RE, SLASH).replace(DOUBLE_ENCODED_SLASH_RE, ENCODED_SLASH);
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
                var relsActionFor = function (url) {
                    return {
                        method: 'GET',
                        isArray: true,
                        url: url + '/relationships'
                    };
                };
                var createDataActions = function (urlPrefix, defaultDataType) {
                    var urlForData = urlPrefix + '/data';
                    return {
                        relationships: relsActionFor(urlPrefix),
                        getData: {
                            method: 'GET',
                            params: { dataType: defaultDataType },
                            url: urlForData
                        },
                        createData: {
                            method: 'POST',
                            url: urlForData
                        },
                        updateData: {
                            method: 'PUT',
                            params: { dataType: defaultDataType },
                            url: urlForData
                        },
                        deleteData: {
                            method: 'DELETE',
                            params: { dataType: defaultDataType },
                            url: urlForData
                        }
                    };
                };
                var createResourceActions = function (urlPrefix, defaultDataType) {
                    var dataActions = createDataActions(urlPrefix, defaultDataType);
                    dataActions['getChildren'] = {
                        method: 'GET',
                        isArray: true,
                        url: urlPrefix + '/children'
                    };
                    dataActions['getParents'] = {
                        method: 'GET',
                        isArray: true,
                        url: urlPrefix + '/parents'
                    };
                    dataActions['getParent'] = {
                        method: 'GET',
                        url: urlPrefix + '/parent'
                    };
                    dataActions['getMetrics'] = {
                        method: 'GET',
                        url: urlPrefix + '/metrics'
                    };
                    dataActions['updateProperties'] = {
                        method: 'PUT',
                        url: urlPrefix
                    };
                    return dataActions;
                };
                factory.Tenant = $resource(url + '/tenant', {
                    put: {
                        method: 'PUT'
                    }
                });
                var environmentUrl = url + '/environments/:environmentId';
                factory.Environment = $resource(environmentUrl, null, {
                    put: {
                        method: 'PUT'
                    },
                    relationships: relsActionFor(environmentUrl)
                });
                var feedUrl = url + '/feeds/:feedId';
                factory.Feed = $resource(feedUrl, null, {
                    put: {
                        method: 'PUT'
                    },
                    relationships: relsActionFor(feedUrl)
                });
                var resourceUrl = url + '/:environmentId/resources/:resourcePath';
                factory.Resource = $resource(resourceUrl, null, createResourceActions(resourceUrl, 'configuration'));
                var feedResourceUrl = url + '/feeds/:feedId/resources/:resourcePath';
                factory.ResourceUnderFeed = $resource(feedResourceUrl, null, createResourceActions(feedResourceUrl, 'configuration'));
                var resourceTypeUrl = url + '/resourceTypes/:resourceTypeId';
                factory.ResourceType = $resource(resourceTypeUrl, null, createDataActions(resourceTypeUrl, 'configurationSchema'));
                var feedResourceTypeUrl = url + '/feeds/:feedId/resourceTypes/:resourceTypeId';
                factory.ResourceTypeUnderFeed = $resource(feedResourceTypeUrl, null, createDataActions(feedResourceTypeUrl, 'configurationSchema'));
                var metricTypeUrl = url + '/metricTypes/:metricTypeId';
                factory.MetricType = $resource(metricTypeUrl, null, {
                    put: {
                        method: 'PUT'
                    },
                    relationships: relsActionFor(metricTypeUrl)
                });
                var feedMetricTypeUrl = url + '/feeds/:feedId/metricTypes/:metricTypeId';
                factory.MetricTypeUnderFeed = $resource(feedMetricTypeUrl, null, {
                    put: {
                        method: 'PUT'
                    },
                    relationships: relsActionFor(feedMetricTypeUrl)
                });
                var resourceMetricUrl = url + '/:environmentId/resources/:resourcePath/metrics/:metricId';
                factory.MetricOfResource = $resource(resourceMetricUrl, null, {
                    put: {
                        method: 'PUT'
                    }
                });
                var feedResourceMetricUrl = url + '/feeds/:feedId/resources/:resourcePath/metrics/:metricId';
                factory.MetricOfResourceUnderFeed = $resource(resourceMetricUrl, null, {
                    put: {
                        method: 'PUT'
                    }
                });
                var metricTypeOfResourceTypeUrl = url + '/resourceTypes/:resourceTypeId/metricTypes/:metricTypeId';
                factory.MetricTypeOfResourceType = $resource(metricTypeOfResourceTypeUrl, null, {
                    relationships: relsActionFor(metricTypeOfResourceTypeUrl)
                });
                var feedMetricTypeOfResourceTypeUrl = url + '/feeds/:feedId/resourceTypes/:resourceTypeId/metricTypes/:metricTypeId';
                factory.MetricTypeOfResourceTypeUnderFeed = $resource(feedMetricTypeOfResourceTypeUrl, null, {
                    relationships: relsActionFor(feedMetricTypeOfResourceTypeUrl)
                });
                factory.ResourceOfType = $resource(url + '/resourceTypes/:resourceTypeId/resources');
                factory.ResourceOfTypeUnderFeed =
                    $resource(url + '/feeds/:feedId/resourceTypes/:resourceTypeId/resources');
                factory.ResourceRecursiveChildren = $resource(url + '/:environmentId/resources/:resourcePath/recursiveChildren');
                factory.ResourceRecursiveChildrenUnderFeed =
                    $resource(url + '/feeds/:feedId/resources/:resourcePath/recursiveChildren');
                var metricUrl = url + '/:environmentId/metrics/:metricId';
                factory.Metric = $resource(metricUrl, null, {
                    put: {
                        method: 'PUT'
                    },
                    relationships: relsActionFor(metricUrl)
                });
                var feedMetricUrl = url + '/feeds/:feedId/metrics/:metricId';
                factory.MetricUnderFeed = $resource(feedMetricUrl, null, {
                    put: {
                        method: 'PUT'
                    },
                    relationships: relsActionFor(feedMetricUrl)
                });
                factory.Graph = $resource(url + '/graph');
                return factory;
            }];
    });
})(hawkularRest || (hawkularRest = {}));

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
        this.$get = ['$resource', '$location', function ($resource, $location) {
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
                            } },
                        save: {
                            method: 'POST',
                            headers: { 'Hawkular-Tenant': tenantId }
                        }
                    });
                };
                factory.GaugeMetricMultipleStats = function (tenantId) {
                    var metrics = '@metrics';
                    var useStacked = '@stacked' || false;
                    var myRequest = $resource(url + '/gauges/data', {
                        buckets: '@buckets'
                    }, {
                        get: {
                            method: 'GET',
                            headers: { 'Hawkular-Tenant': tenantId },
                            isArray: true,
                            params: { metrics: metrics,
                                stacked: useStacked }
                        }
                    });
                    return myRequest;
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
                            } },
                        save: {
                            method: 'POST',
                            headers: { 'Hawkular-Tenant': tenantId }
                        }
                    });
                };
                factory.CounterMetricRate = function (tenantId) {
                    return $resource(url + '/counters/:counterId/rate', {
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
    hawkularRest._module.provider('HawkularOps', function () {
        var _this = this;
        this.setHost = function (host) {
            _this.host = host;
            return _this;
        };
        this.setPort = function (port) {
            _this.port = port;
            return _this;
        };
        this.$get = ['$location', '$rootScope', '$log', function ($location, $rootScope, $log) {
                _this.setHost(_this.host || $location.host() || 'localhost');
                _this.setPort(_this.port || $location.port() || 8080);
                var prefix = 'ws://' + _this.host + ':' + _this.port;
                var opsUrlPart = '/hawkular/command-gateway/ui/ws';
                var url = prefix + opsUrlPart;
                var factory = {};
                var NotificationService;
                var ws = new WebSocket(url);
                var responseHandlers = [{
                        prefix: 'GenericSuccessResponse=',
                        handle: function (operationResponse, binaryData) {
                            $log.log('Execution Operation request delivery: ', operationResponse.message);
                            NotificationService.info('Execution Ops request delivery: ' + operationResponse.message);
                        }
                    },
                    {
                        prefix: 'WelcomeResponse=',
                        handle: function (welcomeResponse) {
                            $log.log('Welcome Response Received, sessionId: ' + welcomeResponse.sessionId);
                            $rootScope.$broadcast('WelcomeMessage', welcomeResponse.sessionId);
                        }
                    },
                    {
                        prefix: 'ExecuteOperationResponse=',
                        handle: function (operationResponse, binaryData) {
                            $log.log('Handling ExecuteOperationResponse');
                            if (operationResponse.status === "OK") {
                                NotificationService.success('Operation "' + operationResponse.operationName + '" on resource "'
                                    + operationResponse.resourcePath + '" succeeded.');
                            }
                            else if (operationResponse.status === "ERROR") {
                                NotificationService.error('Operation "' + operationResponse.operationName + '" on resource "'
                                    + operationResponse.resourcePath + '" failed: ' + operationResponse.message);
                            }
                            else {
                                $log.log('Unexpected operationResponse: ', operationResponse);
                            }
                        }
                    },
                    {
                        prefix: 'DeployApplicationResponse=',
                        handle: function (deploymentResponse, binaryData) {
                            var message;
                            if (deploymentResponse.status === "OK") {
                                message =
                                    'Deployment "' + deploymentResponse.destinationFileName + '" on resource "'
                                        + deploymentResponse.resourcePath + '" succeeded.';
                                $rootScope.$broadcast('DeploymentAddSuccess', message);
                            }
                            else if (deploymentResponse.status === "ERROR") {
                                message = 'Deployment File: "' + deploymentResponse.destinationFileName + '" on resource "'
                                    + deploymentResponse.resourcePath + '" failed: ' + deploymentResponse.message;
                                $rootScope.$broadcast('DeploymentAddError', message);
                            }
                            else {
                                message = 'Deployment File: "' + deploymentResponse.destinationFileName + '" on resource "'
                                    + deploymentResponse.resourcePath + '" failed: ' + deploymentResponse.message;
                                $log.warn('Unexpected AddDeploymentOperationResponse: ', deploymentResponse);
                                $rootScope.$broadcast('DeploymentAddError', message);
                            }
                        }
                    },
                    {
                        prefix: 'AddJdbcDriverResponse=',
                        handle: function (addDriverResponse, binaryData) {
                            var message;
                            if (addDriverResponse.status === "OK") {
                                message =
                                    addDriverResponse.message + '" on resource "' + addDriverResponse.resourcePath + '" with success.';
                                $rootScope.$broadcast('JDBCDriverAddSuccess', message);
                            }
                            else if (addDriverResponse.status === "ERROR") {
                                message = 'Add JBDC Driver on resource "'
                                    + addDriverResponse.resourcePath + '" failed: ' + addDriverResponse.message;
                                $rootScope.$broadcast('JDBCDriverAddError', message);
                            }
                            else {
                                message = 'Add JBDC Driver on resource "'
                                    + addDriverResponse.resourcePath + '" failed: ' + addDriverResponse.message;
                                $log.warn('Unexpected AddJdbcDriverOperationResponse: ', addDriverResponse);
                                $rootScope.$broadcast('JDBCDriverAddError', message);
                            }
                        }
                    },
                    {
                        prefix: 'RemoveJdbcDriverResponse=',
                        handle: function (removeJdbcDriverResponse) {
                            var message;
                            if (removeJdbcDriverResponse.status === "OK") {
                                message =
                                    removeJdbcDriverResponse.message + '" on resource "' + removeJdbcDriverResponse.resourcePath + '" with success.';
                                $rootScope.$broadcast('JdbcDriverRemoveSuccess', message);
                            }
                            else if (removeJdbcDriverResponse.status === "ERROR") {
                                message = 'Remove JDBC Driver on resource "'
                                    + removeJdbcDriverResponse.resourcePath + '" failed: ' + removeJdbcDriverResponse.message;
                                $rootScope.$broadcast('JdbcDriverRemoveError', message);
                            }
                            else {
                                message = 'Remove JDBC Driver on resource "'
                                    + removeJdbcDriverResponse.resourcePath + '" failed: ' + removeJdbcDriverResponse.message;
                                $log.warn('Unexpected RemoveJdbcDriverOperationResponse: ', removeJdbcDriverResponse);
                                $rootScope.$broadcast('JdbcDriverRemoveError', message);
                            }
                        }
                    },
                    {
                        prefix: 'AddDatasourceResponse=',
                        handle: function (addDatasourceResponse, binaryData) {
                            var message;
                            if (addDatasourceResponse.status === "OK") {
                                message =
                                    addDatasourceResponse.message + '" on resource "' + addDatasourceResponse.resourcePath + '" with success.';
                                $rootScope.$broadcast('DatasourceAddSuccess', message);
                            }
                            else if (addDatasourceResponse.status === "ERROR") {
                                message = 'Add Datasource on resource "'
                                    + addDatasourceResponse.resourcePath + '" failed: ' + addDatasourceResponse.message;
                                $rootScope.$broadcast('DatasourceAddError', message);
                            }
                            else {
                                message = 'Add Datasource on resource "'
                                    + addDatasourceResponse.resourcePath + '" failed: ' + addDatasourceResponse.message;
                                $log.warn('Unexpected AddDatasourceOperationResponse: ', addDatasourceResponse);
                                $rootScope.$broadcast('DatasourceAddError', message);
                            }
                        }
                    },
                    {
                        prefix: 'UpdateDatasourceResponse=',
                        handle: function (updateDatasourceResponse, binaryData) {
                            var message;
                            if (updateDatasourceResponse.status === "OK") {
                                message =
                                    updateDatasourceResponse.message + '" on resource "' + updateDatasourceResponse.resourcePath + '" with success.';
                                $rootScope.$broadcast('DatasourceUpdateSuccess', message);
                            }
                            else if (updateDatasourceResponse.status === "ERROR") {
                                message = 'Update Datasource on resource "'
                                    + updateDatasourceResponse.resourcePath + '" failed: ' + updateDatasourceResponse.message;
                                $rootScope.$broadcast('DatasourceUpdateError', message);
                            }
                            else {
                                message = 'Update Datasource on resource "'
                                    + updateDatasourceResponse.resourcePath + '" failed: ' + updateDatasourceResponse.message;
                                $log.warn('Unexpected UpdateDatasourceOperationResponse: ', updateDatasourceResponse);
                                $rootScope.$broadcast('DatasourceUpdateError', message);
                            }
                        }
                    },
                    {
                        prefix: 'RemoveDatasourceResponse=',
                        handle: function (removeDatasourceResponse) {
                            var message;
                            if (removeDatasourceResponse.status === "OK") {
                                message =
                                    removeDatasourceResponse.message + '" on resource "' + removeDatasourceResponse.resourcePath + '" with success.';
                                $rootScope.$broadcast('DatasourceRemoveSuccess', message);
                            }
                            else if (removeDatasourceResponse.status === "ERROR") {
                                message = 'Remove Datasource on resource "'
                                    + removeDatasourceResponse.resourcePath + '" failed: ' + removeDatasourceResponse.message;
                                $rootScope.$broadcast('DatasourceRemoveError', message);
                            }
                            else {
                                message = 'Remove Datasource on resource "'
                                    + removeDatasourceResponse.resourcePath + '" failed: ' + removeDatasourceResponse.message;
                                $log.warn('Unexpected RemoveDatasourceOperationResponse: ', removeDatasourceResponse);
                                $rootScope.$broadcast('DatasourceRemoveError', message);
                            }
                        }
                    },
                    {
                        prefix: 'ExportJdrResponse=',
                        handle: function (jdrResponse, binaryData) {
                            var message;
                            if (jdrResponse.status === "OK") {
                                message = 'JDR generated';
                                var reportFileName = jdrResponse.fileName;
                                var a = document.createElement("a");
                                document.body.appendChild(a);
                                a.style.display = "none";
                                var url = URL.createObjectURL(binaryData);
                                a.href = url;
                                a['download'] = reportFileName;
                                a.click();
                                setTimeout(function () {
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                }, 100);
                                $rootScope.$broadcast('ExportJDRSuccess', message);
                            }
                            else if (jdrResponse.status === "ERROR") {
                                message = 'Export of JDR failed: ' + jdrResponse.message;
                                $rootScope.$broadcast('ExportJDRError', message);
                            }
                            else {
                                message = 'Export of JDR failed: ' + jdrResponse.message;
                                console.error('Unexpected ExportJdrResponse: ', jdrResponse);
                                $rootScope.$broadcast('ExportJDRError', message);
                            }
                        }
                    },
                    {
                        prefix: 'GenericErrorResponse=',
                        handle: function (operationResponse, binaryData) {
                            $log.warn('Unexpected Error Response: ', operationResponse.errorMessage);
                            NotificationService.info('Operation failed: ' + operationResponse.errorMessage);
                        }
                    }];
                ws.onopen = function () {
                    $log.log('Execution Ops Socket has been opened!');
                };
                ws.onclose = function (event) {
                    $log.warn('Execution Ops Socket closed!');
                    NotificationService.error('Execution Ops socket closed: ' + event.reason);
                    $rootScope.$broadcast('WebSocketClosed', event.reason);
                };
                ws.onmessage = function (message) {
                    $log.log('Execution Ops WebSocket received:', message);
                    var data = message.data;
                    if (data instanceof Blob) {
                        var reader = new FileReader();
                        reader.addEventListener("loadend", function () {
                            var textPart = "";
                            var content = reader.result;
                            var counter = 0;
                            var started = false;
                            var lastPartOfText;
                            for (lastPartOfText = 0; lastPartOfText < content.length; lastPartOfText++) {
                                if (content.charAt(lastPartOfText) === '{') {
                                    counter++;
                                    started = true;
                                }
                                if (content.charAt(lastPartOfText) === '}') {
                                    counter--;
                                }
                                textPart += content.charAt(lastPartOfText);
                                if (started && counter === 0) {
                                    data = data.slice(lastPartOfText + 1);
                                    break;
                                }
                            }
                            dispatchToHandlers(textPart, data);
                        });
                        reader.readAsText(data);
                    }
                    else {
                        dispatchToHandlers(data);
                    }
                };
                function dispatchToHandlers(message, binaryData) {
                    var handlerFound = false;
                    for (var i = 0; i < responseHandlers.length; i++) {
                        var h = responseHandlers[i];
                        if (message.indexOf(h.prefix) === 0) {
                            handlerFound = true;
                            var opResult = JSON.parse(message.substring(h.prefix.length));
                            h.handle(opResult, binaryData);
                            break;
                        }
                    }
                    if (!handlerFound) {
                        $log.info('Unexpected WebSocket Execution Ops message: ', message);
                    }
                }
                factory.init = function (ns) {
                    NotificationService = ns;
                };
                factory.performOperation = function (operation) {
                    ws.send('ExecuteOperationRequest=' + JSON.stringify(operation));
                };
                factory.performAddDeployOperation = function (resourcePath, destinationFileName, fileBinaryContent, authToken, personaId, enabled) {
                    if (enabled === void 0) { enabled = true; }
                    var json = "DeployApplicationRequest={\"resourcePath\": \"" + resourcePath + "\",\n        \"destinationFileName\":\"" + destinationFileName + "\", \"enabled\":\"" + enabled + "\",\n          \"authentication\": {\"token\":\"" + authToken + "\", \"persona\":\"" + personaId + "\" } }";
                    var binaryblob = new Blob([json, fileBinaryContent], { type: 'application/octet-stream' });
                    $log.log('DeployApplicationRequest: ' + json);
                    ws.send(binaryblob);
                };
                factory.performAddJDBCDriverOperation = function (resourcePath, driverJarName, driverName, moduleName, driverClass, driverMajorVersion, driverMinorVersion, fileBinaryContent, authToken, personaId) {
                    var driverObject = {
                        resourcePath: resourcePath,
                        driverJarName: driverJarName,
                        driverName: driverName,
                        moduleName: moduleName,
                        driverClass: driverClass,
                        authentication: {
                            token: authToken,
                            persona: personaId
                        }
                    };
                    if (driverMajorVersion) {
                        driverObject.driverMajorVersion = driverMajorVersion;
                    }
                    if (driverMinorVersion) {
                        driverObject.driverMinorVersion = driverMinorVersion;
                    }
                    var json = "AddJdbcDriverRequest=" + JSON.stringify(driverObject);
                    var binaryblob = new Blob([json, fileBinaryContent], { type: 'application/octet-stream' });
                    $log.log('AddJDBCDriverRequest: ' + json);
                    ws.send(binaryblob);
                };
                factory.performRemoveJdbcDriverOperation = function (resourcePath, authToken, personaId) {
                    var driverObject = {
                        resourcePath: resourcePath,
                        authentication: {
                            token: authToken,
                            persona: personaId
                        }
                    };
                    var json = "RemoveJdbcDriverRequest=" + JSON.stringify(driverObject);
                    $log.log('RemoveJdbcDriverRequest: ' + json);
                    ws.send(json);
                };
                factory.performAddDatasourceOperation = function (resourcePath, authToken, personaId, xaDatasource, datasourceName, jndiName, driverName, driverClass, connectionUrl, xaDataSourceClass, datasourceProperties, userName, password, securityDomain) {
                    var datasourceObject = {
                        resourcePath: resourcePath,
                        xaDatasource: xaDatasource,
                        datasourceName: datasourceName,
                        jndiName: jndiName,
                        driverName: driverName,
                        driverClass: driverClass,
                        connectionUrl: connectionUrl,
                        xaDataSourceClass: xaDataSourceClass,
                        datasourceProperties: datasourceProperties,
                        userName: userName,
                        password: password,
                        securityDomain: securityDomain,
                        authentication: {
                            token: authToken,
                            persona: personaId
                        }
                    };
                    var json = "AddDatasourceRequest=" + JSON.stringify(datasourceObject);
                    $log.log('AddDatasourceRequest: ' + json);
                    ws.send(json);
                };
                factory.performUpdateDatasourceOperation = function (resourcePath, authToken, personaId, datasourceName, jndiName, driverName, driverClass, connectionUrl, xaDataSourceClass, datasourceProperties, userName, password, securityDomain) {
                    var datasourceObject = {
                        resourcePath: resourcePath,
                        datasourceName: datasourceName,
                        jndiName: jndiName,
                        driverName: driverName,
                        driverClass: driverClass,
                        connectionUrl: connectionUrl,
                        xaDataSourceClass: xaDataSourceClass,
                        datasourceProperties: datasourceProperties,
                        userName: userName,
                        password: password,
                        securityDomain: securityDomain,
                        authentication: {
                            token: authToken,
                            persona: personaId
                        }
                    };
                    var json = "UpdateDatasourceRequest=" + JSON.stringify(datasourceObject);
                    $log.log('UpdateDatasourceRequest: ' + json);
                    ws.send(json);
                };
                factory.performRemoveDatasourceOperation = function (resourcePath, authToken, personaId) {
                    var datasourceObject = {
                        resourcePath: resourcePath,
                        authentication: {
                            token: authToken,
                            persona: personaId
                        }
                    };
                    var json = "RemoveDatasourceRequest=" + JSON.stringify(datasourceObject);
                    $log.log('RemoveDatasourceRequest: ' + json);
                    ws.send(json);
                };
                factory.performExportJDROperation = function (resourcePath, authToken, personaId) {
                    var operation = {
                        "resourcePath": resourcePath,
                        "authentication": {
                            "token": authToken,
                            "persona": personaId
                        }
                    };
                    var json = JSON.stringify(operation);
                    $log.log('ExportJdrRequest=' + json);
                    ws.send('ExportJdrRequest=' + json);
                };
                return factory;
            }];
    });
})(hawkularRest || (hawkularRest = {}));
