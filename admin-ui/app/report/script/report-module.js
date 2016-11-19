(function () {

  'use strict';
  angular.module('eCarrefour.report', [])
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/report', '/report/product-trace');

    var reportState = {
      name: 'report',
      url: '/report',
      templateUrl: 'views/report.html',
      controller: 'ReportController as vm',
      hideNavbar: false,
      title: 'Reports',
      data: {
        roles: (function () {
          return ['ROLE_ADMIN'];
        })()
      }
    };

    var productReportState = {
      name: 'productTrace',
      parent: 'report',
      url: '/product-trace',
      templateUrl: 'views/reportsTabs/productTrace.html',
      controller: 'ProductTraceController as vm',
    };

    var orderCommentReportState = {
      name: 'orderComment',
      parent: 'report',
      url: '/order-comment',
      templateUrl: 'views/reportsTabs/orderComment.html',
      controller: 'OrderCommentController as vm'
    };

    var productInOrderReportState = {
      name: 'productInOrder',
      parent: 'report',
      url: '/product-in-order',
      templateUrl: 'views/reportsTabs/productInOrder.html',
      controller: 'ProductInOrderController as vm'
    };

    var salesReportState = {
      name: 'sales',
      parent: 'report',
      url: '/sales',
      templateUrl: 'views/reportsTabs/sales.html',
      controller: 'SalesController as vm'
    };

    var clientStatusReport = {
      name: 'clientStatus',
      parent: 'report',
      url: '/client-status',
      templateUrl: 'views/reportsTabs/clientStatus.html',
      controller: 'ClientStatusController as vm'
    };

    $stateProvider
      .state(reportState)
      .state(productReportState)
      .state(orderCommentReportState)
      .state(productInOrderReportState)
      .state(salesReportState)
      .state(clientStatusReport);
  }

})();
