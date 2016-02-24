/*
 * Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Module needed for the test-suite to be able to do actual (non-mock) REST calls
angular.module('httpReal', ['ng'])
  .config(['$provide', function($provide) {
    $provide.decorator('$httpBackend', function() {
      return angular.injector(['ng']).get('$httpBackend');
    });
  }])
  .service('httpReal', ['$rootScope', function($rootScope) {
    this.submit = function() {
      $rootScope.$digest();
    };
  }]);

var TIMEOUT = 30000;

var errorFn = function(error){
  var msg = 'ngResource error: ' + (error && error.data && error.data.errorMsg ? error.data.errorMsg : JSON.stringify(error));
  return(msg);
};
