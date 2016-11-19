(function () {

  'use strict';
  angular.module('eCarrefour.settings')
    .controller('TaxController', taxController);

  function taxController(settingsService, $log, SweetAlert, toastr) {
    var vm = this;

    vm.taxData = {};

    vm.editTaxAvailable = {};
    vm.editTaxCodeAvailable = {};
    vm.taxCodes = {};
    vm.editTaxModel = {};
    vm.taxTypes = [];

    var taxUnitMap = {
      'TRANSPORT': 'RON',
      'WEIGHT': 'KG'
    };

    vm.getTaxTypeName = function (taxName) {
      taxName = taxName.toLowerCase();
      return taxName.charAt(0).toUpperCase() + taxName.slice(1) + ' Tax' + ' ('
             + taxUnitMap[taxName.toUpperCase()] + ')';
    };

    vm.disabledTaxInputs = function (index, taxes, typeName) {
      return index !== taxes.length - 1 || !vm.editTaxAvailable[typeName];
    };

    vm.disableTaxInferiorLimitInput = function () {
      return true;
    };

    vm.showDeleteTaxButton = function (taxes, tax) {
      return taxes.length > 1 && !tax.isNew;
    };

    vm.saveTaxButtonDisabled = function (tax) {
      return tax.value == null || tax.inferiorLimit == null || tax.superiorLimit == null;
    };

    vm.createTaxButtonAvailable = function (typeName) {
      return typeName !== 'WEIGHT';
    };

    vm.enableTaxEdit = function (type, index) {
      vm.editTaxModel = {
        model: _.cloneDeep(vm.taxData[type][index]),
        type: type,
        index: index
      };
      vm.editTaxAvailable[type] = true;
    };

    vm.enableTaxCodeEdit = function (type) {
      vm.taxCodes.backup = _.cloneDeep(vm.taxCodes);
      vm.editTaxCodeAvailable[type] = true;
    };

    vm.cancelTaxCodeEdit = function (typeName) {
      vm.editTaxCodeAvailable[typeName] = false;
      vm.taxCodes = vm.taxCodes.backup;
    };

    vm.saveTaxCode = function (taxCode, typeName) {
      var model = {
        taxCode: taxCode,
        type: typeName
      };
      settingsService.saveTaxInfoTaxCode(model)
        .catch(function (err) {
                 $log.error(new Error(err.status || err.statusCode || err.message
                                      || 'Connection Error', err.data));
               })
        .finally(function () {
                   vm.editTaxCodeAvailable[typeName] = false;
                 });
    };

    vm.createTax = function (type) {
      vm.taxData[type].push({
        inferiorLimit: _.last(vm.taxData[type]).superiorLimit + 0.01,
        superiorLimit: _.last(vm.taxData[type]).superiorLimit + 0.02,
        enabled: _.last(vm.taxData[type]).enabled,
        value: null,
        type: type,
        isNew: true
      });
      vm.enableTaxEdit(type, vm.taxData[type].length - 1);
    };

    vm.cancelTaxInfo = function () {
      vm.editTaxAvailable = {};
      if (vm.editTaxModel.model.isNew) {
        vm.taxData[vm.editTaxModel.type].splice(vm.editTaxModel.index, 1);
      }
      else {
        vm.taxData[vm.editTaxModel.type][vm.editTaxModel.index] =
          vm.editTaxModel.model;
      }
      vm.editTaxModel = null;
    };

    vm.saveTaxInfo = function () {
      var model = vm.taxData[vm.editTaxModel.type][vm.editTaxModel.index];

      if (isTaxModelValid(model)) {
        if (model.isNew) {
          createNewTax(model);
        }
        else {
          updateTax(model);
        }
      }
    };

    vm.changeTaxEnableStatus = function (type) {
      var newTax = _.cloneDeep(vm.taxData[type][0]);

      if (newTax.enabled === false) {
        SweetAlert.swal(
          {
            title: 'Are you sure you want to disable this tax?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, disable it!',
            closeOnConfirm: false
          },
          function (isConfirm) {
            if (isConfirm) {
              makeCallEnableTax(newTax, type);
            }
            else {
              vm.taxData[type][0].enabled = !vm.taxData[type][0].enabled;
            }
            swal.close();
          });
      }
      else {
        makeCallEnableTax(newTax, type);
      }

    };

    var makeCallEnableTax = function (newTax, type) {
      settingsService.updateEnableStatus(newTax)
        .then(function () {
                _.forEach(vm.taxData[type], function (elem) {
                  elem.enabled = newTax.enabled;
                });

              })
        .catch(function (err) {
                 $log.info('error during enable change', err);
               });
    };

    vm.deleteTax = function (type, model) {
      settingsService.deleteTax(model)
        .then(function () {
                _.remove(vm.taxData[type], {id: model.id});
              })
        .catch(function (err) {
                 $log.info('error during enable change', err);
               });
    };

    var isTaxModelValid = function (model) {
      if (model.value <= 0) {
        toastr.warning('Invalid tax value', 'Warning');
        return false;
      }
      if (model.superiorLimit <= model.inferiorLimit) {
        toastr.warning('Invalid tax limits', 'Warning');
        return false;
      }
      return true;
    };

    var updateTax = function (model) {
      settingsService.saveTaxInfo(model)
        .then(function () {
                vm.editTaxAvailable = {};
                vm.editTaxModel = null;
              }).catch(function (err) {
                         $log.error(new Error(err.status || err.statusCode || err.message
                                              || 'Connection Error', err.data));
                       });
    };

    var createNewTax = function (model) {
      delete model['isNew'];
      settingsService.createTax(model)
        .then(function (res) {
                vm.editTaxAvailable = {};
                vm.editTaxModel = null;
                model.id = res.id;
              }).catch(function (err) {
                         $log.error(new Error(err.status || err.statusCode || err.message
                                              || 'Connection Error', err.data));
                       });
    };

    function getTaxesData() {
      settingsService.getTaxes()
        .then(function (data) {
                vm.taxTypes = [];
                data = _.chain(data)
                  .orderBy('id')
                  .groupBy('type')
                  .value();
                _.forOwn(data, function (value, key) {
                  vm.taxTypes.push(key);
                  vm.taxCodes[key] = value[0].taxCode;
                });
                vm.taxTypes.sort();

                vm.taxData = data;
              });
    }

    getTaxesData();

    return vm;
  }
})();
