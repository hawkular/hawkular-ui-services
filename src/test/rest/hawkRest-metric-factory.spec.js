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
describe('Factory: hawkMetric', function() {

  var hawkMetric,
      $httpBackend,
      prefix = 'http://localhost:8080';

  beforeEach(module('hawkular.services'));

  beforeEach(inject(function(_HawkularRest_, _$httpBackend_) {
    HawkularRest = _HawkularRest_;
    $httpBackend = _$httpBackend_;
  }));

  it('should create a tenant', function() {
    var tenantId = 'myTenantId';

    $httpBackend.expectPOST(prefix + '/hawkular/metrics/tenants')
      .respond(200);
    var result = HawkularRest.Tenant.create({tenantId: tenantId});

    $httpBackend.flush();

    expect(result.$resolved).toBe(true);
  });

  it('should create a metric', function() {
    var tenantId = 'myTenantId';

    $httpBackend.expectGET(prefix + '/hawkular/metrics/' + tenantId + '/metrics')
      .respond([{
        name: 'mock.metric',
        metadata: {
          units: 'bytes',
          env: 'test'
        },
        dataRetention: 96
      }]);
    var result = HawkularRest.Metric.query({tenantId: tenantId});

    $httpBackend.flush();

    expect(result[0].name).toEqual('mock.metric');
  });

});
