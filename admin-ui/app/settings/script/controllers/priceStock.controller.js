(function () {

  'use strict';
  angular.module('eCarrefour.settings')
    .controller('PriceStockController', priceStockController);

  function priceStockController(settingsService, toastr, $log) {
    var vm = this;

    vm.dataStock = {};
    vm.dataPrice = {};

    vm.stockSettingsMap = {
      'stock_availability_percentage': 'Stock availability percentage'
    };

    vm.stockSettingsEdit = {
      enabled: false,
      edit: function () {
        vm.dataStock.backup = _.cloneDeep(vm.dataStock);
        vm.stockSettingsEdit.enabled = true;
      },
      cancel: function () {
        vm.stockSettingsEdit.enabled = false;
        vm.dataStock = _.cloneDeep(vm.dataStock.backup);
      },
      save: function () {
        if (vm.stockSettingsEdit.valid(vm.dataStock)) {
          settingsService.putStockSettings(vm.dataStock.id, vm.dataStock)
            .then(function () {
                    vm.stockSettingsEdit.enabled = false;
                    vm.dataStock.backup = undefined;
                  }).catch(function (err) {
                             $log.error(new Error(err.status || err.statusCode || err.message
                                                  || 'Connection Error', err.data));
                           });
        } else {
          toastr.warning('Invalid percentage. Must be less than 100.', 'Warning');
          return false;
        }
      },
      valid: function (model) {
        return model.stock_availability_percentage <= 100;
      }
    };

    vm.priceSettingsMap = {
      'price_threshold': 'Threshold for updating price(%)'
    };
    vm.priceSettingsEdit = {
      enabled: false,
      edit: function () {
        vm.dataPrice.backup = _.cloneDeep(vm.dataPrice);
        vm.priceSettingsEdit.enabled = true;
      },
      cancel: function () {
        vm.priceSettingsEdit.enabled = false;
        vm.dataPrice = _.cloneDeep(vm.dataPrice.backup);
      },
      save: function () {
        if (vm.priceSettingsEdit.valid(vm.dataPrice)) {
          settingsService.putPriceSettings(vm.dataPrice.id, vm.dataPrice)
            .then(function () {
                    vm.priceSettingsEdit.enabled = false;
                    vm.dataPrice.backup = undefined;
                  }).catch(function (err) {
                             $log.error(new Error(err.status || err.statusCode || err.message
                                                  || 'Connection Error', err.data));
                           });
        } else {
          toastr.warning('Invalid percentage. Must be less than 100.', 'Warning');
          return false;
        }
      },
      valid: function (model) {
        return model.price_threshold >= 0;
      }
    };

    function getStockSettings() {
      settingsService.getStockSettings()
        .then(function (data) {
                vm.dataStock = data;
              });
    }

    function getPriceSettings() {
      settingsService.getPriceSettings()
        .then(function (data) {
                vm.dataPrice = data;
              });
    }

    getPriceSettings();
    getStockSettings();

    return vm;

  }
})();
