(function (angular) {
  'use strict';

  angular.module('MadSkillsDeveloper.login').factory('authService', authService);

  function authService($http, $q) {
    var service = {};
    var currentUser = null;


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


    service.authenticateUser = function (userModel) {
      return makeCall('POST', '/users', userModel)
        .then(function (user) {
          currentUser = user;
          return currentUser;
        })
    };

    service.getUser = function () {
      return currentUser;
    };

    service.isLoggedIn = function () {
      return !!currentUser;
    };

    service.getAuthenticatedUser = function () {
      return makeCall('GET', '/users/1')
        .then(function (user) {
            currentUser = user;
            return currentUser;
        })

    };

    return service;
  }


})(angular);
