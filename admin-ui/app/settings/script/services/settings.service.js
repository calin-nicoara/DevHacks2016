(function () {
  'use strict';
  angular.module('eCarrefour.settings')
    .factory('settingsService', settingsService);

  function settingsService($http) {
    var service = {};

    var makeCall = function (verb, url, data, params, toastActive) {
      var base = '/api';
      return $http({
        method: verb,
        data: data,
        url: base + url,
        params: params,
        toastActive: toastActive
      })
        .then(function (reply) {
                return reply.data;
              });
    };

    service.getPublishSettings = function () {
      return makeCall('GET', '/catalog/product/settings/publish');
    };

    service.savePublishSettings = function (publishSettingModels) {
      return makeCall('POST', '/catalog/product/settings/publish', publishSettingModels);
    };

    service.getTaxes = function () {
      return makeCall('GET', '/cart/tax');
    };

    service.updateEnableStatus = function (taxModel) {
      return makeCall('PUT', '/cart/tax/enabled', taxModel);
    };

    service.saveTaxInfo = function (model) {
      return makeCall('PUT', '/cart/tax/' + model.id, model);
    };

    service.saveTaxInfoTaxCode = function (model) {
      return makeCall('PUT', '/cart/tax/taxCode', model);
    };

    service.deleteTax = function (model) {
      return makeCall('DELETE', '/cart/tax/' + model.id);
    };

    service.createTax = function (model) {
      return makeCall('POST', '/cart/tax', model);
    };

    service.brandList = function (page, size, filterModel) {
      if (angular.isUndefined(filterModel)) {
        filterModel = {
          page: 0,
          size: 5
        };
      }

      filterModel.page = page - 1;
      filterModel.size = size;
      return makeCall('GET', '/catalog/brand/list', '', filterModel);
    };

    service.saveBrand = function (model) {
      return makeCall('POST', '/catalog/brand', model);
    };

    service.getBrand = function (model) {
      return makeCall('GET', '/catalog/brand?brand_id=' + model);
    };

    service.deleteBrand = function(id) {
      return makeCall('DELETE', '/catalog/brand/' + id);
    };

    service.getStoreInfo = function () {
      return makeCall('GET', '/delivery/storeInfo');
    };

    service.putStoreInfo = function (storeInfoId, storeInfoModel) {
      return makeCall('PUT', '/delivery/store/' + storeInfoId, storeInfoModel);
    };

    service.getDeliveryRules = function () {
      return makeCall('GET', '/delivery/rules');
    };

    service.putDeliveryRules = function (deliveryRuleModel) {
      return makeCall('PUT', '/delivery/rules', deliveryRuleModel);
    };

    service.excludedDateList = function (page, size, filterModel) {
      if (angular.isUndefined(filterModel)) {
        filterModel = {
          page: 0,
          size: 5
        };
      }

      filterModel.page = page - 1;
      filterModel.size = size;
      return makeCall('GET', '/delivery/excludedDate', '', filterModel);
    };

    service.putExcludedDate = function (excludedDateModel) {
      return makeCall('PUT', '/delivery/excludedDate', excludedDateModel);
    };

    service.deleteExcludedDate = function (excludedDateId) {
      return makeCall('DELETE', '/delivery/excludedDate?excluded_date_id=' + excludedDateId);
    };

    service.putDeliveryTimeInterval = function (start, end) {
      return makeCall('PUT', '/delivery/timeInterval?start=' + start + '&end=' + end, null);
    };

    service.saveDeliveryTimeInterval = function (timeInterval) {
      return makeCall('POST', '/delivery/timeInterval', timeInterval);
    };

    service.getStockSettings = function () {
      return makeCall('GET', '/stock/settings');
    };

    service.putStockSettings = function (stockSettingsId, stockSettingsModel) {
      return makeCall('PUT', '/stock/settings/' + stockSettingsId, stockSettingsModel);
    };

    service.getPriceSettings = function () {
      return makeCall('GET', '/catalog/product/settings/price');
    };

    service.putPriceSettings = function (priceSettingsId, priceSettingsModel) {
      return makeCall('PUT', '/catalog/product/settings/price/' + priceSettingsId, priceSettingsModel);
    };

    service.locationList = function (page, size, filterModel) {
      if (angular.isUndefined(filterModel)) {
        filterModel = {
          page: 0,
          size: 5
        };
      }

      filterModel.page = page - 1;
      filterModel.size = size;
      return makeCall('GET', '/delivery/location/list', '', filterModel);
    };

    service.saveLocation = function (model) {
      return makeCall('POST', '/delivery/location', model);
    };

    service.getLocation = function (model) {
      return makeCall('GET', '/delivery/location?location_id=' + model);
    };

    service.deleteLocation = function (model) {
      return makeCall('DELETE', '/delivery/location?location_id=' + model);
    };

    service.getMaintenanceInfo = function() {
      return makeCall('GET', '/setting/maintenance');
    };

    service.setMaintenanceSettings = function(model) {
      return makeCall('POST', '/setting/maintenance', model);
    };

    return service;
  }

})();
