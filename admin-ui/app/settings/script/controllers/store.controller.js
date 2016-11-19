(function () {

  'use strict';
  angular.module('eCarrefour.settings')
    .controller('StoreController', storeController)
    .controller('StoreLocationsController', storeLocationsController);

  function storeController(settingsService, storeData, storeService) {
    var vm = this;

    vm.storeData = storeData;
    vm.storeInfoMap = {
      'name': 'Store name',
      'address': 'Store address',
      'iban': 'IBAN'
    };
    vm.storeInfoEdit = {
      enabled: false,
      edit: function () {
        vm.storeData.backup = _.cloneDeep(vm.storeData);
        vm.storeInfoEdit.enabled = true;
      },
      cancel: function () {
        vm.storeInfoEdit.enabled = false;
        vm.storeData = _.cloneDeep(vm.storeData.backup);
      },
      save: function () {
        settingsService.putStoreInfo(vm.storeData.id, vm.storeData)
          .then(function () {
            vm.storeInfoEdit.enabled = false;
            vm.storeData.backup = undefined;
            storeService.changeStore(vm.storeData.id, vm.storeData);
          });

      }
    };

    return vm;
  }

  function storeLocationsController(settingsService, ngTableService) {
    var vm = this;

    var scopeFunctions = {};
    var isEditableLocation = {};

    var validators = {
      name: false,
      zipCodePattern: false
    };

    var validateRow = {};

    vm.newLocation = {};

    vm.closeLocationPopover = function (attribute) {
      validators[attribute] = false;
    };

    vm.isValidLocation = function (attribute) {
      return validators[attribute];
    };

    vm.addLocation = function () {

      if (!isValidDefined(vm.newLocation, validators)) {
        return;
      }

      var location = {
        id: '',
        name: vm.newLocation.name,
        zipCodePattern: vm.newLocation.zipCodePattern || null
      };
      settingsService.saveLocation(location)
        .then(function () {
          ngTableService.reload();
        });
      vm.newLocation = {};
    };

    function isValidDefined(location, validators) {
      var valid = true;

      if (angular.isUndefined(location.name) || location.name === '') {
        validators.name = true;
        valid = false;
      }

      if (angular.isDefined(location.zipCodePattern) || location.zipCodePattern !== null
          || location.zipCodePattern !== '') {

        try {
          new RegExp(location.zipCodePattern);
        }
        catch (err) {
          validators.zipCodePattern = true;
          valid = false;
        }
      }

      return valid;
    }

    function isValidRowDefined(location, validators) {
      var valid = true;
      if (angular.isUndefined(location.name) || location.name === '') {
        validators[location.id].name = true;
        valid = false;
      }

      if (angular.isDefined(location.zipCodePattern) || location.zipCodePattern !== null
          || location.zipCodePattern !== '') {

        try {
          new RegExp(location.zipCodePattern);
        }
        catch (err) {
          validators[location.id].zipCodePattern = true;
          valid = false;
        }
      }

      return valid;

    }

    scopeFunctions.closeLocationRowPopover = function (id, attribute) {
      validateRow[id][attribute] = false;
    };

    scopeFunctions.getValidLocation = function (id, attribute) {
      return validateRow[id][attribute];
    };

    scopeFunctions.editRowLocation = function (elem, editElements) {
      isEditableLocation[elem.id] = true;
      editElements[elem.id] = _.cloneDeep(elem);
    };

    scopeFunctions.deleteRowLocation = function (location) {
      settingsService.deleteLocation(location.id)
        .then(function () {
          ngTableService.reload();
          isEditableLocation[location.id] = false;
        });
    };

    scopeFunctions.cancelRowLocation = function (location) {
      validateRow[location.id]['name'] = false;
      validateRow[location.id]['zipCodePattern'] = false;
      isEditableLocation[location.id] = false;
    };

    scopeFunctions.saveRowLocation = function (location) {
      if (!isValidRowDefined(location, validateRow)) {
        return;
      }

      settingsService.saveLocation(location)
        .then(function () {
          isEditableLocation[location.id] = false;
          ngTableService.reload();
        });
    };

    scopeFunctions.isEditableRow = function (id) {
      return isEditableLocation[id];
    };

    vm.storeLocations = {
      columns: [
        {
          title: 'Id',
          field: 'id'
        },
        {
          title: 'Location',
          getValue: function (row) {
            return '<span ng-show="!scopeFunctions.isEditableRow(' + row.id + ')" >' + row.name
                   + '</span>'
                   + '<span ng-show="scopeFunctions.isEditableRow(' + row.id + ')">'
                   + '<input type="text" ng-model="scopeVariables.editRow[item.id].name"'
                   + 'ng-click="scopeFunctions.closeLocationRowPopover(item.id, \'name\')">&nbsp;'
                   + '<md-tooltip md-visible="scopeFunctions.getValidLocation(item.id, \'name\')"'
                   + ' md-direction="top">Name is required </md-tooltip>'
                   + '</span>';
          }
        },
        {
          title: 'Zip Code Pattern',
          getValue: function (row) {
            return '<span ng-show="!scopeFunctions.isEditableRow(item.id)" >{{item.zipCodePattern || \'\'}}</span>'
                   + '<span ng-show="scopeFunctions.isEditableRow(' + row.id + ')"> '
                   + '<input type="text" ng-model="scopeVariables.editRow[item.id].zipCodePattern" '
                   + 'ng-click="scopeFunctions.closeLocationRowPopover(item.id, \'zipCodePattern\')">&nbsp;'
                   + '<md-tooltip md-visible="scopeFunctions.getValidLocation(item.id, \'zipCodePattern\')"'
                   + ' md-direction="top">This is not a valid Regular Expression</md-tooltip>'
                   + '</span>';
          }
        },
        {
          title: 'Edit',
          field: 'edit',
          getValue: function () {
            return '<button ng-show="!scopeFunctions.isEditableRow(item.id)" class="btn btn-primary" '
                   + 'ng-click = "scopeFunctions.editRowLocation(item, scopeVariables.editRow)"> Edit </button >'
                   + '<button class = "btn btn-success" ng-show = "scopeFunctions.isEditableRow(item.id)" '
                   + 'ng-click = "scopeFunctions.saveRowLocation(scopeVariables.editRow[item.id])"> Save </button >'
                   + '<button class = "btn btn-primary" ng-show ="scopeFunctions.isEditableRow(item.id)" '
                   + 'ng-click="scopeFunctions.cancelRowLocation(item)"> Cancel </button >'
                   + '<button class="btn btn-danger" ng-click="scopeFunctions.deleteRowLocation(item)" > Delete </button>';
          }
        }
      ],
      getData: function (page, size, filter) {
        return settingsService.locationList(page, size, filter)
          .then(function (data) {
            var validate = {};
            _.forEach(data.items, function (elem) {
              validate[elem.id] = {
                name: false,
                zipCodePattern: false
              };
            });
            validateRow = validate;
            return data;
          });
      },
      scopeFunctions: scopeFunctions,
      scopeVariables: {
        editRow: {}
      }
    };

    return vm;
  }
})();
