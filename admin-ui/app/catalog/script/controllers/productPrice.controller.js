(function () {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductPriceController', productPriceController);

  function productPriceController(productInfo, productService) {
    var vm = this;

    var backupData = {};

    function initialize() {
      vm.productDetails = productInfo;
      vm.editDisabled = true;
      vm.priceMapper = {
        price: 'Price',
        iprice: 'Meti Selling Price',
        ipromotionPrice: 'ACO CATA Price'
      };
    }

    initialize();

    vm.enablePriceEdit = function () {
      backupData = _.clone(vm.productDetails);
      vm.editDisabled = false;
    };

    vm.cancelPriceEdit = function () {
      vm.productDetails = backupData;
      vm.editDisabled = true;
    };

    vm.savePriceInfo = function () {
        productService.saveProductPrice(productInfo.metiCode, vm.productDetails)
          .then(function () {
            vm.editDisabled = true;
          });
    };
    
    return vm;
  }

})();
