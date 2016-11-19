(function () {

  'use strict';
  angular.module('eCarrefour.alert').directive('badgePanel', alertsDirective);

  function alertsDirective() {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/badgePanel.html',
      controller: alertsController,
      controllerAs: 'vm'
    };

  }

  function alertsController(alertService, $timeout, $log, socket, $state) {

    var vm = this;

    vm.alerts = [];
    vm.total = -1;

    var currentPage = 0;
    var currentSize = 10;

    socket.receive()
      .then(null, null, function (notification) {
        if (!_.find(vm.alerts, ['id', notification.id])) {
          vm.alerts.push(notification);
          vm.total++;
        }
      });

    vm.getAlerts = function () {
      currentPage++;
      if (currentPage * currentSize < (vm.total + currentSize - 1) || vm.total === -1) {
        alertService.list(currentPage, currentSize)
          .then(function (data) {
            vm.alerts = _.concat(vm.alerts, _.sortBy(data.items, function (elem) {
              return elem['created_date'];
            }));
            vm.total = data.totalCount;
          })
          .catch(function (err) {
            $log.error(new Error('Connection Error', err.data));
          });
      }
    };

    var updateState = function (alert) {
      alertService.markRead(alert.id)
        .then(function () {
          if (alert.type === 'PRICE') {
            var reload = $state.current.name === 'validation';
            $state.go('validation', {}, {reload: reload});
          }
        });
    };

    vm.getToggle = function () {
      if (vm.total === 0) {
        return '';
      }
      else {
        return 'dropdown';
      }
    };

    vm.selectAlert = function (ev, alert) {
      ev.stopPropagation();
      _.pull(vm.alerts, alert);
      vm.total--;

      $timeout(updateState.call(this, alert), 200);

      //improve this with height
      if (vm.alerts.length < 5 && vm.alerts.length < vm.total) {
        vm.getAlerts();
      }

      if (vm.total === 0) {
        angular.element('.alert-container').removeClass('open');
      }
    };

    vm.getAlerts();

    return vm;
  }

})();
