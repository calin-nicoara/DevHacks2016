(function () {

  'use strict';
  angular.module('eCarrefour.report').factory('reportService', reportService);

  function reportService($http, toastr, reportDownloadUrlService) {
    var service = {};

    var makeCall = function (verb, url, data, params) {
      var base = '/api/report';
      return $http({
                     method: verb,
                     data: data,
                     url: base + url,
                     params: params
                   })
        .then(function (reply) {
          setDownloadUrl(reply);
          return reply.data;
        });
    };

    function setDownloadUrl(reply) {
      var query = [];
      _.forEach(reply.config.params || {}, function (value, key) {
        if (key !== 'page' && key !== 'size') {
          query.push([key, value].join('='));
        }
      });
      var queryStr = query.join('&');
      var fullPath = reply.config.url + '?' + queryStr;
      fullPath = fullPath.replace('/report', '/report/download');
      reportDownloadUrlService.setDownloadUrl(encodeURI(fullPath));
    }

    service.getProductTraceList = function (page, size, filterModel) {
      filterModel.page = (page || 1) - 1;
      filterModel.size = size || 10;
      return makeCall('GET', '/article-trace', '', filterModel);
    };

    service.getProductInOrderList = function (page, size, filterModel) {
      filterModel.page = (page || 1) - 1;
      filterModel.size = size || 10;
      return makeCall('GET', '/product-in-order', '', filterModel);
    };

    service.getOrderCommentReportList = function (page, size, filterModel) {
      filterModel.page = (page || 1) - 1;
      filterModel.size = size || 10;
      return makeCall('GET', '/order-comment', '', filterModel);
    };

    service.getSalesList = function (page, size, filterModel) {
      filterModel.page = (page || 1) - 1;
      filterModel.size = size || 10;
      return makeCall('GET', '/sales', '', filterModel);
    };

    service.getClientStatusReport = function (page, size, filterModel) {
      filterModel.page = (page || 1) - 1;
      filterModel.size = size || 10;
      return makeCall('GET', '/client-status', '', filterModel);
    };

    service.getMaximumAddressesForClient = function () {
      return makeCall('GET', '/client-status/number-max-addresses', '', null);
    };

    service.sendDownloadRequest = function (reportPath) {
      return makeCall('POST', '/download/' + reportPath)
        .then(function () {
          toastr.success('Your report is being generated',
                         'Success', {
                           timeOut: 0
                         });
        });
    };

    return service;
  }

})();
