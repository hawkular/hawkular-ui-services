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

module hawkularRest {

  export var _module = angular.module('hawkular.services', ['ngResource']);

  // here comes type definitions and interfaces that can be reused by consumers of this module
  // these types/ifaces can define a contract
  export interface IWebSocketHandler {
    onmessage?(json: any): void;
    onopen?(event: any): void;
    onclose?(event: any): void;
    onerror?(event: any): void;
  }

}
