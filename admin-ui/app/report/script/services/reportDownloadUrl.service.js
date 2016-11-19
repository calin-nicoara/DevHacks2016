(function () {

  'use strict';
  angular.module('eCarrefour.report').factory('reportDownloadUrlService', reportDownloadUrlService);

  function reportDownloadUrlService() {
    var service = {};

    var downloadUrl = null;

    service.getDownloadUrl = function () {
      return downloadUrl;
    };

    service.setDownloadUrl = function (url) {
      downloadUrl = url;
    };

    return service;
  }

})();
