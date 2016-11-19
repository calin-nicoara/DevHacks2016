(function() {

  'use strict';
  angular.module('eCarrefour.client')
    .factory('clientService', clientService);

  function clientService($http) {
    var service = {};

    var makeCall = function (verb, url, data, params) {
      var base = '';
      return $http({
                     method: verb,
                     data: data,
                     url: base + url,
                     params: params
                   })
        .then(function (reply) {
          return reply.data;
        });
    };

    service.list = function (page, size, filterModel) {
      if (angular.isUndefined(filterModel)) {
        filterModel = {
          page: 0,
          size: 10
        };
      }

      filterModel.page = page - 1;
      filterModel.size = size;

      return makeCall('GET', '/api/client/', '', filterModel);
    };

    service.getOne = function (id) {
      return makeCall('GET', '/api/client/' + id);
    };

    service.getClientAddressList = function (id) {
      return makeCall('GET', '/api/client/' + id + '/address');
    };

    return service;
  }

})();
