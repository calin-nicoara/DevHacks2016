(function () {

  'use strict';
  angular.module('eCarrefour.catalog').controller('ProductMetiController', productMetiController);

  function productMetiController(productInfo, stockInfo) {
    var vm = this;
    
    function initialize() {
      vm.productDetails = productInfo;
      vm.productDetails.importedStockQuantity = stockInfo['imported_stock_quantity'];

      vm.metiMappings = {
        departmentCode: 'Department Code',
        departmentName: 'Department Name',
        rayonCode: 'Rayon Code',
        rayonName: 'Rayon Name',
        familyCode: 'Family Code',
        familyName: 'Family Name',
        subFamilyCode: 'Sub-Family Code',
        subFamilyName: 'Sub-Family Name',
        ubCode: 'UB Code',
        ubName: 'UB Name',
        importedStockQuantity: 'Meti Stock',
        brand: 'Brand',
        statusCode: 'Status Code',
        creationDate: 'Creation Date',
        vatTax: 'VAT Tax',
        lastStatusChangeDate: 'Last Status Change Date'
      };
    }

    initialize();

    return vm;
  }

})();
