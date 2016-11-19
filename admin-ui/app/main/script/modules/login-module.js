(function (angular) {

  'use strict';
  angular.module('MadSkillsDeveloper.login', ['ui.router']).config(configure);

  function configure($stateProvider) {

    $stateProvider.state('login', {
      params: {to: false, toParams: false, retryLogin: true},
      controller: 'LoginController as vm',
      templateUrl: 'views/login.html'
    });
  }

})(angular);
