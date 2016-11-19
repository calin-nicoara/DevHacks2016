(function (angular) {

  'use strict';
  angular
    .module('eCarrefour.order', ['ui.router'])
    .config(configure);

  function configure($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/order/:id', '/order/:id/order_details');

    var orderListState = {
      name: 'orderList',
      url: '/order',
      hideNavbar: false,
      title: 'Order List',
      templateUrl: 'views/orderList.html',
      controller: 'OrderListController',
      controllerAs: 'orderListCtrl',
      data: {
        roles: (function () {
          return ['ROLE_COORD', 'ROLE_PICKER'];
        })()
      }
    };

    var orderPrepareState = {
      name: 'orderPrepare',
      url: '/order/:id/prepare',
      hideNavbar: false,
      title: 'Order Preparation',
      templateUrl: 'views/orderPrepare.html',
      controller: 'OrderPrepareController as vm',
      data: {
        roles: (function () {
          return ['ROLE_PICKER'];
        })()
      }
    };

    var orderState = {
      name: 'order',
      url: '/order/:id',
      hideNavbar: false,
      title: 'Order Details',
      templateUrl: 'views/order.html',
      controller: 'OrderController as vm',
      data: {
        roles: (function () {
          return ['ROLE_PICKER', 'ROLE_COORD'];
        })()
      },
      resolve: {
        selectedOrder: ['orderService', '$stateParams', function (orderService, $stateParams) {
          return orderService.getOrderSummary($stateParams.id)
            .then(function (orderInfo) {
              return orderService.getclientInfo(orderInfo.clientId)
                .then(function (clientInfo) {
                  orderInfo.clientInfo = clientInfo;
                  return orderInfo;
                });
            });
        }]
      }
    };

    var orderDetailsState = {
      name: 'orderDetails',
      parent: 'order',
      url: '/order_details',
      templateUrl: 'views/orderDetailsTabs/orderDetailsTab.html',
      controller: 'OrderDetailsController as vm'
    };

    var orderHistoryState = {
      name: 'orderHistory',
      parent: 'order',
      url: '/order_history',
      templateUrl: 'views/orderDetailsTabs/orderHistoryTab.html',
      controller: 'OrderHistoryController as vm',
      resolve: {
        orderHistoryInfo: ['orderService', '$stateParams', function (orderService, $stateParams) {
          return orderService.getOrderHistory($stateParams.id);
        }]
      }
    };

    var orderProductsState = {
      name: 'orderProducts',
      parent: 'order',
      url: '/order_products',
      templateUrl: 'views/orderDetailsTabs/orderProductsTab.html',
      controller: 'OrderProductsController as vm',
      resolve: {
        orderProductsInfo: ['orderService', '$stateParams', function (orderService, $stateParams) {
          return orderService.getOrderProductList($stateParams.id)
            .then(function (data) {
              var orderProducts = [];
              data.orderAdminProductModels.forEach(function (elem) {
                var product = elem.initial;

                product.status = elem.status;
                product.id = elem.id;
                product.type = 'INITIAL';
                orderProducts = _.concat(orderProducts, product);

                if (elem.replacement) {
                  product = elem.replacement;
                  product.status = elem.status;
                  product.id = elem.id;
                  product.type = 'REPLACEMENT';
                  product['dataClassName'] = 'replacement';
                  orderProducts = _.concat(orderProducts, product);
                }
              });
              return {
                items: orderProducts,
                totalCount: orderProducts.length
              };
            })
        }]
      }
    };

    $stateProvider
      .state(orderListState)
      .state(orderState)
      .state(orderPrepareState)
      .state(orderDetailsState)
      .state(orderHistoryState)
      .state(orderProductsState);
  }

})(angular);
