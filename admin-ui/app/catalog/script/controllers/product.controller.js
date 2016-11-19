(function () {

  'use strict';
  angular.module('eCarrefour.catalog').controller('ProductController', productController);

  function productController($state, $rootScope, productInfo) {
    var vm = this;

    vm.viewList = [
      {
        name: 'details',
        title: 'Product details'
      },
      {
        name: 'meti',
        title: 'Meti fields'
      },
      {
        name: 'price',
        title: 'Price'
      },
      {
        name: 'images',
        title: 'Images'
      },
      {
        name: 'categories',
        title: 'Categories'
      },
      {
        name: 'attributes',
        title: 'Attribute values'
      },
      {
        name: 'publishStatus',
        title: 'Publish status'
      },
      {
        name: 'eanList',
        title: 'EAN list'
      },
      {
        name: 'wmsInfo',
        title: 'WMS info'
      }
    ];

    vm.isActiveTab = function (viewName) {
      return $state.current.name === viewName;
    };

    $rootScope.stateTitle.name = 'Product details' + ' - ' + productInfo.metiName + ' (' + productInfo.metiCode + ')';
    return vm;
  }

})();
