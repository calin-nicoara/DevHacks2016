'use strict';
angular.module('eCarrefour.alert').factory('alertService', alertService);

function alertService($http) {
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

  service.list = function (page, size) {
    var filterModel = {
      page: page - 1,
      size: size
    };

    return makeCall('GET', '/api/alert', '', filterModel);
  };

  service.markRead = function (alertId) {
    return makeCall('PUT', 'api/alert/' + alertId, {});
  };

  return service;
}
