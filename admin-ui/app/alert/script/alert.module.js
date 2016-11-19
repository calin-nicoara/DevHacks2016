(function () {

  'use strict';
  angular
    .module('eCarrefour.alert', ['ui.router'])
    .config(configure)
    .run(run);

  function configure($stateProvider) {

    $stateProvider.state('validation', {
      url: '/validation',
      templateUrl: 'views/validation.html',
      controller: 'ValidationController',
      controllerAs: 'validationCtrl',
      hideNavbar: false,
      title: 'Validations',
      data: {
        roles: (function () {
          return ['ROLE_COORD', 'ROLE_ADMIN'];
        })()
      }
    });
    
  }

  function run() {

  }

})();

