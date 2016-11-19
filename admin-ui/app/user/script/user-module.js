(function() {
  'use strict';
  angular.module('eCarrefour.user', []).config(configure);

  function configure($stateProvider) {
    $stateProvider.state('usersList', {
      url: '/user',
      templateUrl: 'views/userList.html',
      controller: 'userListController',
      controllerAs: 'userListCtrl',
      hideNavbar: false,
      title: 'User List',
      data: {
        roles: (function () {
          return ['ROLE_ADMIN'];
        })()
      }
    });
  }
})();

