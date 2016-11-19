(function () {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductCategoriesController', productCategoriesController);

  function productCategoriesController(productInfo, productService, catalogService) {
    var vm = this;

    vm.categoryPaths = productInfo.categoryPaths;
    vm.metiCode = productInfo.metiCode;

    vm.removeCategory = function (categoryId) {
      productService.removeCategory(categoryId, productInfo.metiCode)
        .then(function () {
          _.pullAllBy(vm.categoryPaths, [{'categoryId': categoryId}], 'categoryId');
        });
    };

    catalogService.loadCategories()
      .then(function (data) {
        vm.categoryList = data;
      });

    return vm;
  }

})();
