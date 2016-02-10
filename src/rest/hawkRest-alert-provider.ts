///
/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///    http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

/**
 * @ngdoc provider
 * @name hawkular.rest.HawkularAlert
 * @description
 * # HawkularAlert
 * Provider in the hawkular.rest.
 */

module hawkularRest {

  _module.provider('HawkularAlert', function() {

    this.setProtocol = function(protocol) {
      this.protocol = protocol;
      return this;
    };

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
      this.setProtocol(this.protocol || $location.protocol() || 'http');
      this.setHost(this.host || $location.host() || 'localhost');
      this.setPort(this.port || $location.port() || 8080);

      var prefix = this.protocol + '://' + this.host + ':' + this.port;
      var factory: any = {};

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
        full: {
          method: 'GET',
          url: prefix + '/hawkular/alerts/triggers/trigger/:triggerId',
          params: {
            triggerId: '@triggerId'
          }
        },
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
        },
        putGroup: {
          method: 'PUT',
          url: prefix + '/hawkular/alerts/triggers/groups/:groupId',
          params: {
            groupId: '@groupId'
          }
        }
      });

      factory.Dampening = $resource(prefix + '/hawkular/alerts/triggers/:triggerId/dampenings/:dampeningId', {
        triggerId: '@triggerId',
        dampeningId: '@dampeningId'
      }, {
        query: {
          method: 'GET',
          isArray: true,
          url: prefix + '/hawkular/alerts/triggers/:triggerId/dampenings/'
        },
        save: {
          method: 'POST',
          url: prefix + '/hawkular/alerts/triggers/:triggerId/dampenings/'
        },
        put: {
          method: 'PUT'
        },
        putGroup: {
          method: 'PUT',
          url: prefix + '/hawkular/alerts/triggers/groups/:groupId/dampenings/:dampeningId',
          params: {
            groupId: '@groupId',
            triggerMode: '@dampeningId'
          }
        }
      });

      factory.Conditions = $resource(prefix + '/hawkular/alerts/triggers/:triggerId/conditions/', {
        triggerId: '@triggerId'
      }, {
        query: {
          method: 'GET',
          isArray: true,
          url: prefix + '/hawkular/alerts/triggers/:triggerId/conditions/'
        },
        save: {
          method: 'PUT',
          isArray: true,
          url: prefix + '/hawkular/alerts/triggers/:triggerId/conditions/:triggerMode',
          params: {
            triggerId: '@triggerId',
            triggerMode: '@triggerMode'
          }
        },
        saveGroup: {
          method: 'PUT',
          isArray: true,
          url: prefix + '/hawkular/alerts/triggers/groups/:groupId/conditions/:triggerMode',
          params: {
            groupId: '@groupId',
            triggerMode: '@triggerMode'
          }
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
}

