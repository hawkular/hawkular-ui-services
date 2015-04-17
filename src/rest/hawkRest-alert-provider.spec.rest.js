describe('Provider: Hawkular Alerts live REST', function() {

  var HawkularAlert;
  var res;
  var httpReal;
  var $http;

  var debug = false;
  var suffix = '-test-' + new Date().getTime();
  var triggerId = 'test-rest-trigger-200' + suffix;
  var triggerId2 = 'test-rest-trigger-100' + suffix;
  var triggerId3 = 'test-rest-trigger-1' + suffix;
  var triggerId4 = 'test-rest-trigger-2' + suffix;
  var triggerId5 = 'test-rest-trigger-3' + suffix;
  var triggerId6 = 'test-rest-trigger-4' + suffix;
  var triggerId7 = 'test-rest-trigger-5' + suffix;
  var triggerName = 'No-Metric-Name' + suffix;
  var triggerName2 = 'No-Metric-Name-Modified';
  var dampeningId = 'test-rest-trigger-100' + suffix + '-FIRE';
  var actionId = 'test-notifier-email-1' + suffix;

  var restResolve = function(result, done){
    httpReal.submit();

    result.$promise.then(function(){
    }, function(error){
      fail(errorFn(error));
    }).finally(function(){
      done();
    });
  };

  beforeEach(module('hawkular.services', 'httpReal', function(HawkularAlertProvider) {

    HawkularAlertProvider.setHost(__karma__.config.hostname);
    HawkularAlertProvider.setPort(__karma__.config.port);

  }));

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
          name: triggerName,
          description: 'Test description',
          actions: ['uno', 'dos', 'tres'],
          firingMatch: 'ALL',
          safetyMatch: 'ALL',
          id: triggerId,
          enabled: true,
          safetyEnabled: true
        };
        result = HawkularAlert.Trigger.save(trigger);
        restResolve(result, done);
      });

      it ('should resolve and return created trigger', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.name).toEqual(triggerName);
        expect(result.description).toEqual('Test description');
        expect(result.actions.length).toEqual(3);
        expect(result.actions[0]).toEqual('uno');
        expect(result.actions[1]).toEqual('dos');
        expect(result.actions[2]).toEqual('tres');
        expect(result.firingMatch).toEqual('ALL');
        expect(result.safetyMatch).toEqual('ALL');
        expect(result.id).toEqual(triggerId);
        expect(result.enabled).toEqual(true);
        expect(result.safetyEnabled).toEqual(true);
      });
    });

    var triggerToUpdate;

    describe('get an existing trigger definition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Trigger.get({triggerId: triggerId});
        restResolve(result, done);
      });

      it ('should get previously created trigger', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.name).toEqual(triggerName);
        expect(result.description).toEqual('Test description');
        expect(result.actions.length).toEqual(3);
        expect(result.actions[0]).toEqual('uno');
        expect(result.actions[1]).toEqual('dos');
        expect(result.actions[2]).toEqual('tres');
        expect(result.firingMatch).toEqual('ALL');
        expect(result.safetyMatch).toEqual('ALL');
        expect(result.id).toEqual(triggerId);
        expect(result.enabled).toEqual(true);
        expect(result.safetyEnabled).toEqual(true);

        triggerToUpdate = result;
      });
    });

    describe('update an existing trigger', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        triggerToUpdate.name = triggerName2;
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
        result = HawkularAlert.Trigger.get({triggerId: triggerId});
        restResolve(result, done);
      });

      it ('should get previously created trigger', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.name).toEqual(triggerName2);
        expect(result.description).toEqual('Test description');
        expect(result.actions.length).toEqual(3);
        expect(result.actions[0]).toEqual('uno');
        expect(result.actions[1]).toEqual('dos');
        expect(result.actions[2]).toEqual('tres');
        expect(result.firingMatch).toEqual('ALL');
        expect(result.safetyMatch).toEqual('ALL');
        expect(result.id).toEqual(triggerId);
        expect(result.enabled).toEqual(true);
        expect(result.safetyEnabled).toEqual(true);

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
        result = HawkularAlert.Trigger.delete({triggerId: triggerId});
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
          triggerId: triggerId2,
          triggerMode: 'FIRE',
          type: 'STRICT',
          evalTrueSetting: 1,
          evalTotalSetting: 1,
          evalTimeSetting: 100
        };
        result = HawkularAlert.Dampening.save({triggerId: dampening.triggerId}, dampening);
        restResolve(result, done);
      });

      it ('should resolve and return created dampening', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual(triggerId2);
        expect(result.triggerMode).toEqual('FIRE');
        expect(result.type).toEqual('STRICT');
        expect(result.evalTrueSetting).toEqual(1);
        expect(result.evalTotalSetting).toEqual(1);
        expect(result.evalTimeSetting).toEqual(100);
        expect(result.dampeningId).toEqual(dampeningId);
      });
    });

    var dampeningToUpdate;

    describe('get an existing dampening definition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Dampening.get({triggerId: triggerId2, dampeningId: dampeningId});
        restResolve(result, done);
      });

      it ('should get previously created dampening', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual(triggerId2);
        expect(result.triggerMode).toEqual('FIRE');
        expect(result.type).toEqual('STRICT');
        expect(result.evalTrueSetting).toEqual(1);
        expect(result.evalTotalSetting).toEqual(1);
        expect(result.evalTimeSetting).toEqual(100);
        expect(result.dampeningId).toEqual(dampeningId);

        dampeningToUpdate = result;
      });
    });

    describe('update an existing dampening', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        dampeningToUpdate.type = 'STRICT_TIME';
        result = HawkularAlert.Dampening.put({triggerId: dampeningToUpdate.triggerId,
          dampeningId: dampeningToUpdate.dampeningId}, dampeningToUpdate);
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
        result = HawkularAlert.Dampening.get({triggerId: triggerId2,
          dampeningId: dampeningId});
        restResolve(result, done);
      });

      it ('should get previously created dampening', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual(triggerId2);
        expect(result.triggerMode).toEqual('FIRE');
        expect(result.type).toEqual('STRICT_TIME');
        expect(result.evalTrueSetting).toEqual(1);
        expect(result.evalTotalSetting).toEqual(1);
        expect(result.evalTimeSetting).toEqual(100);
        expect(result.dampeningId).toEqual(dampeningId);
      });
    });

    describe('get a dampening list', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Dampening.query({triggerId: triggerId2});
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
        result = HawkularAlert.Dampening.delete({triggerId: triggerId2,
          dampeningId: dampeningId});
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
          triggerId: triggerId3,
          dataId: 'No-Metric',
          type: 'AVAILABILITY',
          operator: 'NOT_UP'
        };

        result = HawkularAlert.Condition.save({triggerId: triggerId3}, availabilityCondition);
        restResolve(result, done);
      });

      it ('should resolve and return created condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].operator).toEqual('NOT_UP');
      });
    });

    var conditionToUpdate;

    describe('get an existing availability condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.query({triggerId: triggerId3});
        restResolve(result, done);
      });

      it ('should get previously created availability condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].triggerId).toEqual(triggerId3);
        expect(result[0].operator).toEqual('NOT_UP');

        conditionToUpdate = result[0];
      });
    });

    describe('update an existing availability condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        conditionToUpdate.operator = 'DOWN';
        result = HawkularAlert.Condition.put({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId}, conditionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].triggerId).toEqual(triggerId3);
        expect(result[0].operator).toEqual('DOWN');
      });
    });

    describe('get an updated availability condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.get({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId});
        restResolve(result, done);
      });

      it ('should get previously created availability condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual(triggerId3);
        expect(result.operator).toEqual('DOWN');
      });
    });

    describe('delete an availability condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.delete({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId});
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
          triggerId: triggerId4,
          type: 'COMPARE',
          dataId: 'No-Metric-1',
          operator: 'LT',
          data2Multiplier: 1.0,
          data2Id: 'No-Metric-2'
        };

        result = HawkularAlert.Condition.save({triggerId: triggerId4}, compareCondition);
        restResolve(result, done);
      });

      it ('should resolve and return created condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].operator).toEqual('LT');
        expect(result[0].data2Id).toEqual('No-Metric-2');
      });
    });

    var conditionToUpdate;

    describe('get an existing compare condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.query({triggerId: triggerId4});
        restResolve(result, done);
      });

      it ('should get previously created compare condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].operator).toEqual('LT');
        expect(result[0].data2Id).toEqual('No-Metric-2');

        conditionToUpdate = result[0];
      });
    });

    describe('update an existing compare condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        conditionToUpdate.operator = 'GT';
        result = HawkularAlert.Condition.put({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId}, conditionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].operator).toEqual('GT');
        expect(result[0].data2Id).toEqual('No-Metric-2');
      });
    });

    describe('get an updated compare condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.get({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId});
        restResolve(result, done);
      });

      it ('should get previously created compare condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual(triggerId4);
        expect(result.operator).toEqual('GT');
      });
    });

    describe('delete a compare condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.delete({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId});
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
          triggerId: triggerId5,
          type: 'STRING',
          dataId: 'No-Metric',
          operator: 'EQUAL',
          pattern: 'pattern-test',
          ignoreCase: 'false'
        };

        result = HawkularAlert.Condition.save({triggerId: triggerId5}, stringCondition);
        restResolve(result, done);
      });

      it ('should resolve and return created condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].triggerId).toEqual(triggerId5);
        expect(result[0].operator).toEqual('EQUAL');
        expect(result[0].pattern).toEqual('pattern-test');
      });
    });

    var conditionToUpdate;

    describe('get an existing string condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.query({triggerId: triggerId5});
        restResolve(result, done);
      });

      it ('should get previously created string condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].triggerId).toEqual(triggerId5);
        expect(result[0].operator).toEqual('EQUAL');
        expect(result[0].pattern).toEqual('pattern-test');

        conditionToUpdate = result[0];
      });
    });

    describe('update an existing string condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        conditionToUpdate.operator = 'ENDS_WITH';
        result = HawkularAlert.Condition.put({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId}, conditionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
        expect(result[0].triggerId).toEqual(triggerId5);
        expect(result[0].operator).toEqual('ENDS_WITH');
        expect(result[0].pattern).toEqual('pattern-test');
      });
    });

    describe('get an updated string condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.get({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId});
        restResolve(result, done);
      });

      it ('should get previously created string condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual(triggerId5);
        expect(result.operator).toEqual('ENDS_WITH');
      });
    });

    describe('delete an string condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.delete({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId});
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
          triggerId: triggerId6,
          type: 'THRESHOLD',
          dataId: 'No-Metric',
          operator: 'LT',
          threshold: 15.0
        };

        result = HawkularAlert.Condition.save({triggerId: triggerId6}, thresholdCondition);
        restResolve(result, done);
      });

      it ('should resolve and return created condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].triggerId).toEqual(triggerId6);
        expect(result[0].operator).toEqual('LT');
        expect(result[0].threshold).toEqual(15.0);
      });
    });

    var conditionToUpdate;

    describe('get an existing threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.query({triggerId: triggerId6});
        restResolve(result, done);
      });

      it ('should get previously created threshold condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].triggerId).toEqual(triggerId6);
        expect(result[0].operator).toEqual('LT');
        expect(result[0].threshold).toEqual(15.0);

        conditionToUpdate = result[0];
      });
    });

    describe('update an existing threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        conditionToUpdate.operator = 'GTE';
        result = HawkularAlert.Condition.put({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId}, conditionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].triggerId).toEqual(triggerId6);
        expect(result[0].operator).toEqual('GTE');
        expect(result[0].threshold).toEqual(15.0);
      });
    });

    describe('get an updated threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.get({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId});
        restResolve(result, done);
      });

      it ('should get previously created threshold condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual(triggerId6);
        expect(result.operator).toEqual('GTE');
      });
    });

    describe('delete an threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.delete({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId});
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
          triggerId: triggerId7,
          type: 'RANGE',
          dataId: 'No-Metric',
          operatorLow: 'INCLUSIVE',
          operatorHigh: 'EXCLUSIVE',
          thresholdLow: 10.51,
          thresholdHigh: 10.99,
          inRange: true
        };

        result = HawkularAlert.Condition.save({triggerId: triggerId7}, rangeCondition);
        restResolve(result, done);
      });

      it ('should resolve and return created condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].triggerId).toEqual(triggerId7);
        expect(result[0].operatorLow).toEqual('INCLUSIVE');
        expect(result[0].thresholdHigh).toEqual(10.99);
      });
    });

    var conditionToUpdate;

    describe('get an existing range condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.query({triggerId: triggerId7});
        restResolve(result, done);
      });

      it ('should get previously created range condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].triggerId).toEqual(triggerId7);
        expect(result[0].operatorLow).toEqual('INCLUSIVE');
        expect(result[0].thresholdHigh).toEqual(10.99);

        conditionToUpdate = result[0];
      });
    });

    describe('update an existing threshold condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        conditionToUpdate.operatorLow = 'EXCLUSIVE';
        result = HawkularAlert.Condition.put({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId}, conditionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toEqual(1);
        expect(result[0].triggerId).toEqual(triggerId7);
        expect(result[0].operatorLow).toEqual('EXCLUSIVE');
        expect(result[0].thresholdHigh).toEqual(10.99);
      });
    });

    describe('get an updated range condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.get({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId});
        restResolve(result, done);
      });

      it ('should get previously created range condition', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.triggerId).toEqual(triggerId7);
        expect(result.operatorLow).toEqual('EXCLUSIVE');
      });
    });

    describe('delete an range condition', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Condition.delete({triggerId: conditionToUpdate.triggerId,
          conditionId: conditionToUpdate.conditionId});
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });

  describe('Definitions - Action Plugins: ', function() {

    describe('get a list of Action Plugins', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.ActionPlugin.query();
        restResolve(result, done);
      });

      it ('should get more than one action plugin', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });

    });

    describe('get a specific Action Plugin', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.ActionPlugin.get({actionPlugin : 'email'});
        restResolve(result, done);
      });

      it ('should get action plugin properties', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });

    });

  });

  describe('Definitions - Actions: ', function() {

    describe('creating a new action ', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var action = {
          actionId: actionId,
          actionPlugin: 'email',
          prop1: 'value1',
          prop2: 'value2',
          prop3: 'value3'
        };

        result = HawkularAlert.Action.save(action);
        restResolve(result, done);
      });

      it ('should resolve and return created action', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.actionId).toEqual(actionId);
        expect(result.actionPlugin).toEqual('email');
        expect(result.prop1).toEqual('value1');
        expect(result.prop2).toEqual('value2');
        expect(result.prop3).toEqual('value3');
      });
    });

    var actionToUpdate;

    describe('get an existing action ', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Action.get({actionId: actionId});
        restResolve(result, done);
      });

      it ('should get previously created notifier', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.actionId).toEqual(actionId);
        expect(result.actionPlugin).toEqual('email');
        expect(result.prop1).toEqual('value1');
        expect(result.prop2).toEqual('value2');
        expect(result.prop3).toEqual('value3');

        actionToUpdate = result;
      });
    });

    describe('update an existing action ', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        actionToUpdate.prop1 = 'value1Modified';
        result = HawkularAlert.Action.put({actionId: actionId}, actionToUpdate);
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('get an updated action', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Action.get({actionId: actionId});
        restResolve(result, done);
      });

      it ('should get previously created action', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.actionId).toEqual(actionId);
        expect(result.actionPlugin).toEqual('email');
        expect(result.prop1).toEqual('value1Modified');
        expect(result.prop2).toEqual('value2');
        expect(result.prop3).toEqual('value3');
      });
    });

    describe('get a list of actions by plugin', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Action.plugin({actionPlugin: 'email'});
        restResolve(result, done);
      });

      it ('should get previously created action', function() {
        expect(result.$resolved).toEqual(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });


    describe('delete an action', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        result = HawkularAlert.Action.delete({actionId: actionId});
        restResolve(result, done);
      });

      it ('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });

});
