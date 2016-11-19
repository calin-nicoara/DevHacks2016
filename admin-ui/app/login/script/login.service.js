(function (angular) {
  'use strict';

  angular.module('MadSkillsDeveloper.login').factory('authService', authService);

  function authService($http, $q) {
    var service = {};
    var currentUser = null;

    //todo resolve catchces and state.go s

    var makeCall = function (verb, url, data, params, headers) {
      var base = '/api';
      return $http({
                     method: verb,
                     data: data,
                     url: base + url,
                     params: params,
                     headers: headers
                   })
        .then(function (reply) {
          return reply.data;
        });
    };


    service.login = function () {
      //todo make call to github to login and save user info here

    };

    service.getUser = function () {
      return currentUser;
    };

    service.isLoggedIn = function () {
      return !!currentUser;
    };

    service.getAuthenticatedUser = function () {
      //todo verify authentication and get user from DB
      // return makeCall('GET', '/api/auth/me')
      //   .then(function (user) {
      //       currentUser = user;
      //       return currentUser;
      //   })

      return $q.when(true);

    };

    return service;
  }


})(angular);
