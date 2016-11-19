(function () {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductEanListController', productEanListController);

  function productEanListController(eanList) {
    var vm = this;

    function intialize() {
      vm.eanList = eanList;
    }
    
    intialize();
    
    return vm;
  }

})();
