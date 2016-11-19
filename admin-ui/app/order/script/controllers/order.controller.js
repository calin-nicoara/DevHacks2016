(function () {
  'use strict';

  angular.module('eCarrefour.order')
    .controller('OrderController', orderController);

  function orderController($state, authService, selectedOrder, orderService) {
    var vm = this;

    vm.viewList = [
      {
        name: 'orderDetails',
        title: 'Order Details'
      },
      {
        name: 'orderHistory',
        title: 'Order History'
      },
      {
        name: 'orderProducts',
        title: 'Products'
      }];

    vm.isActiveTab = function (viewName) {
      return $state.current.name === viewName;
    };

    vm.isCoord = authService.isInRole(['ROLE_COORD']);
    vm.selectedOrder = selectedOrder;
    vm.statuses = [];
    vm.selectedStatus = null;

    setStatuses();

    vm.changeStatus = function (newStatus) {
      vm.selectedOrder.orderStatus = newStatus;
    };

    vm.selectStatus = function (status) {
      vm.selectedStatus = status;
    };

    vm.updateStatus = function () {
      orderService.updateOrderStatus(vm.selectedOrder.id, vm.selectedStatus)
        .then(function () {
          vm.selectedOrder.orderStatus = _.clone(vm.selectedStatus);
          vm.selectedStatus = null;
          setStatuses();
        });
    };

    function setStatuses() {
      switch (vm.selectedOrder.orderStatus) {
        case 'PREPARED':
          vm.statuses = ['SHIPPED', 'DELIVERED'];
          vm.selectedStatus = 'SHIPPED';
          break;
        case 'SHIPPED':
          vm.statuses = ['DELIVERED'];
          vm.selectedStatus = 'DELIVERED';
          break;
        default:
          vm.statuses = [];
          break;
      }
    }

    return vm;

  }
})();
