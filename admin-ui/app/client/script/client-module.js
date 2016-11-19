(function () {
  'use strict';
  angular
    .module('eCarrefour.client', [])
    .config(configure);

  function configure($stateProvider) {

    $stateProvider.state('clientList', {
      url: '/clients',
      templateUrl: 'views/clientList.html',
      controller: 'ClientListController',
      controllerAs: 'clientsCtrl',
      title: 'Clients List',
      data: {
        roles: (function () {
          return ['ROLE_COORD', 'ROLE_ADMIN'];
        })()
      }
    });

    $stateProvider.state('client', {
      url: '/clients/:id',
      templateUrl: 'views/client.html',
      controller: 'ClientController',
      controllerAs: 'clientCtrl',
      title: 'Client details',
      resolve: {
        clientInfo: function (clientService, $stateParams) {
          return clientService.getOne($stateParams.id);
        },
        addressInfo: function (clientService, $stateParams) {
          return clientService.getClientAddressList($stateParams.id);
        }
      },
      data: {
        roles: (function () {
          return ['ROLE_COORD', 'ROLE_ADMIN'];
        })()
      }
    });

  }

})();
