(function () {

  'use strict';
  angular.module('eCarrefourWeb').factory('ngTableService', ngTableService);

  function ngTableService() {
    var service = {};

    var params = null;

    service.setParams = function (tableParams) {
      params = tableParams;
    };

    service.reload = function () {
      if(params !== null) {
        params.reload();
      }
    };

    return service;
  }

})();
