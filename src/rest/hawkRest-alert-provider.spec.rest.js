describe('Provider: Hawkular Alerts live REST', function() {

  var HawkularAlert;
  var res;
  var httpReal;
  var $http;

  var restResolve = function(result, done){
    httpReal.submit();

    result.$promise.then(function(){
    }, function(error){
      fail(errorFn(error));
    }).finally(function(){
      done();
    });
  };

  beforeEach(module('hawkular.services', 'httpReal'));

  beforeEach(inject(function(_HawkularAlert_, _$resource_, _httpReal_, _$http_) {
    HawkularAlert = _HawkularAlert_;
    res = _$resource_;
    httpReal = _httpReal_;
    $http = _$http_;
  }));


  describe('Alerts:', function() {

    describe('get list of alerts', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Alert.query();
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });

    });

    describe('invoke a reload operation', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Alert.reload();
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });

    });

  });

  describe('Definitions - Triggers: ', function() {

    describe('creating a trigger definition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var trigger = {
          id: 'test-rest-trigger-200',
          name: 'No-Metric-Name'
        };
        result = HawkularAlert.Trigger.save(trigger);
        restResolve(result, done);
      });

      it ('should resolve and return created trigger', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.id).toEqual('test-rest-trigger-200');
        expect(result.name).toEqual('No-Metric-Name');
      });
    });

    var triggerToUpdate;

    describe('get an existing trigger definition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Trigger.get({triggerId: 'test-rest-trigger-200'});
        restResolve(result, done);
      });

      it ('should get previously created trigger', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.id).toEqual('test-rest-trigger-200');
        expect(result.name).toEqual('No-Metric-Name');

        triggerToUpdate = result;
      });
    });

    describe('update an existing trigger', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        triggerToUpdate.name = 'No-Metric-Name-Modified';
        result = HawkularAlert.Trigger.put({triggerId: triggerToUpdate.id}, triggerToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('get an updated trigger', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Trigger.get({triggerId: 'test-rest-trigger-200'});
        restResolve(result, done);
      });

      it ('should get previously created trigger', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.id).toEqual('test-rest-trigger-200');
        expect(result.name).toEqual('No-Metric-Name-Modified');
      });
    });

    describe('get a trigger list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Trigger.query();
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('delete a trigger definition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Trigger.delete({triggerId: 'test-rest-trigger-200'});
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });

  describe('Definitions - Dampenings:' , function() {

    describe('creating a dampening definition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var dampening = {
          triggerId: 'test-rest-trigger-100',
          type: 'RELAXED_TIME',
          evalTrueSetting: 1,
          evalTotalSetting: 1,
          evalTimeSetting: 100
        };
        result = HawkularAlert.Dampening.save(dampening);
        restResolve(result, done);
      });

      it ('should resolve and return created dampening', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual('test-rest-trigger-100');
        expect(result.type).toEqual('RELAXED_TIME');
        expect(result.evalTimeSetting).toEqual(100);
      });
    });

    var dampeningToUpdate;

    describe('get an existing dampening definition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Dampening.get({triggerId: 'test-rest-trigger-100'});
        restResolve(result, done);
      });

      it ('should get previously created dampening', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual('test-rest-trigger-100');
        expect(result.type).toEqual('RELAXED_TIME');
        expect(result.evalTimeSetting).toEqual(100);

        dampeningToUpdate = result;
      });
    });

    describe('update an existing dampening', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        dampeningToUpdate.type = 'STRICT_TIME';
        result = HawkularAlert.Dampening.put({triggerId: dampeningToUpdate.triggerId}, dampeningToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('get an updated dampening', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Dampening.get({triggerId: 'test-rest-trigger-100'});
        restResolve(result, done);
      });

      it ('should get previously created dampening', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual('test-rest-trigger-100');
        expect(result.type).toEqual('STRICT_TIME');
        expect(result.evalTimeSetting).toEqual(100);
      });
    });

    describe('get a dampening list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Dampening.query();
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('delete a dampening definition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Dampening.delete({triggerId: 'test-rest-trigger-100'});
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });

  describe('Definitions - Conditions - Availability: ', function() {

    describe('creating an availability condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var availabilityCondition = {
          triggerId: 'test-rest-trigger-1',
          conditionSetSize: 1,
          conditionSetIndex: 1,
          dataId: 'No-Metric',
          operator: 'NOT_UP'
        };

        result = HawkularAlert['AvailabilityCondition'].save(availabilityCondition);
        restResolve(result, done);
      });

      it ('should resolve and return created condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
          conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-1-1-1');
        expect(result.operator).toEqual('NOT_UP');
      });
    });

    var conditionToUpdate;

    describe('get an existing availability condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['AvailabilityCondition'].get({conditionId: 'test-rest-trigger-1-1-1'});
        restResolve(result, done);
      });

      it ('should get previously created availability condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-1-1-1');
        expect(result.operator).toEqual('NOT_UP');

        conditionToUpdate = result;
      });
    });

    describe('update an existing availability condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        conditionToUpdate.operator = 'DOWN';
        result = HawkularAlert['AvailabilityCondition'].put({conditionId: conditionToUpdate.conditionId}, conditionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('get an updated availability condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['AvailabilityCondition'].get({conditionId: 'test-rest-trigger-1-1-1'});
        restResolve(result, done);
      });

      it ('should get previously created availability condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-1-1-1');
        expect(result.operator).toEqual('DOWN');
      });
    });

    describe('get an availability condition list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['AvailabilityCondition'].query();
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('get an availability condition list by triggerId', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['AvailabilityCondition'].trigger({triggerId: 'test-rest-trigger-1'});
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('get a list of conditions from a triggerId', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Trigger.conditions({triggerId: 'test-rest-trigger-1'});
        restResolve(result, done);
      });

      it ('should get one condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].conditionId).toEqual('test-rest-trigger-1-1-1')
        expect(result[0].className).toEqual('AvailabilityCondition')
      });

    });

    describe('delete an availability condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['AvailabilityCondition'].delete({conditionId: 'test-rest-trigger-1-1-1'});
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });

  describe('Definitions - Conditions - Compare: ', function() {

    describe('creating a compare condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var compareCondition = {
          triggerId: 'test-rest-trigger-2',
          conditionSetSize: 1,
          conditionSetIndex: 1,
          data1Id: 'No-Metric-1',
          operator: 'LT',
          data2Multiplier: 1.0,
          data2Id: 'No-Metric-2'
        };

        result = HawkularAlert['CompareCondition'].save(compareCondition);
        restResolve(result, done);
      });

      it ('should resolve and return created condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-2-1-1');
        expect(result.operator).toEqual('LT');
        expect(result.data2Id).toEqual('No-Metric-2');
      });
    });

    var conditionToUpdate;

    describe('get an existing compare condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['CompareCondition'].get({conditionId: 'test-rest-trigger-2-1-1'});
        restResolve(result, done);
      });

      it ('should get previously created compare condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-2-1-1');
        expect(result.operator).toEqual('LT');
        expect(result.data2Id).toEqual('No-Metric-2');

        conditionToUpdate = result;
      });
    });

    describe('update an existing compare condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        conditionToUpdate.operator = 'GT';
        result = HawkularAlert['CompareCondition'].put({conditionId: conditionToUpdate.conditionId}, conditionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('get an updated compare condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['CompareCondition'].get({conditionId: 'test-rest-trigger-2-1-1'});
        restResolve(result, done);
      });

      it ('should get previously created compare condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-2-1-1');
        expect(result.operator).toEqual('GT');
      });
    });

    describe('get a compare condition list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['CompareCondition'].query();
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('get a compare condition list by triggerId', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['CompareCondition'].trigger({triggerId: 'test-rest-trigger-2'});
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('get a list of conditions from a triggerId', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Trigger.conditions({triggerId: 'test-rest-trigger-2'});
        restResolve(result, done);
      });

      it ('should get one condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].conditionId).toEqual('test-rest-trigger-2-1-1')
        expect(result[0].className).toEqual('CompareCondition')
      });

    });

    describe('delete a compare condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['CompareCondition'].delete({conditionId: 'test-rest-trigger-2-1-1'});
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });

  describe('Definitions - Conditions - String: ', function() {

    describe('creating a string condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var stringCondition = {
          triggerId: 'test-rest-trigger-3',
          conditionSetSize: 1,
          conditionSetIndex: 1,
          dataId: 'No-Metric',
          operator: 'EQUAL',
          pattern: 'pattern-test',
          ignoreCase: 'false'
        };

        result = HawkularAlert['StringCondition'].save(stringCondition);
        restResolve(result, done);
      });

      it ('should resolve and return created condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-3-1-1');
        expect(result.operator).toEqual('EQUAL');
        expect(result.pattern).toEqual('pattern-test');
      });
    });

    var conditionToUpdate;

    describe('get an existing string condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['StringCondition'].get({conditionId: 'test-rest-trigger-3-1-1'});
        restResolve(result, done);
      });

      it ('should get previously created string condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-3-1-1');
        expect(result.operator).toEqual('EQUAL');
        expect(result.pattern).toEqual('pattern-test');

        conditionToUpdate = result;
      });
    });

    describe('update an existing string condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        conditionToUpdate.operator = 'ENDS_WITH';
        result = HawkularAlert['StringCondition'].put({conditionId: conditionToUpdate.conditionId}, conditionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('get an updated string condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['StringCondition'].get({conditionId: 'test-rest-trigger-3-1-1'});
        restResolve(result, done);
      });

      it ('should get previously created string condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-3-1-1');
        expect(result.operator).toEqual('ENDS_WITH');
      });
    });

    describe('get an string condition list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['StringCondition'].query();
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('get an string condition list by triggerId', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['StringCondition'].trigger({triggerId: 'test-rest-trigger-3'});
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('get a list of conditions from a triggerId', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Trigger.conditions({triggerId: 'test-rest-trigger-3'});
        restResolve(result, done);
      });

      it ('should get one condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].conditionId).toEqual('test-rest-trigger-3-1-1')
        expect(result[0].className).toEqual('StringCondition')
      });

    });

    describe('delete an string condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['StringCondition'].delete({conditionId: 'test-rest-trigger-3-1-1'});
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });

  describe('Definitions - Conditions - Threshold: ', function() {

    describe('creating a threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var thresholdCondition = {
          triggerId: 'test-rest-trigger-4',
          conditionSetSize: 1,
          conditionSetIndex: 1,
          dataId: 'No-Metric',
          operator: 'LT',
          threshold: 15.0
        };

        result = HawkularAlert['ThresholdCondition'].save(thresholdCondition);
        restResolve(result, done);
      });

      it ('should resolve and return created condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-4-1-1');
        expect(result.operator).toEqual('LT');
        expect(result.threshold).toEqual(15.0);
      });
    });

    var conditionToUpdate;

    describe('get an existing threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['ThresholdCondition'].get({conditionId: 'test-rest-trigger-4-1-1'});
        restResolve(result, done);
      });

      it ('should get previously created threshold condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-4-1-1');
        expect(result.operator).toEqual('LT');
        expect(result.threshold).toEqual(15.0);

        conditionToUpdate = result;
      });
    });

    describe('update an existing threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        conditionToUpdate.operator = 'GTE';
        result = HawkularAlert['ThresholdCondition'].put({conditionId: conditionToUpdate.conditionId}, conditionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('get an updated threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['ThresholdCondition'].get({conditionId: 'test-rest-trigger-4-1-1'});
        restResolve(result, done);
      });

      it ('should get previously created threshold condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-4-1-1');
        expect(result.operator).toEqual('GTE');
      });
    });

    describe('get an threshold condition list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['ThresholdCondition'].query();
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('get an threshold condition list by triggerId', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['ThresholdCondition'].trigger({triggerId: 'test-rest-trigger-4'});
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('get a list of conditions from a triggerId', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Trigger.conditions({triggerId: 'test-rest-trigger-4'});
        restResolve(result, done);
      });

      it ('should get one condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].conditionId).toEqual('test-rest-trigger-4-1-1')
        expect(result[0].className).toEqual('ThresholdCondition')
      });

    });

    describe('delete an threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['ThresholdCondition'].delete({conditionId: 'test-rest-trigger-4-1-1'});
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });

  describe('Definitions - Conditions - Range: ', function() {

    describe('creating a range condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var rangeCondition = {
          triggerId: 'test-rest-trigger-5',
          conditionSetSize: 1,
          conditionSetIndex: 1,
          dataId: 'No-Metric',
          operatorLow: 'INCLUSIVE',
          operatorHigh: 'EXCLUSIVE',
          thresholdLow: 10.51,
          thresholdHigh: 10.99,
          inRange: true
        };

        result = HawkularAlert['ThresholdRangeCondition'].save(rangeCondition);
        restResolve(result, done);
      });

      it ('should resolve and return created condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-5-1-1');
        expect(result.operatorLow).toEqual('INCLUSIVE');
        expect(result.thresholdHigh).toEqual(10.99);
      });
    });

    var conditionToUpdate;

    describe('get an existing range condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['ThresholdRangeCondition'].get({conditionId: 'test-rest-trigger-5-1-1'});
        restResolve(result, done);
      });

      it ('should get previously created range condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-5-1-1');
        expect(result.operatorLow).toEqual('INCLUSIVE');
        expect(result.thresholdHigh).toEqual(10.99);

        conditionToUpdate = result;
      });
    });

    describe('update an existing threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        conditionToUpdate.operatorLow = 'EXCLUSIVE';
        result = HawkularAlert['ThresholdRangeCondition'].put({conditionId: conditionToUpdate.conditionId}, conditionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('get an updated range condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['ThresholdRangeCondition'].get({conditionId: 'test-rest-trigger-5-1-1'});
        restResolve(result, done);
      });

      it ('should get previously created range condition', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.conditionId).toEqual('test-rest-trigger-5-1-1');
        expect(result.operatorLow).toEqual('EXCLUSIVE');
      });
    });

    describe('get an range condition list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['ThresholdRangeCondition'].query();
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('get an range condition list by triggerId', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['ThresholdRangeCondition'].trigger({triggerId: 'test-rest-trigger-5'});
        restResolve(result, done);
      });

      it ('should get a minimum array of one', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('get a list of conditions from a triggerId', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Trigger.conditions({triggerId: 'test-rest-trigger-5'});
        restResolve(result, done);
      });

      it ('should get one condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].conditionId).toEqual('test-rest-trigger-5-1-1')
        expect(result[0].className).toEqual('ThresholdRangeCondition')
      });

    });

    describe('delete an range condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert['ThresholdRangeCondition'].delete({conditionId: 'test-rest-trigger-5-1-1'});
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });

  describe('Definitions - Notifier Types: ', function() {

    describe('get a list of Notifier Types / Plugins', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.NotifierType.query();
        restResolve(result, done);
      });

      it ('should get more than one notifier type', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });

    });

    describe('get a specific Notifier Type', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.NotifierType.get({notifierType : 'email'});
        restResolve(result, done);
      });

      it ('should get notifier type properties', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });

    });

  });

  describe('Definitions - Notifiers: ', function() {

    describe('creating a new notifier', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var notifier = {
          NotifierId: 'test-notifier-email-1',
          NotifierType: 'email',
          prop1: 'value1',
          prop2: 'value2',
          prop3: 'value3'
        };

        result = HawkularAlert.Notifier.save(notifier);
        restResolve(result, done);
      });

      it ('should resolve and return created notifier', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.NotifierId).toEqual('test-notifier-email-1');
        expect(result.NotifierType).toEqual('email');
        expect(result.prop1).toEqual('value1');
        expect(result.prop2).toEqual('value2');
        expect(result.prop3).toEqual('value3');
      });
    });

    var notifierToUpdate;

    describe('get an existing notifier', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Notifier.get({notifierId: 'test-notifier-email-1'});
        restResolve(result, done);
      });

      it ('should get previously created notifier', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.$resolved).toEqual(true);
        expect(result.NotifierId).toEqual('test-notifier-email-1');
        expect(result.NotifierType).toEqual('email');
        expect(result.prop1).toEqual('value1');
        expect(result.prop2).toEqual('value2');
        expect(result.prop3).toEqual('value3');

        notifierToUpdate = result;
      });
    });

    describe('update an existing notifier', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        notifierToUpdate.prop1 = 'value1Modified';
        result = HawkularAlert.Notifier.put({notifierId: 'test-notifier-email-1'}, notifierToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('get an updated notifier', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Notifier.get({notifierId: 'test-notifier-email-1'});
        restResolve(result, done);
      });

      it ('should get previously created notifier', function() {
        expect(result.$resolved).toEqual(true);
        /*
         conditionId == triggerId + '-' + conditionSetSize + '-' + conditionSetIndex;
         */
        expect(result.$resolved).toEqual(true);
        expect(result.NotifierId).toEqual('test-notifier-email-1');
        expect(result.NotifierType).toEqual('email');
        expect(result.prop1).toEqual('value1Modified');
        expect(result.prop2).toEqual('value2');
        expect(result.prop3).toEqual('value3');

        notifierToUpdate = result;
      });
    });

    describe('delete a notifier', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Notifier.delete({notifierId: 'test-notifier-email-1'});
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });

});
