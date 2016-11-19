(function () {

  'use strict';
  angular.module('eCarrefour.settings')
    .controller('DeliveryController', deliveryController);

  function deliveryController(settingsService, moment, $log, ngTableService) {
    var vm = this;

    vm.deliveryRulesOpen = {
      rules: true,
      excludedDate: false,
      orderInterval: false
    };

    vm.newExcludedDate = {};
    vm.excludedMinDate = new Date();

    vm.timeIntervalEnabled = {};
    vm.newOrderInterval = {
      start: '00:00',
      end: '00:00'
    };

    var validateExcludedDate = false;

    vm.deliveryRulesData = {
      rules: undefined,
      excludedDates: {
        columns: [
          {
            title: 'Excluded Date',
            field: 'date'
          },
          {
            title: 'Name',
            field: 'name'
          },
          {
            title: 'Delete',
            field: 'delete',
            getValue: function (row) {
              var html = '<button  class="btn btn-primary"'
                         + ' ng-click="scopeFunctions.deleteRowExcludedDate(' + row.id
                         + '); "> Delete  </button>';
              return html;
            }
          }
        ],
        getData: function (page, size, filter) {
          return settingsService.excludedDateList(page, size, filter);
        },
        scopeFunctions: {
          deleteRowExcludedDate: function (id) {
            vm.excludedDateActions.delete(id);
          }
        }
      },
      intervalList: [],
      timeIntervals: {}
    };

    vm.deliveryRulesActions = {
      enabled: false,
      edit: function () {
        vm.deliveryRulesData.backup = _.cloneDeep(vm.deliveryRulesData.rules);
        $log.info('EDIT', vm.deliveryRulesData.rules);
        vm.deliveryRulesActions.enabled = true;
      },
      cancel: function () {
        vm.deliveryRulesActions.enabled = false;
        vm.deliveryRulesData.rules = _.cloneDeep(vm.deliveryRulesData.backup);
        $log.info('CANCEL', vm.deliveryRulesData.rules);
      },
      save: function () {
        settingsService.putDeliveryRules(vm.deliveryRulesData.rules)
          .then(function () {
                  vm.deliveryRulesActions.enabled = false;
                  vm.deliveryRulesData.backup = undefined;
                })
          .catch(function (err) {
                   $log.error(new Error(err.status || err.statusCode || err.message
                                        || 'Connection Error', vm.deliveryRulesData.rules));
                 });

      }
    };

    vm.excludedDateActions = {
      add: function () {
        if (!vm.newExcludedDate.date || vm.newExcludedDate.date === '') {
          validateExcludedDate = true;
          return;
        }

        var excludedDate = {
          id: '',
          date: moment(vm.newExcludedDate.date).format('YYYY-MM-DD'),
          name: vm.newExcludedDate.name
        };
        settingsService.putExcludedDate(excludedDate)
          .then(function () {
                  ngTableService.reload();
                });
        vm.newExcludedDate = {};
      },
      delete: function (id) {
        $log.info('delete id: ' + id);
        settingsService.deleteExcludedDate(id)
          .then(function () {
                  ngTableService.reload();
                });
      },
      isValid: function () {
        return validateExcludedDate;
      },
      closePopover: function () {
        validateExcludedDate = false;
      }
    };

    vm.timeIntervalsActions = {
      validateDate: false,
      add: function () {
        var startTime = moment(vm.newOrderInterval.start, 'h:mm');
        var endTime = moment(vm.newOrderInterval.end, 'h:mm');
        if (!endTime.isAfter(startTime)) {
          vm.timeIntervalsActions.validateDate = true;
          return;
        }

        settingsService.putDeliveryTimeInterval(vm.newOrderInterval.start, vm.newOrderInterval.end)
          .then(function () {
                  vm.timeIntervalsActions.load();
                  vm.newOrderInterval = {
                    start: '00:00',
                    end: '00:00'
                  };
                });

      },
      edit: function (id) {
        $log.info('EDIT', id);
        vm.timeIntervalEnabled[id] = true;
      },
      cancel: function (id) {
        vm.timeIntervalEnabled[id] = false;
        vm.timeIntervalsActions.load();
        $log.info('CANCEL', id);
      },
      save: function (id) {
        vm.timeIntervalEnabled[id] = false;
        $log.info(vm.deliveryRulesData.timeIntervals[id]);
        settingsService.saveDeliveryTimeInterval(vm.deliveryRulesData.timeIntervals[id])
          .then(function () {
                  vm.timeIntervalsActions.load();
                });
      },
      load: function () {
        settingsService.getDeliveryRules()
          .then(function (data) {
                  vm.deliveryRulesData.intervalList = data.deliveryTimeIntervalModels;
                  _.forOwn(vm.deliveryRulesData.intervalList, function (interval) {
                    vm.deliveryRulesData.timeIntervals[interval.id] = interval;
                  });
                });
      },
      isValid: function () {
        return vm.timeIntervalsActions.validateDate;
      },
      closePopover: function () {
        vm.timeIntervalsActions.validateDate = false;
      }
    };

    function getDeliveryRulesData() {
      settingsService.getDeliveryRules()
        .then(function (data) {
                vm.deliveryRulesData.rules = data.deliveryRuleModel;
                vm.deliveryRulesData.intervalList = data.deliveryTimeIntervalModels;
                _.forOwn(vm.deliveryRulesData.intervalList, function (interval) {
                  vm.deliveryRulesData.timeIntervals[interval.id] = interval;
                });
              });
    }

    getDeliveryRulesData();

    return vm;

  }
})();
