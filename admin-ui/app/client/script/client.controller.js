(function() {

  'use strict';

  angular.module('eCarrefour.client').controller('ClientController', clientController);

  function clientController(clientInfo, addressInfo) {

    var vm = this;

    vm.clientDetails = clientInfo;
    vm.clientAddresses = addressInfo.items;

    vm.clientDetailsMapping = {
      'client_id': 'Client Id',
      'email': 'Client Email',
      'firstname': 'First Name',
      'lastname': 'Last Name',
      'phone': 'Client Phone Number',
      'birthday': 'Birthday',
      'gender': 'Gender'
    };

    return vm;

  }

})();
