(function (angular) {

  'use strict';
  angular
    .module('webApp', [
      'ngAnimate',
      'ngResource',
      'ngSanitize',
      'ui.router',
      'ui.mask',
      'ngCookies',
      'ngDraggable',
      'ngTable',
      'uiSwitch',
      'oitozero.ngSweetAlert',
      'ui.bootstrap',
      'toastr',
      'ui.multiselect',
      'ngMaterial',
      'ngMessages',
      'jkuri.timepicker',
      'angularMoment',
      'ngProgress'
    ])
    .config(configure)
    .run(run);

  function configure($urlRouterProvider, $httpProvider, $stateProvider
    , $mdDateLocaleProvider, moment) {

    $urlRouterProvider.otherwise('/');

    $httpProvider.interceptors.push('authenticationInterceptor');
    $httpProvider.interceptors.push('requestToastInterceptor');
    $httpProvider.interceptors.push('responseToastInterceptor');
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $stateProvider.state('notAuthorized', {
      url: '/not',
      templateUrl: 'views/notAuthorized.html',
      hideNavbar: false
    });

    $mdDateLocaleProvider.formatDate = function (date) {
      return date ? moment(date).format('YYYY-MM-DD') : '';
    };

    $mdDateLocaleProvider.parseDate = function (dateString) {
      var m = moment(dateString, 'YYYY-MM-DD', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

    $stateProvider.state('parent', {
      url: '/',
      controller: function ($state) {
        $state.go('login', {}, {location: false});
      },
      controllerAs: 'parentCtrl'
    });

  }

  function run($rootScope, $state, authService, ngProgressFactory) {

    var unStateChangeStart = $rootScope.$on('$stateChangeStart', onStateChaneStart);

    $rootScope.progressBar = ngProgressFactory.createInstance();

    function onStateChaneStart(e, to, toParams, from, fromParams) {

      var identity = authService.isLoggedIn();
      var roles = (to.data) ? to.data.roles : null;
      if (!identity && to.name !== 'login') {
        e.preventDefault();
        $state.go('login', {to: to.name, toParams: toParams},
                  {location: false});
      }
      else if (identity && to.name !== 'login') {
        if (roles && !authService.isInRole(roles)) {
          //redirect to a custom state to which everybody has access
          e.preventDefault();
          $state.go('notAuthorized', {}, {location: 'replace'});
        }
      }

    }

    $rootScope.$on('$destroy', function() {
        unStateChangeStart();
    });

  }

}(angular));
