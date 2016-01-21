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
 * @name hawkular.rest.HawkularAccount
 * @description
 * # HawkularAccount
 * Provider in the hawkular.rest.
 */

module hawkularRest {

    _module.provider('HawkularAccount', function() {

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

            factory.Persona = $resource(prefix + '/hawkular/accounts/personas/:id', {id:'@id'});
            factory.Role = $resource(prefix + '/hawkular/accounts/roles/:id', {id:'@id'});
            factory.Permission = $resource(prefix + '/hawkular/accounts/permissions/:id', {id:'@id'});
            factory.Token = $resource(prefix + '/secret-store/v1/tokens/:id', {id:'@id'});
            factory.OrganizationJoinRequest = $resource(prefix + '/hawkular/accounts/organizationJoinRequests/:organizationId', {organizationId:'@organizationId'}, {
                'update': {method: 'PUT'}
            }

            );
            factory.Organization = $resource(prefix + '/hawkular/accounts/organizations/:id',
              {
                id:'@id'
              }, {
                'update': {method: 'PUT'},
                'listToJoin': {method: 'GET', url: prefix + '/hawkular/accounts/organizations/join', isArray: true}
              }
            );
            factory.OrganizationMembership = $resource(prefix + '/hawkular/accounts/organizationMemberships/:id',
              {
                id:'@id'
              }, {
                'update': {method: 'PUT'}
              }
            );
            factory.OrganizationInvitation = $resource(
              prefix + '/hawkular/accounts/invitations/:id', null, {
                'update': {method: 'PUT'}
              }
            );
            factory.Settings = $resource(
              prefix + '/hawkular/accounts/settings', null, {
                'update': {method: 'PUT'}
              }
            );

            return factory;
        }];

    });
}
