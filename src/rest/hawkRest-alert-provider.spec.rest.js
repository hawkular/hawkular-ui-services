describe('Provider: Hawkular Alerts live REST =>', function() {

  var HawkularAlert;
  var res;
  var httpReal;
  var $http;
  var $q;

  var debug = true;

  beforeEach(module('hawkular.services', 'httpReal', function(HawkularAlertProvider) {

    HawkularAlertProvider.setHost(__karma__.config.hostname);
    HawkularAlertProvider.setPort(__karma__.config.port);

  }));

  beforeEach(inject(function(_HawkularAlert_, _$resource_, _httpReal_, _$http_, _$q_) {
    HawkularAlert = _HawkularAlert_;
    res = _$resource_;
    httpReal = _httpReal_;
    $http = _$http_;
    $q = _$q_;

    // it assumes we are running the tests against the hawkular built with -Pdev profile
    // 'amRvZTpwYXNzd29yZA==' ~ jdoe:password in base64
    $http.defaults.headers.common['Authorization'] = 'Basic amRvZTpwYXNzd29yZA==';
  }));

  describe('Create a Garbage Collection Alert definition', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var newTrigger = {
      id: 'thevault~local-jvm-garbage-collection-trigger',
      name: 'JVM Garbage Collection for thevault~Local',
      autoResolve: true,
      autoResolveAlerts: true,
      context: {
        resourceType: 'App Server',
        resourceName: 'thevault~Local'
      }
    };

    var newDampening = {
      triggerId: newTrigger.id,
      triggerMode: 'FIRING',
      type: 'STRICT',
      evalTrueSetting: 1,
      evalTotalSetting: 1,
      evalTimeSetting: 0
    };

    var newFiringConditions = [
      {
        triggerId: newTrigger.id,
        triggerMode: 'FIRING',
        type: 'THRESHOLD',
        dataId: 'thevault~local-jvm-garbage-collection-data-id',
        operator: 'GT',
        threshold: 1000,
        context: {
          description: 'GC Duration',
          unit: 'ms'
        }
      }
    ];

    var newAutoResolveConditions = [
      {
        triggerId: newTrigger.id,
        triggerMode: 'AUTORESOLVE',
        type: 'THRESHOLD',
        dataId: 'thevault~local-jvm-garbage-collection-data-id',
        operator: 'LTE',
        threshold: 1000,
        context: {
          description: 'GC Duration',
          unit: 'ms'
        }
      }
    ];

    var created;

    beforeEach(function(done) {

      // Delete previous test data
      HawkularAlert.Trigger.delete({triggerId: newTrigger.id}).$promise.finally(function() {

           HawkularAlert.Trigger.save(newTrigger).$promise.then(
             // Success Trigger save
             function(trigger) {
               debug && dump(JSON.stringify(trigger));
               return HawkularAlert.Dampening.save({triggerId: trigger.id},
                 newDampening).$promise;
             },
             // Error Trigger save
             function(errorTrigger) {
               errorFn(errorTrigger);
               return $q.reject('Error on Trigger save');
             }
           ).then(
              // Success Dampening save
              function(dampening) {
                debug && dump(JSON.stringify(dampening));
                return HawkularAlert.Conditions.save({triggerId: newTrigger.id,
                  triggerMode: 'FIRING'},
                  newFiringConditions).$promise;
              },
             // Error Dampening save
             function (errorDampening) {
               errorFn(errorDampening);
               return $q.reject('Error on Dampening save');
             }
           ).then(
              // Success Firing Conditions save
             function(firingConditions) {
               debug && dump(JSON.stringify(firingConditions));
               return HawkularAlert.Conditions.save({triggerId: newTrigger.id,
                triggerMode: 'AUTORESOLVE'},
                newAutoResolveConditions).$promise;
             },
             // Error Firing Conditions save
             function(errorFiringConditions) {
               errorFn(errorFiringConditions);
             }
           ).then(
              // Success AutoResolve Conditions save
             function(autoResolveConditions) {
               debug && dump(JSON.stringify(autoResolveConditions));
              created = autoResolveConditions;
             },
             // Error AutoResolve Conditions save
             function(errorAutoResolveConditions) {
               errorFn(errorAutoResolveConditions);
             }
           ).finally(function() {
               done();
           });

      });

      httpReal.submit();
    });

    it('should create a trigger correctly', function() {
      // We test last step create correctly AUTORESOLVE conditions
      expect(created.length).toEqual(newAutoResolveConditions.length);
    });

  });

  describe('Create a JVM Alert definition with multiple conditions', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var newTrigger = {
      id: 'thevault~local-web-multiple-jvm-metrics-trigger',
      name: 'Multiple JVM Metrics for thevault~Local',
      autoResolve: true,
      autoResolveAlerts: true,
      context: {
        resourceType: 'App Server',
        resourceName: 'thevault~Local',
        category: 'JVM'
      }
    };

    var newDampening = {
      triggerId: newTrigger.id,
      triggerMode: 'FIRING',
      type: 'STRICT_TIME',
      evalTrueSetting: 0,
      evalTotalSetting: 0,
      evalTimeSetting: 10000
    };

    var newFiringConditions = [
      {
        triggerId: newTrigger.id,
        triggerMode: 'FIRING',
        conditionSetSize: 3,
        conditionSetIndex: 1,
        type: 'THRESHOLD',
        dataId: 'thevault~local-jvm-garbage-collection-data-id',
        operator: 'GT',
        threshold: 1000,
        context: {
          description: 'GC Duration',
          unit: 'ms'
        }
      },
      {
        triggerId: newTrigger.id,
        triggerMode: 'FIRING',
        conditionSetSize: 3,
        conditionSetIndex: 2,
        type: 'RANGE',
        dataId: 'thevault~local-jvm-heap-usage-data-id',
        operatorLow: 'INCLUSIVE',
        operatorHigh: 'INCLUSIVE',
        thresholdLow: 100,
        thresholdHigh: 300,
        inRange: true,
        context: {
          description: 'Heap Usage',
          unit: 'Mb'
        }
      },
      {
        triggerId: newTrigger.id,
        triggerMode: 'FIRING',
        conditionSetSize: 3,
        conditionSetIndex: 3,
        type: 'RANGE',
        dataId: 'thevault~local-jvm-non-heap-usage-data-id',
        operatorLow: 'INCLUSIVE',
        operatorHigh: 'INCLUSIVE',
        thresholdLow: 100,
        thresholdHigh: 200,
        inRange: true,
        context: {
          description: 'Non Heap Usage',
          unit: 'Mb'
        }
      }
    ];

    var newAutoResolveConditions = [
      {
        triggerId: newTrigger.id,
        triggerMode: 'AUTORESOLVE',
        conditionSetSize: 3,
        conditionSetIndex: 1,
        type: 'THRESHOLD',
        dataId: 'thevault~local-jvm-garbage-collection-data-id',
        operator: 'LTE',
        threshold: 1000,
        context: {
          description: 'GC Duration',
          unit: 'ms'
        }
      },
      {
        triggerId: newTrigger.id,
        triggerMode: 'AUTORESOLVE',
        conditionSetSize: 3,
        conditionSetIndex: 2,
        type: 'RANGE',
        dataId: 'thevault~local-jvm-heap-usage-data-id',
        operatorLow: 'EXCLUSIVE',
        operatorHigh: 'EXCLUSIVE',
        thresholdLow: 100,
        thresholdHigh: 300,
        inRange: false,
        context: {
          description: 'Heap Usage',
          unit: 'Mb'
        }
      },
      {
        triggerId: newTrigger.id,
        triggerMode: 'AUTORESOLVE',
        conditionSetSize: 3,
        conditionSetIndex: 3,
        type: 'RANGE',
        dataId: 'thevault~local-jvm-non-heap-usage-data-id',
        operatorLow: 'EXCLUSIVE',
        operatorHigh: 'EXCLUSIVE',
        thresholdLow: 100,
        thresholdHigh: 200,
        inRange: false,
        context: {
          description: 'Non Heap Usage',
          unit: 'Mb'
        }
      }
    ];

    var created;

    beforeEach(function(done) {

      // Delete previous test data
      HawkularAlert.Trigger.delete({triggerId: newTrigger.id}).$promise.finally(function() {

        HawkularAlert.Trigger.save(newTrigger).$promise.then(
          // Success Trigger save
          function(trigger) {
            debug && dump(JSON.stringify(trigger));
            return HawkularAlert.Dampening.save({triggerId: trigger.id},
              newDampening).$promise;
          },
          // Error Trigger save
          function(errorTrigger) {
            debug && dump(errorFn(errorTrigger));
            return $q.reject('Error on Trigger save');
          }
        ).then(
          // Success Dampening save
          function(dampening) {
            debug && dump(JSON.stringify(dampening));
            return HawkularAlert.Conditions.save({triggerId: newTrigger.id,
                triggerMode: 'FIRING'},
              newFiringConditions).$promise;
          },
          // Error Dampening save
          function (errorDampening) {
            debug && dump(errorFn(errorDampening));
            return $q.reject('Error on Dampening save');
          }
        ).then(
          // Success Firing Conditions save
          function(firingConditions) {
            debug && dump(JSON.stringify(firingConditions));
            return HawkularAlert.Conditions.save({triggerId: newTrigger.id,
                triggerMode: 'AUTORESOLVE'},
              newAutoResolveConditions).$promise;
          },
          // Error Firing Conditions save
          function(errorFiringConditions) {
            debug && dump(errorFn(errorFiringConditions));
          }
        ).then(
          // Success AutoResolve Conditions save
          function(autoResolveConditions) {
            debug && dump(JSON.stringify(autoResolveConditions));
            created = autoResolveConditions;
          },
          // Error AutoResolve Conditions save
          function(errorAutoResolveConditions) {
            debug && dump(errorFn(errorAutoResolveConditions));
          }
        ).finally(function() {
            done();
          });

      });

      httpReal.submit();
    });

    it('should create a trigger correctly', function() {
      // We test last step create correctly AUTORESOLVE conditions
      expect(created.length).toEqual(newAutoResolveConditions.length);
    });

  });

  describe('Modify an existing definition adding conditions', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var updateTriggerId = 'thevault~local-web-multiple-jvm-metrics-trigger';

    var updateFiringConditions = [
      {
        triggerId: updateTriggerId,
        triggerMode: 'FIRING',
        conditionSetSize: 7,
        conditionSetIndex: 1,
        type: 'THRESHOLD',
        dataId: 'thevault~local-jvm-garbage-collection-data-id',
        operator: 'GT',
        threshold: 1000,
        context: {
          description: 'GC Duration',
          unit: 'ms'
        }
      },
      {
        triggerId: updateTriggerId,
        triggerMode: 'FIRING',
        conditionSetSize: 7,
        conditionSetIndex: 2,
        type: 'RANGE',
        dataId: 'thevault~local-jvm-heap-usage-data-id',
        operatorLow: 'INCLUSIVE',
        operatorHigh: 'INCLUSIVE',
        thresholdLow: 100,
        thresholdHigh: 300,
        inRange: true,
        context: {
          description: 'Heap Usage',
          unit: 'Mb'
        }
      },
      {
        triggerId: updateTriggerId,
        triggerMode: 'FIRING',
        conditionSetSize: 7,
        conditionSetIndex: 3,
        type: 'RANGE',
        dataId: 'thevault~local-jvm-non-heap-usage-data-id',
        operatorLow: 'INCLUSIVE',
        operatorHigh: 'INCLUSIVE',
        thresholdLow: 100,
        thresholdHigh: 200,
        inRange: true,
        context: {
          description: 'Non Heap Usage',
          unit: 'Mb'
        }
      },
      {
        triggerId: updateTriggerId,
        triggerMode: 'FIRING',
        conditionSetSize: 7,
        conditionSetIndex: 4,
        type: 'AVAILABILITY',
        dataId: 'thevault~local-test-availability-data-id',
        operator: 'DOWN',
        context: {
          description: 'Availability'
        }
      },
      {
        triggerId: updateTriggerId,
        triggerMode: 'FIRING',
        conditionSetSize: 7,
        conditionSetIndex: 5,
        type: 'COMPARE',
        dataId: 'thevault~local-test-compare-data-id',
        operator: 'LTE',
        dataId2: 'thevault~local-test-compare-data-id-2',
        data2Multiplier: 0.5,
        context: {
          description: 'Heap',
          description2: 'Non Heap'
        }
      },
      {
        triggerId: updateTriggerId,
        triggerMode: 'FIRING',
        conditionSetSize: 7,
        conditionSetIndex: 6,
        type: 'EXTERNAL',
        systemId: 'TestSystemId',
        dataId: 'thevault~local-test-external-data-id',
        expression: 'TestExpression'
      },
      {
        triggerId: updateTriggerId,
        triggerMode: 'FIRING',
        conditionSetSize: 7,
        conditionSetIndex: 7,
        type: 'STRING',
        dataId: 'thevault~local-test-string-data-id',
        operator: 'STARTS_WITH',
        pattern: 'www.',
        ignoreCase: false,
        context: {
          description: 'URL'
        }
      }
    ];

    var updatedConditions;

    beforeEach(function(done) {
      HawkularAlert.Conditions.save({triggerId: updateTriggerId,
        triggerMode: 'FIRING'}, updateFiringConditions).$promise.then(
          // Successful Conditions save
          function(firingConditions) {
            debug && dump(JSON.stringify(firingConditions));
            updatedConditions = firingConditions;
          },
          // Error Conditions save
        function(errorFiringConditions) {
          debug && dump(errorFn(errorFiringConditions));
        }
      ).finally(function() {
          done();
      });

      httpReal.submit();
    });

    it('should update conditions correctly', function() {
      // We test last step create correctly AUTORESOLVE conditions
      expect(updatedConditions.length).toEqual(updateFiringConditions.length);
    });

  });

  describe('Retrieve an existing definition', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var existingTriggerId = 'thevault~local-web-multiple-jvm-metrics-trigger';

    var resultTrigger = [];

    beforeEach(function(done) {
      HawkularAlert.Trigger.get({triggerId: existingTriggerId}).$promise.then(
        // Successful Trigger get
        function(trigger) {
          debug && dump(JSON.stringify(trigger));
          resultTrigger['trigger'] = trigger;
          return HawkularAlert.Dampening.query({triggerId: existingTriggerId}).$promise;
        },
        // Error Trigger get
        function(errorTrigger) {
          debug && dump(errorFn(errorTrigger));
          return $q.reject('Error on Trigger query');
        }
      ).then(
        // Successful Dampening query
        function(dampenings) {
          debug && dump(JSON.stringify(dampenings));
          resultTrigger['dampenings'] = dampenings;
          return HawkularAlert.Conditions.query({triggerId: existingTriggerId}).$promise;
        },
        // Error Dampening query
        function(errorDampenings) {
          debug && dump(errorFn(errorDampenings));
          return $q.reject('Error on Dampening query');
        }
      ).then(
        // Successful Conditions query
        function(conditions) {
          debug && dump(JSON.stringify(conditions));
          resultTrigger['conditions'] = conditions;
        },
        // Error Conditions query
        function(errorConditions) {
          debug && dump(errorFn(errorConditions));
        }
      ).finally(function() {
        done();
      });

      httpReal.submit();
    });

    it('should retrieve full trigger correctly', function() {
      expect(resultTrigger['trigger'].id).toEqual(existingTriggerId);
      expect(resultTrigger['dampenings'].length).toEqual(1);
      expect(resultTrigger['conditions'].length).toEqual(10);
    });

  });

  // Perform alert tests before the action tests because we don't really want to deal with e-mail
  describe('Enable Trigger and Generate an Alert', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var triggerId = 'thevault~local-jvm-garbage-collection-trigger';
    var dataId    = 'thevault~local-jvm-garbage-collection-data-id';

    var mixedData = {
            numericData : [
              {
                id: dataId,
                timestamp: 1,
                value: 5000
              }
            ]
          };

    beforeEach(function(done) {

      // Delete previous test data
      HawkularAlert.Alert.delete({triggerIds: triggerId}).$promise.finally(function() {

        HawkularAlert.Trigger.get({triggerId: triggerId}).$promise.then(
          // Successful Trigger get
          function(trigger) {
            debug && dump(JSON.stringify(trigger));
            trigger.enabled = true;
            return HawkularAlert.Trigger.put({triggerId: triggerId}, trigger).$promise;
          },
          // Error Trigger get
          function(errorTrigger) {
            debug && dump(errorFn(errorTrigger));
            return $q.reject('Error on Trigger query');
          }
        ).then(
          // Successful Trigger enable (update)
          function() {
            return HawkularAlert.Alert.send(mixedData).$promise;
          },
          // Error Trigger enable
          function(errorUpdate) {
            errorFn(errorUpdate);
            return $q.reject('Error on Trigger Update');
          }
        ).then(
          // Successful data send
          function() {
              // nothing to do
          },
          // Error data send
          function(errorSend) {
            errorFn(errorSend);
            return $q.reject('Error on Data Send');
          }
        ).finally(function() {
          done();
        });
      });

      httpReal.submit();
    });

    it('should retrieve full trigger correctly', function() {
      // nothing to doc
      });

  });

  describe('Fetch an Alert', function() {

      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      var triggerId = 'thevault~local-jvm-garbage-collection-trigger';
      var alert;

      beforeEach(function(done) {

          console.log("Pausing 5s for alert generation...");
          var now = Date.now();
          var step = now;
          var then = now + 5000;
          while ( now < then ) {
              now = Date.now();
              if (( now - step ) > 1000 ) {
                  //console.log("now=" + now + ", then=" + then);
                  step = now;
              }
          }
          console.log("Continuing...");

          HawkularAlert.Alert.query({thin:true, triggerIds:triggerId}).$promise.then(
            // Success, fetch
            function(alerts) {
              debug && dump(JSON.stringify(alerts));
              if ( alerts.length != 1 ) {
                  return $q.reject('Alert not found');
              }
              var alert = alerts[0];
              return HawkularAlert.Alert.get({alertId:alert.alertId}).$promise;
            },
            // Error, fetch
            function (errorFetch) {
              errorFn(errorfetch);
              return $q.reject('Error on Alert Fetch');
            }
          ).then(
            // Success, get
            function(singleAlert) {
              debug && dump(JSON.stringify(singleAlert));
              if ( null == singleAlert ) {
                return $q.reject('Alert not found');
              }
              alert = singleAlert;
            },
            // Error, get
            function (errorFetch) {
              errorFn(errorFetch);
              return $q.reject('Error on Alert Get');
            }
          ).finally(function() {
            done();
          });

          httpReal.submit();
      });

      it ('should get list of single alert', function() {
        expect(alert.status).toEqual('OPEN');
      });

    });

  describe('Ack an Alert', function() {

      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      var triggerId = 'thevault~local-jvm-garbage-collection-trigger';
      var alert;

      beforeEach(function(done) {

          HawkularAlert.Alert.query({thin:true, triggerIds:triggerId}).$promise.then(
            // Success, fetch open
            function(alerts) {
              debug && dump(JSON.stringify(alerts));
              if ( alerts.length != 1 ) {
                  return $q.reject('Alert not found');
              }
              alert = alerts[0];
              if ( alert.status != 'OPEN' ) {
                  return $q.reject('Should be Open');
              }
              return HawkularAlert.Alert.ack({alertId:alert.alertId,ackBy:'ackBy',ackNotes:'ackNotes'},null).$promise;
            },
            // Error, fetch open
            function (errorFetch) {
              errorFn(errorfetch);
              return $q.reject('Error on OPEN Alert Fetch');
            }
          ).then(
            // Successful Ack
            function() {
              return HawkularAlert.Alert.query({thin:true, triggerIds:triggerId, statuses:'ACKNOWLEDGED'}).$promise;
            },
            // Error ack
            function(errorAck) {
              errorFn(errorAck);
              return $q.reject('Error on ACK');
            }
          ).then(
            // Success, fetch ack
            function(alerts) {
              debug && dump(JSON.stringify(alerts));
              if ( alerts.length != 1 ) {
                return $q.reject('Ack Alert not found');
              }
              alert = alerts[0];
              if ( alert.status != 'ACKNOWLEDGED' ) {
                  return $q.reject('Should be Open');
              }
              // try the ackmany endpoint
              return HawkularAlert.Alert.ackmany(
                      {alertIds:alert.alertId,ackBy:'ackBy',ackNotes:'ackNotes'},null).$promise;
            },
            // Error, fetch ack
            function (errorFetch) {
              errorFn(errorFetch);
              return $q.reject('Error on ACK Alert Fetch');
            }
          ).then(
            // Successful Ackmany
            function() {
              return HawkularAlert.Alert.query({thin:true, triggerIds:triggerId, statuses:'ACKNOWLEDGED'}).$promise;
            },
            // Error ackmany
            function(errorAckmany) {
              errorFn(errorAckmany);
              return $q.reject('Error on ACK many');
            }
          ).then(
            // Success, fetch ack
            function(alerts) {
              debug && dump(JSON.stringify(alerts));
              if ( alerts.length != 1 ) {
                return $q.reject('Ack Alert not found');
              }
              alert = alerts[0];
            },
            // Error, fetch ack
            function (errorFetch) {
              errorFn(errorFetch);
              return $q.reject('Error on ACK Alert Fetch');
            }
          ).finally(function() {
            done();
          });

          httpReal.submit();
      });

      it ('should get acknowledged alert', function() {
        expect(alert.status).toEqual('ACKNOWLEDGED');
        expect(alert.ackBy).toEqual('ackBy');
        expect(alert.ackNotes).toEqual('ackNotes');
      });

    });

  describe('Resolve an Alert', function() {

      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      var triggerId = 'thevault~local-jvm-garbage-collection-trigger';
      var alert;

      beforeEach(function(done) {

          HawkularAlert.Alert.query({thin:true, triggerIds:triggerId, statuses:'ACKNOWLEDGED'}).$promise.then(
            // Success, fetch ack
            function(alerts) {
              debug && dump(JSON.stringify(alerts));
              if ( alerts.length != 1 ) {
                  return $q.reject('Alert not found');
              }
              alert = alerts[0];
              if ( alert.status != 'ACKNOWLEDGED' ) {
                  return $q.reject('Should be Ackd');
              }
              return HawkularAlert.Alert.resolve(
                      {alertId:alert.alertId,resolvedBy:'resolvedBy',resolvedNotes:'resolvedNotes'},null).$promise;
            },
            // Error, fetch open
            function (errorFetch) {
              errorFn(errorfetch);
              return $q.reject('Error on ACK Alert Fetch');
            }
          ).then(
            // Successful Resolve
            function() {
              return HawkularAlert.Alert.query({thin:true, triggerIds:triggerId, statuses:'RESOLVED'}).$promise;
            },
            // Error resolve
            function(errorResolve) {
              errorFn(errorResolve);
              return $q.reject('Error on RESOLVE');
            }
          ).then(
            // Success, fetch resolve
            function(alerts) {
              debug && dump(JSON.stringify(alerts));
              if ( alerts.length != 1 ) {
                return $q.reject('Resolved Alert not found');
              }
              alert = alerts[0];
              if ( alert.status != 'RESOLVED' ) {
                  return $q.reject('Should be Open');
              }
              // try the resolvemany endpoint
              return HawkularAlert.Alert.resolvemany(
                      {alertIds:alert.alertId,resolvedBy:'resolvedBy',resolvedNotes:'resolvedNotes'},null).$promise;
            },
            // Error, fetch resolve
            function (errorFetch) {
              errorFn(errorFetch);
              return $q.reject('Error on RESOLVED Alert Fetch');
            }
          ).then(
            // Successful resolvemany
            function() {
              return HawkularAlert.Alert.query({thin:true, triggerIds:triggerId, statuses:'RESOLVED'}).$promise;
            },
            // Error resolvemany
            function(errorResolvemany) {
              errorFn(errorResolvemany);
              return $q.reject('Error on RESOLVE many');
            }
          ).then(
            // Success, fetch resolve
            function(alerts) {
              debug && dump(JSON.stringify(alerts));
              if ( alerts.length != 1 ) {
                return $q.reject('Resolved Alert not found');
              }
              alert = alerts[0];
            },
            // Error, fetch resolve
            function (errorFetch) {
              errorFn(errorFetch);
              return $q.reject('Error on Resolved Alert Fetch');
            }
          ).finally(function() {
            done();
          });

          httpReal.submit();
      });

      it ('should get resolved alert', function() {
        expect(alert.status).toEqual('RESOLVED');
        expect(alert.resolvedBy).toEqual('resolvedBy');
        expect(alert.resolvedNotes).toEqual('resolvedNotes');
      });

    });

  describe('Get a list of ActionPlugins', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var resultPlugins;

    beforeEach(function(done) {

      HawkularAlert.ActionPlugin.query().$promise.then(
        // Successful ActionPlugin query
        function(plugins) {
          debug && dump(JSON.stringify(plugins));
          resultPlugins = plugins;
        },
        // Error ActionPlugin query
        function(errorPlugins) {
          debug && dump(errorFn(errorPlugins));
        }
      ).finally(function() {
          done();
      });

      httpReal.submit();
    });

    it ('should get more than one action plugin', function() {
      expect(resultPlugins.length).toBeGreaterThan(0);
    });

  });


  describe('Get a specific ActionPlugin', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var resultPlugin;

    beforeEach(function(done) {
      HawkularAlert.ActionPlugin.get({actionPlugin : 'email'}).$promise.then(
        // Succesful ActionPlugin get
        function(plugin) {
          debug && dump(JSON.stringify(plugin));
          resultPlugin = plugin;
        },
        // Error ActionPlugin get
        function(errorPlugin) {
          debug && dump(errorFn(errorPlugin));
        }
      ).finally(function() {
        done();
      });

      httpReal.submit();
    });

    it ('should get ActionPlugin properties', function() {
      expect(resultPlugin.length).toBeGreaterThan(0);
    });

  });

  describe('Create an email action', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var newAction = {
      actionPlugin: 'email',
      actionId: 'email-to-test-sysadmins-group',
      to: 'test-sysadmins@test-organization.org',
      cc: 'developers@test-organization.org',
      'cc.resolved': 'cio@test-organization.org'
    };

    var resultAction;

    beforeEach(function(done) {

      // Delete previous test data
      HawkularAlert.Action.delete({pluginId: newAction.actionPlugin,
        actionId: newAction.actionId}).$promise.finally(function() {

        HawkularAlert.Action.save(newAction).$promise.then(
          // Succesful Action save
          function(action) {
            debug && dump(JSON.stringify(action));
            resultAction = action;
          },
          // Error Action save
          function(errorAction) {
            debug && dump(errorFn(errorAction));
          }
        ).finally(function() {
          done();
        });
      });

      httpReal.submit();
    });

    it ('should create an Action', function() {
      expect(resultAction.actionId).toEqual(newAction.actionId);
    });

  });

  describe('Update an existing action', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var updateAction = {
      actionPlugin: 'email',
      actionId: 'email-to-test-sysadmins-group',
      to: 'test-sysadmins@test-organization.org',
      cc: 'developers@test-organization.org',
      'cc.resolved': 'cio-updated@test-organization.org'
    };

    var resultAction;

    beforeEach(function(done) {

      HawkularAlert.Action.put({pluginId: updateAction.actionPlugin,
        actionId: updateAction.actionId}, updateAction).$promise.then(
        // Successful Action put
        function(action) {
          debug && dump(JSON.stringify(action));
          resultAction = action;
        },
        // Error Action put
        function(errorAction) {
          debug && dump(errorFn(errorAction));
        }
      ).finally(function() {
          done();
      });

      httpReal.submit();
    });

    it ('should update an Action', function() {
      expect(resultAction['cc.resolved']).toEqual(updateAction['cc.resolved']);
    });

  });

  describe('Get an updated action', function() {

    var pluginId = 'email';
    var actionId = 'email-to-test-sysadmins-group';

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var resultAction;

    beforeEach(function(done) {
      HawkularAlert.Action.get({pluginId: pluginId, actionId: actionId}).$promise.then(
        // Sucessful Action get
        function(action) {
          debug && dump(JSON.stringify(action));
          resultAction = action;
        },
        // Error Action get
        function(errorAction) {
          debug && dump(errorFn(errorAction));
        }
      ).finally(function() {
          done();
      });

      httpReal.submit();
    });

    it ('should get previously created action', function() {
      expect(resultAction.actionId).toEqual(actionId);
      expect(resultAction.actionPlugin).toEqual(pluginId);
    });
  });

  describe('Get a list of actions by plugin', function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

    var resultActionsId;

    beforeEach(function(done) {
      result = HawkularAlert.Action.plugin({actionPlugin: 'email'}).$promise.then(
        // Successful Action plugin
        function(actionsId) {
          debug && dump(JSON.stringify(actionsId));
          resultActionsId = actionsId;
        },
        // Error Action plugin
        function(errorActionsId) {
          debug && dump(errorFn(errorActionsId));
        }
      ).finally(function() {
          done();
      });


      httpReal.submit();
    });

    it ('should get list of actions of email plugin', function() {
      expect(resultActionsId.length).toBeGreaterThan(0);
    });
  });

  });
