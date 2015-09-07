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
 * @name hawkular.rest.HawkularAddDeploymentOps
 * @description
 * # HawkularAddDeploymentOps
 * Asynchronous Deployment Add operations
 */

module hawkularRest {

  _module.provider('HawkularAddDeploymentOps', function () {

    this.setHost = function (host) {
      this.host = host;
      return this;
    };

    this.setPort = function (port) {
      this.port = port;
      return this;
    };

    this.$get = ['$location', '$rootScope', function ($location, $rootScope) {
      // If available, used pre-configured values, otherwise use values from current browser location of fallback to
      // defaults
      this.setHost(this.host || $location.host() || 'localhost');
      this.setPort(this.port || $location.port() || 8080);

      var prefix = 'ws://' + this.host + ':' + this.port;
      var opsUrlPart = '/hawkular/feed-comm/ui/ws';
      var url = prefix + opsUrlPart;
      var factory:any = {};
      var NotificationService:any;

      var ws = new WebSocket(url);
      ws.binaryType = 'arraybuffer';

      var responseHandlers = [{
        prefix: 'GenericSuccessResponse=',
        handle: function (operationResponse) {
          console.log('Operation Deployment Request : ', operationResponse.message);
          // Probably makes no sense to show this in the UI
          NotificationService.info('Operation Deployment Request : ' + operationResponse.message);
        }
      }, {
        prefix: 'DeploymentOperationResponse=',
        handle: function (deploymentResponse) {
          var message;

          console.log('Add Deployment Response');

          if (deploymentResponse.status === "OK") {
            message =
              'Deployment "' + deploymentResponse.destinationFileName + '" on resource "'
              + deploymentResponse.resourcePath + '" succeeded.';

            NotificationService.success(message);

            $rootScope.$broadcast('DeploymentAddSuccess', message);

          } else if (deploymentResponse.status === "ERROR") {
            message = 'Deployment File: "' + deploymentResponse.destinationFileName + '" on resource "'
              + deploymentResponse.resourcePath + '" failed: ' + deploymentResponse.message;

            NotificationService.error(message);

            $rootScope.$broadcast('DeploymentAddError', message);
          } else {
            console.error('Unexpected deploymentOperationResponse: ', deploymentResponse);
            $rootScope.$broadcast('DeploymentAddError', message);
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
        console.log('Deployment WebSocket received:', message);
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

      factory.performOperation = function (resourcePath, destinationFileName, fileBinaryContent) {
        var json = 'DeployApplicationRequest={\"resourcePath\": \"' + resourcePath + '\", \"destinationFileName\":\"' + destinationFileName + '\" }';
        var binaryblob = new Blob([json, fileBinaryContent], {type: 'application/octet-stream'});
        console.log('DeployApplicationRequest: ' + json);
        ws.send(binaryblob);
      };


      return factory;
    }];

  });
}
