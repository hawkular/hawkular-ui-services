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
 * @name hawkular.rest.HawkularOps
 * @description
 * # HawkularOps
 * Asynchronous operations support
 */

module hawkularRest {

  _module.provider('HawkularOps', function() {

    this.setHost = function(host) {
      this.host = host;
      return this;
    };

    this.setPort = function(port) {
      this.port = port;
      return this;
    };

    this.$get = ['$location', '$http', function($location) {
      // If available, used pre-configured values, otherwise use values from current browser location of fallback to
      // defaults
      this.setHost(this.host || $location.host() || 'localhost');
      this.setPort(this.port || $location.port() || 8080);

      var prefix = 'ws://' + this.host + ':' + this.port;
      var opsUrlPart = '/hawkular/feed-comm/ui/ws';
      var url = prefix + opsUrlPart;
      var factory: any = {};
      var NotificationService: any;

      var ws = new WebSocket(url);

      var responseHandlers = [{
        prefix: 'GenericSuccessResponse=',
        handle: function(operationResponse) {
          console.log('Operation request delivery: ', operationResponse.message);
          // Probably makes no sense to show this in the UI
          // NotificationService.info('Operation request delivery: ' + operationResponse.message);
        }
      }, {
        prefix: 'ExecuteOperationResponse=',
        handle: function(operationResponse) {
          if (operationResponse.status === "OK") {
            NotificationService.success('Operation "' + operationResponse.operationName + '" on resource "'
                + operationResponse.resourceId +'" succeeded.');
          } else if (operationResponse.status === "ERROR") {
            NotificationService.error('Operation "' + operationResponse.operationName + '" on resource "'
                + operationResponse.resourceId +'" failed: '+ operationResponse.message);
          } else {
            console.log('Unexpected operationResponse: ', operationResponse);
          }
        }
      }, {
        prefix: 'GenericErrorResponse=',
        handle: function(operationResponse) {
          NotificationService.error('Operation failed: ' + operationResponse.message);
        }
      }];

      ws.onopen = function(){
        console.log('Socket has been opened!');
      };

      ws.onmessage = function(message) {
        console.log('WebSocket recevied:', message);
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

      factory.init = function(ns) {
        NotificationService = ns;
      };

      factory.performOperation = function(operation) {
        ws.send('ExecuteOperationRequest=' + JSON.stringify(operation));
      };

      return factory;
    }];

  });
}
