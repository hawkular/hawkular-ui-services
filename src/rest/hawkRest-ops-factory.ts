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

  _module.provider('HawkularOps', function () {

    this.setHost = (host) => {
      this.host = host;
      return this;
    };

    this.setPort = (port) => {
      this.port = port;
      return this;
    };

    this.$get = ['$location', '$rootScope', ($location, $rootScope) => {
      // If available, used pre-configured values, otherwise use values from current browser location of fallback to
      // defaults
      this.setHost(this.host || $location.host() || 'localhost');
      this.setPort(this.port || $location.port() || 8080);

      const prefix = 'ws://' + this.host + ':' + this.port;
      const opsUrlPart = '/hawkular/command-gateway/ui/ws';
      const url = prefix + opsUrlPart;
      let factory:any = {};
      let NotificationService:any;

      let ws = new WebSocket(url);

      let responseHandlers = [{
        prefix: 'GenericSuccessResponse=',
        handle: (operationResponse:any) => {
          console.log('Execution Operation request delivery: ', operationResponse.message);
          // Probably makes no sense to show this in the UI
          NotificationService.info('Execution Ops request delivery: ' + operationResponse.message);
        }
      }, {
        prefix: 'ExecuteOperationResponse=',
        handle: (operationResponse:any) => {
          console.log('Handling ExecuteOperationResponse');
          if (operationResponse.status === "OK") {

            NotificationService.success('Operation "' + operationResponse.operationName + '" on resource "'
              + operationResponse.resourceId + '" succeeded.');
          } else if (operationResponse.status === "ERROR") {
            NotificationService.error('Operation "' + operationResponse.operationName + '" on resource "'
              + operationResponse.resourceId + '" failed: ' + operationResponse.message);
          } else {
            console.log('Unexpected operationResponse: ', operationResponse);
          }
        }
      },
        {
          prefix: 'DeployApplicationResponse=',
          handle: (deploymentResponse)  => {
            let message;

            if (deploymentResponse.status === "OK") {
              message =
                'Deployment "' + deploymentResponse.destinationFileName + '" on resource "'
                + deploymentResponse.resourcePath + '" succeeded.';

              $rootScope.$broadcast('DeploymentAddSuccess', message);

            } else if (deploymentResponse.status === "ERROR") {
              message = 'Deployment File: "' + deploymentResponse.destinationFileName + '" on resource "'
                + deploymentResponse.resourcePath + '" failed: ' + deploymentResponse.message;

              $rootScope.$broadcast('DeploymentAddError', message);
            } else {
              message = 'Deployment File: "' + deploymentResponse.destinationFileName + '" on resource "'
                + deploymentResponse.resourcePath + '" failed: ' + deploymentResponse.message;
              console.error('Unexpected AddDeploymentOperationResponse: ', deploymentResponse);
              $rootScope.$broadcast('DeploymentAddError', message);
            }
          }
        },
        {
          prefix: 'AddJdbcDriverResponse=',
          handle: (addDriverResponse)  => {
            let message;

            if (addDriverResponse.status === "OK") {
              message =
                addDriverResponse.message + '" on resource "' + addDriverResponse.resourcePath + '" with success.';

              $rootScope.$broadcast('JDBCDriverAddSuccess', message);

            } else if (addDriverResponse.status === "ERROR") {
              message = 'Add JBDC Driver on resource "'
                + addDriverResponse.resourcePath + '" failed: ' + addDriverResponse.message;

              $rootScope.$broadcast('JDBCDriverAddError', message);
            } else {
              message = 'Add JBDC Driver on resource "'
                + addDriverResponse.resourcePath + '" failed: ' + addDriverResponse.message;
              console.error('Unexpected AddJdbcDriverOperationResponse: ', addDriverResponse);
              $rootScope.$broadcast('JDBCDriverAddError', message);
            }
          }
        },
        {
          prefix: 'GenericErrorResponse=',
          handle: (operationResponse) => {
            NotificationService.error('Operation failed: ' + operationResponse.message);
          }
        }];

      ws.onopen = () => {
        console.log('Execution Ops Socket has been opened!');
      };

      ws.onmessage = (message:any) => {
        console.log('Execution Ops WebSocket received:', message);
        let data = message.data;

        for (let i = 0; i < responseHandlers.length; i++) {
          let h = responseHandlers[i];
          if (data.indexOf(h.prefix) === 0) {
            let opResult = JSON.parse(data.substring(h.prefix.length));
            h.handle(opResult);
            break;
          }
        }
        console.info('Unexpected WebSocket Execution Ops message: ', message);
      };

      factory.init = (ns:any) => {
        NotificationService = ns;
      };

      factory.performOperation = (operation:any) => {
        ws.send('ExecuteOperationRequest=' + JSON.stringify(operation));
      };

      factory.performAddDeployOperation = (resourcePath:string,
                                           destinationFileName:string,
                                           fileBinaryContent:any,
                                           authToken:string,
                                           personaId:string,
                                           enabled:boolean = true) => {
        let json = `DeployApplicationRequest={"resourcePath": "${resourcePath}",
        "destinationFileName":"${destinationFileName}", "enabled":"${enabled}",
          "authentication": {"token":"${authToken}", "persona":"${personaId}" } }`;
        let binaryblob = new Blob([json, fileBinaryContent], {type: 'application/octet-stream'});
        console.log('DeployApplicationRequest: ' + json);
        ws.send(binaryblob);
      };

      factory.performAddJDBCDriverOperation = (resourcePath: string,
                                               driverJarName: string,
                                               driverName: string,
                                               moduleName: string,
                                               driverClass: string,
                                               fileBinaryContent:any,
                                               authToken:string,
                                               personaId:string) => {
        let json = `AddJdbcDriverRequest={"resourcePath": "${resourcePath}",
        "driverJarName":"${driverJarName}", "driverName":"${driverName}", "moduleName":"${moduleName}",
        "driverClass":"${driverClass}", "authentication": {"token":"${authToken}", "persona":"${personaId}" } }`;
        let binaryblob = new Blob([json, fileBinaryContent], {type: 'application/octet-stream'});
        console.log('AddJDBCDriverRequest: ' + json);
        ws.send(binaryblob);
      };

      return factory;
    }];

  });
}
