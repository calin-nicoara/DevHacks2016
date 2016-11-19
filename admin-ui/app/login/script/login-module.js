(function (angular) {

  'use strict';
  angular.module('MadSkillsDeveloper.login', ['ui.router', 'satellizer']).config(configure);

  function configure($stateProvider, $authProvider) {

    $authProvider.github({
                           clientId: 'febade3bf015f6b35a46'
                         });

    $stateProvider.state('login', {
      params: {to: false, toParams: false, retryLogin: true},
      url: '/auth',
      controller: 'LoginController as vm',
      templateUrl: 'views/login.html'
    });
  }

})(angular);
