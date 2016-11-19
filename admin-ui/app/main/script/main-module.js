(function (angular) {

  'use strict';
  angular.module('MadSkillsDeveloperWeb', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ngCookies',
    'oitozero.ngSweetAlert',
    'toastr',
    'ngMessages',
    'ngProgress',
    'MadSkillsDeveloper.login',
    'ngMaterial'
  ])
    .config(configure)
    .run(run);

  function configure($urlRouterProvider, $httpProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/auth');

    $httpProvider.interceptors.push('authenticationInterceptor');

    $stateProvider.state('notAuthorized', {
      url: '/not-authorised',
      templateUrl: 'views/notAuthorized.html'
    });

  }

  function run($rootScope, $state, authService) {

    var unStateChangeStart = $rootScope.$on('$stateChangeStart', onStateChaneStart);

    function onStateChaneStart(e, to, toParams) {

      var identity = authService.isLoggedIn();
      if (!identity && to.name !== 'login') {
        e.preventDefault();
        $state.go('login', {to: to.name, toParams: toParams}, {location: false});
      }

    }

    $rootScope.$on('$destroy', function () {
      unStateChangeStart();
    });

  }

}(angular));
