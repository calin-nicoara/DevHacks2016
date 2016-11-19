(function () {

  'use strict';
  angular.module('eCarrefour.user').factory('userService', userService);

  function userService($http, authService) {
    var service = {};

    var makeCall = function (verb, url, data, params) {
      return $http({
                     method: verb,
                     data: data,
                     url: url,
                     params: params
                   })
        .then(function (reply) {
          return reply.data;
        });
    };

    service.getUserList = function (page, size, filterModel) {
      if (angular.isUndefined(filterModel)) {
        filterModel = {
          page: 0,
          size: 10
        };
      }

      filterModel.page = page - 1;
      filterModel.size = size;
      return makeCall('GET', '/api/sso-admin/user', '', filterModel)
        .then(function (data) {
          _.remove(data.items, {id: authService.getUser().id});
          return data;
        });
    };

    service.getUserDetails = function (userId) {
      return makeCall('GET', '/api/sso-admin/user/' + userId);
    };

    service.addUser = function (user) {
      return makeCall('POST', '/api/sso-admin/user/', user); 
    };

    return service;
  }

})();
