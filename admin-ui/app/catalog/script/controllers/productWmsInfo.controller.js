(function (angular, _) {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductWmsInfoController', productWmsInfoController);

  function productWmsInfoController(wmsInfo, wmsService) {
    var vm = this;

    var backupData = {};

    function getSectionsForZone(zoneId) {
      wmsService.getSectionList(zoneId, 1, 10000)
        .then(function (sectionListModel) {
          vm.sections = sectionListModel.items;
          vm.sections.unshift({
                                id: null,
                                name: 'Select a section'
                              });
        });
    }

    function initialize() {
      vm.pcbDetails = wmsInfo.pcbDetails;
      vm.zones = wmsInfo.zones;
      vm.zones.unshift({
                         id: null,
                         name: 'Select a zone'
                       });
      vm.dlc = wmsInfo.dlc;
      vm.sections = [];
      if (vm.pcbDetails.zoneId !== null) {
        vm.sections = wmsInfo.sections;
        vm.sections.unshift({
                              id: null,
                              name: 'Select a section'
                            });
      }
    }

    initialize();

    vm.editDisabled = true;

    vm.validatePcbMap = {
      'productCode': {
        title: 'Product Code'
      },
      'length': {
        inputType: 'number',
        title: 'Length (cm)'
      },
      'width': {
        inputType: 'number',
        title: 'Width (cm)'
      },
      'height': {
        inputType: 'number',
        title: 'Height (cm)'
      },
      'volume': {
        title: 'Volume (cm3)'
      },
      'weight': {
        inputType: 'number',
        title: 'Weight (kg)'
      }
    };

    vm.saveInfo = function () {
      setVolume(vm.pcbDetails);
      wmsService.saveProductWmsInfo(vm.pcbDetails, vm.dlc)
        .then(function (reply) {
          if (reply.errors.length === 0) {
            vm.pcbDetails.id = reply.id;
            vm.editDisabled = true;
          }
        });
    };

    vm.enableEdit = function () {
      backupData.pcbDetails = _.clone(vm.pcbDetails);
      backupData.zones = _.clone(vm.zones);
      backupData.sections = _.clone(vm.sections);
      backupData.dlc = _.clone(vm.dlc);

      vm.editDisabled = false;
    };

    vm.cancelEdit = function () {
      vm.pcbDetails = backupData.pcbDetails;
      vm.zones = backupData.zones;
      vm.sections = backupData.sections;
      vm.dlc = backupData.dlc;

      vm.editDisabled = true;
    };

    vm.selectZone = function () {
      vm.pcbDetails.sectionId = null;
      if (vm.pcbDetails.zoneId === null) {
        vm.sections.length = 0;
      }
      else {
        getSectionsForZone(vm.pcbDetails.zoneId);
      }
    };

    var setVolume = function (pcbInfo) {
      if (pcbInfo.length !== null && pcbInfo.width !== null && pcbInfo.height !== null) {
        pcbInfo.volume = pcbInfo.length * pcbInfo.width * pcbInfo.height;
      } else {
        pcbInfo.volume = null;
      }
    };

    return vm;
  }

})(angular, _);
