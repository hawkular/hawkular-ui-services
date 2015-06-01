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
 * @name hawkular.rest.HawkularAlert
 * @description
 * # HawkularAlert
 * Provider in the hawkular.rest.
 */

module hawkularRest {

  _module.provider('HawkularAlert', function() {

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
      var factory: any = {};

      factory.Alert = $resource(prefix + '/hawkular/alerts', {

      }, {
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
}
