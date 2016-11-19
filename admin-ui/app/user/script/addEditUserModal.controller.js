(function () {
  'use strict';

  angular.module('eCarrefour.user').controller('addUserController', addUserController);

  function addUserController(storeService, userEditModel, $uibModalInstance) {
    var vm = this;
    
    vm.stores = storeService.getStores();
    vm.editModel = userEditModel;

    vm.addSaveUser = addSaveUser;
    vm.cancel = cancel;

    function addSaveUser() {
      $uibModalInstance.close(vm.editModel);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    return vm;
  }

})();
