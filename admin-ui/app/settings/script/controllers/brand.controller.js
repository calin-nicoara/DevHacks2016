(function () {

  'use strict';
  angular.module('eCarrefour.settings')
    .controller('BrandController', brandController);

  function brandController(settingsService, ngTableService, $log) {
    var vm = this;

    var scopeFunctions = {};
    var isEditableBrand = {};
    var validateBrandName = false;
    var validateRowName = {};

    vm.newBrand = {};

    vm.closeBrandPopover = function () {
      validateBrandName = false;
    };

    vm.isValidBrandName = function () {
      return validateBrandName;
    };

    vm.addBrand = function () {

      if (angular.isUndefined(vm.newBrand.name) || vm.newBrand.name === '') {
        validateBrandName = true;
        return;
      }

      var brand = {
        id: '',
        name: vm.newBrand.name
      };
      settingsService.saveBrand(brand)
        .then(function () {
          ngTableService.reload();
        });
      vm.newBrand = {};
    };

    scopeFunctions.closeBrandRowPopover = function (id) {
      validateRowName[id] = false;
    };

    scopeFunctions.getValidBrandName = function (id) {
      return validateRowName[id];
    };

    scopeFunctions.editRowBrand = function (id) {
      isEditableBrand[id] = true;
    };

    scopeFunctions.cancelRowBrand = function (id) {
      isEditableBrand[id] = false;
    };

    scopeFunctions.saveRowBrand = function (id, name) {

      if (angular.isUndefined(name) || name === '') {
        validateRowName[id] = true;
        return;
      }

      var currentBrand = {
        id: id,
        name: name
      };
      settingsService.saveBrand(currentBrand).then(function () {
        ngTableService.reload();
      })
        .catch(function (err) {
          $log.error(new Error(err.status || err.statusCode || err.message
                               || 'Connection Error', err.data));
        })
        .finally(function () {
          isEditableBrand[id] = false;
        });
    };

    scopeFunctions.isEditableRow = function (id) {
      return isEditableBrand[id];
    };

    scopeFunctions.deleteRow = function (id) {
      settingsService.deleteBrand(id)
        .then(function () {
          ngTableService.reload();
        })
        .catch(function (err) {
          $log.error(new Error(err.status || err.statusCode || err.message
                               || 'Connection Error', err.data));
        })
        .finally(function () {
          isEditableBrand[id] = false;
        });

    };

    vm.columns = [
      {
        title: 'Id',
        field: 'id'
      },
      {
        title: 'Brand Name',
        field: 'name',
        filter: {
          name: 'text'
        },
        getValue: function (row) {
          return '<span ng-show="!scopeFunctions.isEditableRow(' + row.id + ')" >' + row.name
                 + '</span>'
                 + '<span ng-show="scopeFunctions.isEditableRow(' + row.id + ')"> '
                 + '<input type="text" ng-model="scopeVariables.currentBrandName[' + row.id
                 + ']"  uib-popover="Name is required" '
                 + 'popover-placement="top-left" '
                 + 'popover-trigger="none" '
                 + 'popover-is-open="scopeFunctions.getValidBrandName(' + row.id + ')" '
                 + 'ng-click="scopeFunctions.closeBrandRowPopover(' + row.id + ')">&nbsp;'
                 + '<button class="btn btn-success" ng-click="scopeFunctions.saveRowBrand('
                 + row.id + ', scopeVariables.currentBrandName[' + row.id
                 + '])"> Save </button>&nbsp;'
                 + '<button class="btn btn-danger" ng-click="scopeFunctions.deleteRow('
                 + row.id + ')"> Delete </button>&nbsp;'
                 + '<button class="btn btn-primary" ng-click="scopeFunctions.cancelRowBrand('
                 + row.id + ')"> Cancel </button>'
                 + '</span>';
        }
      },
      {
        title: 'Edit',
        field: 'edit',
        getValue: function (row) {
          return '<button ng-show="!scopeFunctions.isEditableRow(' + row.id
                 + ')" class="btn btn-primary" '
                 + 'ng-click="scopeVariables.currentBrandName[' + row.id
                 + ']=item.name; scopeFunctions.editRowBrand(' + row.id
                 + ')"> Edit  </button>';
        }
      }
    ];

    vm.getData = function (page, size, filter) {
      return settingsService.brandList(page, size, filter);
    };
    vm.scopeFunctions = scopeFunctions;
    vm.scopeVariables = {
      currentBrandName: {}
    };

    return vm;
  }
})();
