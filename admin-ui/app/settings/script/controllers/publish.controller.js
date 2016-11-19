(function () {

  'use strict';
  angular.module('eCarrefour.settings')
    .controller('PublishController', publishController);

  function publishController(settingsService, $log) {
    var vm = this;

    vm.publishData = {};
    vm.editPublishSettings = false;

    var editPublishSettingsModel = {};

    vm.enablePublishSettingsEdit = function () {
      editPublishSettingsModel = _.cloneDeep(vm.publishData.optional);
      vm.editPublishSettings = true;
    };

    vm.cancelPublishSettingsInfo = function () {
      vm.editPublishSettings = false;
      vm.publishData.optional = editPublishSettingsModel;

      editPublishSettingsModel = null;
    };

    vm.savePublishSettingsInfo = function () {
      settingsService.savePublishSettings(vm.publishData.optional)
        .then(function () {
                vm.editPublishSettings = false;
                editPublishSettingsModel = null;
              }).catch(function (err) {
                         $log.error(new Error(err.status || err.statusCode || err.message
                                              || 'Connection Error', err.data));
                       });

    };

    function getPublishData() {
      settingsService.getPublishSettings()
        .then(function (settings) {
                var data = _.chain(settings)
                  .orderBy('id')
                  .groupBy('mandatory')
                  .value();
                vm.publishData.mandatory = data[true];
                vm.publishData.optional = data[false];

              });
    }

    getPublishData();

    return vm;
  }
})();
