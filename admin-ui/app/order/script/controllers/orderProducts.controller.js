(function () {
  'use strict';

  angular.module('eCarrefour.order')
    .controller('OrderProductsController', orderProductsController);

  function orderProductsController($q, orderProductsInfo) {
    var vm = this;

    vm.columns = [
      {
        title: 'Product Site Name',
        field: 'title'
      },
      {
        title: 'Ordered quantity',
        field: 'quantity'
      },
      {
        title: 'Shipped quantity',
        field: 'shippedQuantity'
      },
      {
        title: 'Delivered quantity',
        field: 'deliveredQuantity'
      },
      {
        title: 'Product Price',
        field: 'price'
      },
      {
        title: 'Status',
        getValue: function (row) {
          if(row.type === 'INITIAL'){
            return row.status;
          }
          else {
            return '';
          }
        }
      }
    ];

    vm.getData = function (page, size, filter) {
      return $q.when(orderProductsInfo);
    };

    return vm;
  }
})();
