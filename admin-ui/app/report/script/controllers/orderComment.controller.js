(function () {

  'use strict';
  angular.module('eCarrefour.report').controller('OrderCommentController', orderCommentsController);

  function orderCommentsController(reportService) {
    var vm = this;

    vm.columns = [
      {
        title: 'Order number',
        field: 'order_id'
      },
      {
        title: 'Sub-order number',
        field: 'sub_order_id'
      },
      {
        title: 'Client id',
        field: 'client_id'
      },
      {
        title: 'Client name',
        field: 'client_name'
      },
      {
        title: 'Client mail',
        field: 'client_mail'
      },
      {
        title: 'Received date',
        field: 'received_date'
      },
      {
        title: 'Delivery date',
        field: 'delivery_date'
      },
      {
        title: 'Delivery interval',
        field: 'delivery_interval'
      },
      {
        title: 'Comment',
        field: 'comment'
      },
      {
        title: 'Timestamp',
        field: 'timestamp'
      },
      {
        title: 'Reporter',
        field: 'reporter'
      }
    ];
    vm.getData = reportService.getOrderCommentReportList;
    vm.scopeFunctions = {};

    return vm;
  }

})();
