(function (angular) {

  'use strict';
  angular.module('MadSkillsDeveloper.login', ['ui.router', 'satellizer']).config(configure);

  function configure($stateProvider, $authProvider) {

    $authProvider.github({
                           clientId: 'e580105629067318aaa8'
                         });

    $stateProvider.state('login', {
      params: {to: false, toParams: false, retryLogin: true},
      url: '/auth',
      controller: 'LoginController as vm',
      templateUrl: 'views/login.html'
    });
  }

})(angular);
