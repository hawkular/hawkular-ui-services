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

  // Schema definitions from: https://github.com/hawkular/hawkular-command-gateway/tree/master/hawkular-command-gateway-api/src/main/resources/schema
  interface ICommonResponse {
    message: string;
    status: string;
    resourcePath: string;
  }

  interface IExecutionOperationResponse extends ICommonResponse {
    operationName: string;
  }

  interface IDeployApplicationResponse extends ICommonResponse {
    destinationFileName: string;
  }

  interface IAddJdbcDriverResponse {
    status: string;
    resourcePath: string;
    message?: string;
  }

  interface IExportJdrResponse {
    status: string;
    resourcePath: string;
    fileName?: string;
    message?: string;
  }

  interface IAddDatasourceResponse {
    status: string;
    resourcePath: string;
    message?: string;
  }

  interface IGenericErrorResponse {
    errorMessage: string;
    stackTrace: string;
  }


  interface IWebSocketResponseHandler {
    prefix: string;
    handle: (any, binaryData?:Blob) => void;
  }


  _module.provider('HawkularOps', function () {

    this.setHost = (host) => {
      this.host = host;
      return this;
    };

    this.setPort = (port) => {
      this.port = port;
      return this;
    };

    this.$get = ['$location', '$rootScope', '$log', ($location, $rootScope, $log) => {
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

      const responseHandlers:IWebSocketResponseHandler[] = [{
        prefix: 'GenericSuccessResponse=',
        handle: (operationResponse, binaryData:Blob) => {
          $log.log('Execution Operation request delivery: ', operationResponse.message);
          // Probably makes no sense to show this in the UI
          NotificationService.info('Execution Ops request delivery: ' + operationResponse.message);
        }
      }, {
        prefix: 'ExecuteOperationResponse=',
        handle: (operationResponse:IExecutionOperationResponse, binaryData:Blob) => {
          $log.log('Handling ExecuteOperationResponse');
          if (operationResponse.status === "OK") {

            NotificationService.success('Operation "' + operationResponse.operationName + '" on resource "'
              + operationResponse.resourcePath + '" succeeded.');
          } else if (operationResponse.status === "ERROR") {
            NotificationService.error('Operation "' + operationResponse.operationName + '" on resource "'
              + operationResponse.resourcePath + '" failed: ' + operationResponse.message);
          } else {
            $log.log('Unexpected operationResponse: ', operationResponse);
          }
        }
      },
        {
          prefix: 'DeployApplicationResponse=',
          handle: (deploymentResponse:IDeployApplicationResponse, binaryData:Blob)  => {
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
              $log.warn('Unexpected AddDeploymentOperationResponse: ', deploymentResponse);
              $rootScope.$broadcast('DeploymentAddError', message);
            }
          }
        },
        {
          prefix: 'AddJdbcDriverResponse=',
          handle: (addDriverResponse:IAddJdbcDriverResponse, binaryData:Blob)  => {
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
              $log.warn('Unexpected AddJdbcDriverOperationResponse: ', addDriverResponse);
              $rootScope.$broadcast('JDBCDriverAddError', message);
            }
          }
        },
        {
          prefix: 'AddDatasourceResponse=',
          handle: (addDatasourceResponse:IAddDatasourceResponse, binaryData:Blob)  => {
            let message;

            if (addDatasourceResponse.status === "OK") {
              message =
                addDatasourceResponse.message + '" on resource "' + addDatasourceResponse.resourcePath + '" with success.';

              $rootScope.$broadcast('DatasourceAddSuccess', message);

            } else if (addDatasourceResponse.status === "ERROR") {
              message = 'Add Datasource on resource "'
                + addDatasourceResponse.resourcePath + '" failed: ' + addDatasourceResponse.message;

              $rootScope.$broadcast('DatasourceAddError', message);
            } else {
              message = 'Add Datasource on resource "'
                + addDatasourceResponse.resourcePath + '" failed: ' + addDatasourceResponse.message;
              $log.warn('Unexpected AddDatasourceOperationResponse: ', addDatasourceResponse);
              $rootScope.$broadcast('DatasourceAddError', message);
            }
          }
        },
        {
          prefix: 'ExportJdrResponse=',
          handle: (jdrResponse:IExportJdrResponse, binaryData:Blob)  => {
            let message;

            if (jdrResponse.status === "OK") {
              message = 'JDR generated';
              let reportFileName:string = jdrResponse.fileName;

              // TODO: this could be extracted into a function, if other handlers also need to offer a download feature
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style.display = "none";
              var url = URL.createObjectURL(binaryData);
              a.href = url;
              a['download'] = reportFileName;
              a.click();
              setTimeout(function(){
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }, 100);

              $rootScope.$broadcast('ExportJDRSuccess', message);

            } else if (jdrResponse.status === "ERROR") {
              message = 'Export of JDR failed: ' + jdrResponse.message;
              $rootScope.$broadcast('ExportJDRError', message);
            } else {
              message = 'Export of JDR failed: ' + jdrResponse.message;
              console.error('Unexpected ExportJdrResponse: ', jdrResponse);
              $rootScope.$broadcast('ExportJDRError', message);
            }
          }
        },
        {
          prefix: 'GenericErrorResponse=',
          handle: (operationResponse:IGenericErrorResponse, binaryData:Blob) => {
            $log.warn('Unexpected AddJdbcDriverOperationResponse: ', operationResponse.errorMessage);
            NotificationService.info('Operation failed: ' + operationResponse.errorMessage);
          }
        }];

      ws.onopen = () => {
        $log.log('Execution Ops Socket has been opened!');
      };

      ws.onclose = (event) => {
        $log.warn('Execution Ops Socket closed!');
        NotificationService.error('Execution Ops socket closed: ' + event.reason);
        $rootScope.$broadcast('WebSocketClosed', event.reason);
      };

      ws.onmessage = (message:any) => {
        $log.log('Execution Ops WebSocket received:', message);
        let data = message.data;

        if (data instanceof Blob) {
          let reader = new FileReader();
          reader.addEventListener("loadend", () => {
            let textPart:string = "";
            let content:any = reader.result;
            let counter:number = 0;
            let started:boolean = false;
            let lastPartOfText:number;

            for (lastPartOfText = 0 ; lastPartOfText < content.length ; lastPartOfText++) {
              if (content.charAt(lastPartOfText) === '{') {
                counter++;
                started = true;
              }

              if (content.charAt(lastPartOfText) === '}') {
                counter--;
              }

              textPart += content.charAt(lastPartOfText);

              if (started && counter === 0) {
                // chopping off the content, starting from the end of the text part, up to the end
                data = data.slice(lastPartOfText+1);

                // we have read already a json, and it's completely closed now
                break;
              }
            }
            dispatchToHandlers(textPart, data);
          });
          reader.readAsText(data);
        } else {
          dispatchToHandlers(data);
        }
      };

      function dispatchToHandlers(message:string, binaryData?:Blob) {
        let handlerFound:boolean = false;
        for (let i = 0; i < responseHandlers.length; i++) {
          let h = responseHandlers[i];
          if (message.indexOf(h.prefix) === 0) {
            handlerFound = true;
            let opResult = JSON.parse(message.substring(h.prefix.length));
            h.handle(opResult, binaryData);
            break;
          }
        }

        if (!handlerFound) {
          $log.info('Unexpected WebSocket Execution Ops message: ', message);
        }
      }

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
        $log.log('DeployApplicationRequest: ' + json);
        ws.send(binaryblob);
      };

      factory.performAddJDBCDriverOperation = (resourcePath:string,
                                               driverJarName:string,
                                               driverName:string,
                                               moduleName:string,
                                               driverClass:string,
                                               driverMajorVersion:number,
                                               driverMinorVersion:number,
                                               fileBinaryContent:any,
                                               authToken:string,
                                               personaId:string) => {
        let driverObject:any = {
          resourcePath,
          driverJarName,
          driverName,
          moduleName,
          driverClass,
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

        let json = `AddJdbcDriverRequest=${JSON.stringify(driverObject)}`;
        let binaryblob = new Blob([json, fileBinaryContent], {type: 'application/octet-stream'});
        $log.log('AddJDBCDriverRequest: ' + json);
        ws.send(binaryblob);
      };

      factory.performAddDatasourceOperation = (resourcePath:string,
                                               authToken:string,
                                               personaId:string,
                                               xaDatasource:string,
                                               datasourceName:string,
                                               jndiName:string,
                                               driverName:string,
                                               driverClass:string,
                                               connectionUrl: string,
                                               xaDataSourceClass:string, // optional
                                               datasourceProperties:any, // optional
                                               userName:string, // optional
                                               password:string, // optional
                                               securityDomain:string // optional
                                               ) => {
        let datasourceObject:any = {
          resourcePath,
          xaDatasource,
          datasourceName,
          jndiName,
          driverName,
          driverClass,
          connectionUrl,
          xaDataSourceClass,
          datasourceProperties,
          userName,
          password,
          securityDomain,
          authentication: {
            token: authToken,
            persona: personaId
          }
        };

        let json = `AddDatasourceRequest=${JSON.stringify(datasourceObject)}`;
        $log.log('AddDatasourceRequest: ' + json);
        ws.send(json);
      };

      factory.performExportJDROperation = (resourcePath:string, authToken:string, personaId:string) => {
        let operation = {
          "resourcePath": resourcePath,
          "authentication": {
            "token": authToken,
            "persona": personaId
          }
        };
        let json = JSON.stringify(operation);
        $log.log('ExportJdrRequest=' + json);
        ws.send('ExportJdrRequest=' + json);
      };

      return factory;
    }];

  });
}
