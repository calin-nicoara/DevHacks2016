(function () {
  'use strict';

  angular.module('eCarrefour.order')
    .controller('OrderHistoryController', orderHistoryController);

  function orderHistoryController(orderHistoryInfo, $q) {
    var vm = this;

    vm.columns = [
      {
        title: 'Timestamp',
        getValue: function (row) {
          return row.timestamp.replace('T', ' ');
        }
      },
      {
        title: 'Status',
        field: 'status'
      },
      {
        title: 'Comment',
        field: 'details'
      }
    ];

    vm.getData = function () {
      return $q.when(orderHistoryInfo);
    };

    return vm;
  }
})();
