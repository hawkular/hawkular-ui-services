describe('Provider: Hawkular live REST', function() {
  // todo: put credentials to each request, find out what is my tenant uuid and do the testsuite against it
  // also test if the stuff was precreated correctly

  var HawkularInventory;
  var res;
  var httpReal;
  var $http;

  var debug = false;
  var suffix = '-test-' + new Date().getTime();
  var tId;
  var typeId = 'type' + suffix;
  var eId = 'environment' + suffix;
  var rId = 'resource-1' + suffix;
  var rId2 = 'resource-2' + suffix;
  var rId3 = 'resource-3' + suffix;
  var rId31 = 'son-resource-31' + suffix;
  var rId32 = 'daughter-resource-32' + suffix;
  var rId311 = 'grandson-resource-311' + suffix;
  var mtId = 'cpu.freq' + suffix;
  var mId1 = 'metric.cpu1.freq' + suffix;
  var mId2 = 'metric.cpu2.freq' + suffix;

  var restPromiseResolve = function(promise, done, finallyDo, notFail){
    httpReal.submit();

    promise.then(function(){},
      function(error){
        if (debug) {
          dump('call failed with: ' + JSON.stringify(error));
          notFail && dump('..which was expected');
        }
        done();
        notFail || fail(errorFn(error));
      }).finally(function(){
        debug && dump('..done');
        finallyDo && finallyDo();
        done();
      });
  };

  var restResolve = function(result, done){
    restPromiseResolve(result.$promise, done);
  };

  beforeEach(module('hawkular.services', 'httpReal', function(HawkularInventoryProvider) {
    /** @namespace __karma__.config.hostname */
    HawkularInventoryProvider.setHost(__karma__.config.hostname);
    /** @namespace __karma__.config.port */
    HawkularInventoryProvider.setPort(__karma__.config.port);
  }));

  beforeEach(inject(function(_HawkularInventory_, _$resource_, _httpReal_, _$http_) {
    HawkularInventory = _HawkularInventory_;
    res = _$resource_;
    httpReal = _httpReal_;
    $http = _$http_;

    // it assumes we are running the tests against the hawkular built with -Pdev profile
    // 'amRvZTpwYXNzd29yZA==' ~ jdoe:password in base64
    $http.defaults.headers.common['Authorization'] = 'Basic amRvZTpwYXNzd29yZA==';
  }));

  describe('Resources: ', function() {

    var resolved = false;
    describe('creating a resource', function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var environment = {
          id: eId
        };
        var resourceType = {
          id: typeId
        };
        var resource = {
          id: rId,
          resourceTypePath: '/' + typeId
        };

        var deleteTenant = function() {
          debug && dump('deleting auto-created tenant..');
          return HawkularInventory.Tenant.delete({}).$promise;
        };
        var getTenant = function() {
          debug && dump('retrieving auto-created tenant..');
          return HawkularInventory.Tenant.get({}).$promise;
        };
        var createEnv = function() {
          debug && dump('creating environment..', environment);
          return HawkularInventory.Environment.save({}, environment).$promise;
        };
        var createResourceType = function() {
          debug && dump('creating resource type..', resourceType);
          return HawkularInventory.ResourceType.save({}, resourceType).$promise;
        };
        var createResource = function() {
          debug && dump('creating resource' + rId + '..');
          return HawkularInventory.Resource.save({environmentId: eId}, resource).$promise;
        };
        var err = function(fault) {
          debug && dump('call failed with: ' + JSON.stringify(fault));
          done();
          fail(errorFn(fault));
        };
        var finish = function(){
          resolved = true;
        };

        // result = deleteTenant()
        // .then(getTenant())
        result = getTenant()
        .then(function(tenant) {
          tId = tenant.id;
          createEnv();
        })
        .then(createResourceType)
        .then(createResource)
        .catch(err);
        restPromiseResolve(result, done, finish);
      });

      it('should resolve', function() {
        expect(resolved).toBeTruthy();
      });
    });

    describe('getting a resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        debug && dump('querying resource ' + rId + '..');
        result = HawkularInventory.Resource.query({environmentId: eId});
        restResolve(result, done);
      });
      it('should get previously created resource', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(1);
        expect(result[0].id).toEqual(rId);
      });
    });

    describe('creating another resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var resource = {
          id: rId2,
          resourceTypePath: '/' + typeId
        };
        debug && dump('creating resource ' + rId2 + '..');
        result = HawkularInventory.Resource.save({environmentId: eId}, resource);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('getting a resource list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({environmentId: eId});
        restResolve(result, done);
      });

      it('should get two resources', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(2);
      });
    });

    describe('getting the resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.get({environmentId: eId, resourcePath: rId2});
        restResolve(result, done);
      });

      it('should get only previously created resource', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.id).toEqual(rId2);
      });
    });

    describe('deleting the resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        debug && dump('deleting resource ' + rId2 + '..');
        result = HawkularInventory.Resource.delete({environmentId: eId, resourcePath: rId2});
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('getting a resource list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        debug && dump('getting a resource list');
        result = HawkularInventory.Resource.query({environmentId: eId});
        restResolve(result, done);
      });

      it('should get only a single resource after deleting one', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(1);
      });
    });

    describe('creating yet another resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var resource = {
          id: rId3,
          resourceTypePath: '/' + typeId
        };

        debug && dump('creating resource ' + rId3 + '..');
        result = HawkularInventory.Resource.save({environmentId: eId}, resource);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('hierarchy ->', function() {
      describe('creating a child resource 1', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

        beforeEach(function(done) {
          var resource = {
            id: rId31,
            resourceTypePath: '/' + typeId
          };

          debug && dump('creating child resource 1 - ' + rId31 + '..');
          result = HawkularInventory.Resource.save({environmentId: eId, resourcePath: rId3}, resource);
          restResolve(result, done);
        });

        it('should resolve', function() {
          expect(result.$resolved).toBeTruthy();
        });
      });

      describe('creating a child resource 2', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

        beforeEach(function(done) {
          var resource = {
            id: rId32,
            resourceTypePath: '/' + typeId
          };

          debug && dump('creating child resource 2 - ' + rId32 + '..');
          result = HawkularInventory.Resource.save({environmentId: eId, resourcePath: rId3}, resource);
          restResolve(result, done);
        });

        it('should resolve', function() {
          expect(result.$resolved).toBeTruthy();
        });
      });

      describe('getting the children resources', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

        beforeEach(function(done) {
          debug && dump('getting the children resources of resource ' + rId3 + '..');
          result = HawkularInventory.Resource.getChildren({environmentId: eId, resourcePath: rId3});
          restResolve(result, done);
        });

        it('should resolve', function() {
          expect(result.$resolved).toBeTruthy();
          expect(result.length).toEqual(2);
          expect(result[0].id).toEqual(rId31);
          expect(result[1].id).toEqual(rId32);
        });
      });

      describe('getting the parent resource of top lvl resource', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

        beforeEach(function(done) {
          debug && dump('getting the parent resource of resource ' + rId3 + '..');
          result = HawkularInventory.Resource.getParent({environmentId: eId, resourcePath: rId3});
          var finish = function(){
            resolved = true;
          };
          restPromiseResolve(result.$promise, done, finish, true);
        });

        it('should resolve', function() {
          expect(result.$resolved).toBeTruthy();
        });
      });

      // this doesn't work because of https://github.com/angular/angular.js/issues/1388
      // describe('creating a grand-child resource 1', function() {
      //   var result;
      //   jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      //   beforeEach(function(done) {
      //     var resource = {
      //       id: rId311,
      //       resourceTypePath: '/' + typeId
      //     };

      //     debug && dump('creating grand-child resource 1' + rId311 + '..');
      //     result = HawkularInventory.Resource.save({environmentId: eId, resourcePath: rId3 + '/' + rId31}, resource);
      //     restResolve(result, done);
      //   });

      //   it('should resolve', function() {
      //     expect(result.$resolved).toBeTruthy();
      //   });
      // });

      // same thing as ^ 
      // describe('getting the parent resource', function() {
      //   var result;
      //   jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      //   beforeEach(function(done) {
      //     debug && dump('getting the parent resource of resource' + rId31 + '..');
      //     result = HawkularInventory.Resource.getParent({environmentId: eId, resourcePath: rId3 + '/' + rId31});
      //     restResolve(result, done);
      //   });

      //   it('should resolve', function() {
      //     expect(result.$resolved).toBeTruthy();
      //     expect(result.length).toEqual(1);
      //     expect(result[0].id).toEqual(rId3);
      //     expect(result[0].environmentId).toEqual(eId);
      //   });
      // });

    });

    describe('Data/configs ->', function() {
      var config = {
        value: {
          firstName: 'John',
          lastName: 'Smith',
          hobbies: ['foo', 'bar']
        },
        role: 'configuration'
      };

      describe('creating a new config on a resource', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
        beforeEach(function(done) {
          debug && dump('creating a new config on a resource ' + rId + '..');
          result = HawkularInventory.Resource.createData({environmentId: eId, resourcePath: rId}, config);
          restResolve(result, done);
        });

        it('should resolve', function() {
          expect(result.$resolved).toBeTruthy();
        });
      });

      describe('getting the newly created config on the resource', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
        beforeEach(function(done) {
          debug && dump('getting the newly created config on the resource ' + rId + '..');
          result = HawkularInventory.Resource.getData({environmentId: eId, resourcePath: rId});
          restResolve(result, done);
        });

        it('should be there', function() {
          expect(result.$resolved).toBeTruthy();
          expect(result.value.firstName).toBe('John');
          expect(result.value.lastName).toBe('Smith');
          expect(result.value.hobbies[1]).toBe('bar');
        });
      });

      describe('creating a new JSON schema for resource config on a resource type', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
        beforeEach(function(done) {
          var schema = {
            value: {
              title     : 'Character',
              type      : 'object',
              properties: {
                firstName : {type: 'string'},
                secondName: {type: 'string'},
                age       : {
                  type            : 'integer',
                  minimum         : 0,
                  exclusiveMinimum: false
                },
                male      : {
                  description: 'true if the character is a male',
                  type       : 'boolean'
                },
                foo       : {
                  type      : 'object',
                  properties: {
                    something: {type: 'string'},
                    someArray: {
                      type       : 'array',
                      minItems   : 3,
                      items      : {type: 'integer'},
                      uniqueItems: false
                    },
                    foo      : {
                      type      : 'object',
                      properties: {
                        question: {
                          type   : 'string',
                          pattern: '^.*\\?\$' // ends with '?'
                        },
                        answer  : {
                          description: 'the answer (example of any type)'
                        }
                        // foo     : {
                        //   type      : 'object',
                        //   properties: {
                        //     foo: {
                        //       type      : 'object',
                        //       properties: {
                        //         fear : {
                        //           type: 'string',
                        //           oneOf: [
                        //           {format: 'dentists'},
                        //           {format: 'lawyers'},
                        //           {format: 'rats'}
                        //           ]
                        //         }
                        //       }
                        //     }
                        //   }
                        // }
                      }
                    }
                  }
                }
              },
              required  : ['firstName', 'secondName', 'male', 'age', 'foo']
            },
            role : 'configurationSchema'   
          };
          debug && dump('creating a new JSON schema for resource config on a resource type ' + typeId + '..');
          result = HawkularInventory.ResourceType.createData({resourceTypeId: typeId}, schema);
          restResolve(result, done);
        });

        it('should resolve', function() {
          expect(result.$resolved).toBeTruthy();
        });
      });

      describe('getting the newly created schema on the resource type', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
        beforeEach(function(done) {
          debug && dump('getting the newly created schema on the resource type ' + typeId + '..');
          result = HawkularInventory.ResourceType.getData({resourceTypeId: typeId});
          restResolve(result, done);
        });

        it('should be there', function() {
          expect(result.$resolved).toBeTruthy();
          expect(result.value.properties.age.minimum).toBe(0);
          expect(result.value.required[0]).toBe('firstName');
          expect(result.value.title).toBe('Character');
        });
      });

      describe('deleting the previously created resource config', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
        beforeEach(function(done) {
          debug && dump('deleting the previously created resource config on resource ' + rId + '..');
          result = HawkularInventory.Resource.deleteData({environmentId: eId, resourcePath: rId});
          restResolve(result, done);
        });

        it('should resolve', function() {
          expect(result.$resolved).toBeTruthy();
        });
      });

      describe('creating resource config that is not valid', function() {
        // it was valid before, because there was no JSON schema on the 
        // associated resource type, but now, after we created the schema
        // it should fail
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
        beforeEach(function(done) {
          debug && dump('creating resource config that is not valid..');
          result = HawkularInventory.Resource.createData({environmentId: eId, resourcePath: rId}, config);
          var finish = function(){
            resolved = true;
          };
          restPromiseResolve(result.$promise, done, finish, true);
        });

        it('should fail the JSON schema validation', function() {
          expect(result.$resolved).toBeTruthy();
        });
      });

      describe('creating resource config that is valid', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
        beforeEach(function(done) {
          var validConfig = {
            value     : {
              firstName : 'Winston',
              secondName: 'Smith',
              sdf       : 'sdf',
              male      : true,
              age       : 42,
              foo       : {
                something: 'whatever',
                someArray: [1, 1, 2, 3, 5, 8],
                foo      : {
                  answer  : 5,
                  question: '2+2=?'
                  // foo     : {
                  //   foo: {
                  //     fear: 'rats'
                  //   }
                  // }
                }
              }
            },
            role      : 'configuration',
            properties: {
              war      : 'peace',
              freedom  : 'slavery',
              ignorance: 'strength'
            }
          };
          debug && dump('creating resource config that is valid..');
          result = HawkularInventory.Resource.createData({environmentId: eId, resourcePath: rId}, validConfig);
          restResolve(result, done);
        });

        it('should resolve', function() {
          expect(result.$resolved).toBeTruthy();
        });
      });

      describe('getting the newly created valid config', function() {
        var result;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
        beforeEach(function(done) {
          debug && dump('getting the newly created valid config..');
          result = HawkularInventory.Resource.getData({environmentId: eId, resourcePath: rId});
          restResolve(result, done);
        });

        it('should be there', function() {
          expect(result.$resolved).toBeTruthy();
          expect(result.value.firstName).toBe('Winston');
          expect(result.value.age).toBe(42);
          expect(result.value.foo.foo.answer).toBe(5);
        });
      });

    }); // data/config

  });

  describe('Metrics: ', function() {

    describe('creating a metric', function() {
      var resolved = false;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var metricType = {
          id: mtId,
          unit: 'SECONDS',
          type: 'GAUGE'
        };
        var metric = {
          id: mId1,
          metricTypePath: '../' + mtId
        };

        var createMetricType = function() {
          debug && dump('creating metric type ' + mtId + '..');
          return HawkularInventory.MetricType.save({}, metricType).$promise;
        };
        var createMetric = function() {
          debug && dump('creating metric ' + mId1 + '..');
          return HawkularInventory.Metric.save({environmentId: eId}, metric).$promise;
        };
        var associateMetric = function() {
          debug && dump('associating metric ' + mId1 + ' with resource ' + rId3 + '..');
          return HawkularInventory.MetricOfResource.save({environmentId: eId, resourcePath: rId3}, ['../' + mId1]).$promise;
        };
        var err = function(fault) {
          debug && dump('call failed with: ' + JSON.stringify(fault));
          done();
          fail(errorFn(fault));
        };
        var finish = function() {
          resolved = true;
        };

        var result = createMetricType().then(createMetric).then(associateMetric).catch(err);
        restPromiseResolve(result, done, finish);
      });

      it('should resolve', function() {
        expect(resolved).toBeTruthy();
      });
    });

    describe('getting a metric on resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.MetricOfResource.query({environmentId: eId, resourcePath: rId3});
        restResolve(result, done);
      });

      it('should be there', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(1);
        expect(result[0].id).toEqual(mId1);
      });
    });

    describe('getting a metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Metric.get({environmentId: eId, metricId: mId1});
        restResolve(result, done);
      });

      it('should get previously created metric', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.id).toEqual(mId1);
        expect(result.type.unit).toEqual('SECONDS');
      });
    });

    describe('creating a second metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var metric = {
          id: mId2,
          metricTypePath: '../' + mtId
        };
        debug && dump('creating second metric ' + mId2 + '..');
        result = HawkularInventory.Metric.save({environmentId: eId}, metric);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('getting a metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Metric.get({environmentId: eId, metricId: mId2});
        restResolve(result, done);
      });

      it('should get the newly created metric', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.id).toEqual(mId2);
        expect(result.type).toBeDefined();
        expect(result.type.unit).toEqual('SECONDS');
      });
    });
  });

  describe('Tenants/Environments: ', function() {

    describe('creating an environment', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var environment = {
          id: eId + 2
        };
        debug && dump('creating environment ' + eId + 2 + '..');
        result = HawkularInventory.Environment.save({}, environment);
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('after creating new environment', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        debug && dump('getting environment ' + eId + 2 + '..');
        result = HawkularInventory.Environment.get({environmentId: eId + 2});
        restResolve(result, done);
      });

      it('it should be queryable', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.id).toEqual(eId + 2);
      });
    });

    describe('deleting an environment', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        debug && dump('deleting environment ' + eId + '..');
        result = HawkularInventory.Environment.delete({environmentId: eId});
        restResolve(result, done);
      });

      it('should resolve', function() {
        expect(result.$resolved).toBeTruthy();
      });
    });

    describe('after deleting one environment', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Environment.query({environmentId: eId});
        var finish = function(){
          resolved = true;
        };
        restPromiseResolve(result.$promise, done, finish, true);
      });

      it('it should not be there', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(0);
      });
    });

    describe('after deleting an environment', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularInventory.Resource.query({environmentId: eId});
        restResolve(result, done);
      });

      it('there should be no resources in it', function() {
        expect(result.$resolved).toBeTruthy();
        expect(result.length).toEqual(0);
      });
    });

    // describe('deleting tenant', function() {
    //   // delete everything with the tenant to make the test suite repeatable
    //   var result;
    //   jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    //   beforeEach(function(done) {
    //     debug && dump('deleting tenant ' + tId + '..');
    //     result = HawkularInventory.Tenant.delete({});
    //     restResolve(result, done);
    //   });

    //   it('should resolve', function() {
    //     expect(result.$resolved).toBeTruthy();
    //   });
    // });

    // describe('after deleting the tenant', function() {
    //   var result;
    //   jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    //   beforeEach(function(done) {
    //     result = HawkularInventory.Environment.query({});
    //     restResolve(result, done);
    //   });

    //   it('there should be one predefined environment in the auto-created tenant', function() {
    //     expect(result.$resolved).toBeTruthy();
    //     expect(result.length).toEqual(1);
    //   });
    // });

    // describe('after deleting the tenant', function() {
    //   var result;
    //   jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    //   beforeEach(function(done) {
    //     result = HawkularInventory.Resource.query({environmentId: eId});
    //     restResolve(result, done);
    //   });

    //   it('there should be no resources in it', function() {
    //     expect(result.$resolved).toBeTruthy();
    //     expect(result.length).toEqual(0);
    //   });
    // });

  });
});
