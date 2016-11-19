(function () {
  'use strict';

  angular.module('eCarrefour.settings')
    .controller('SettingsController', settingsController);

  function settingsController($state) {
    var vm = this;

    vm.viewList = [
      {
        name: 'publish',
        title: 'Publish condition'
      },
      {
        name: 'tax',
        title: 'Taxes'
      },
      {
        name: 'brand',
        title: 'Brands'
      },
      {
        name: 'store',
        title: 'Store info'
      },
      {
        name: 'price_stock',
        title: 'Price and Stock'
      },
      {
        name: 'delivery',
        title: 'Delivery rules'
      },
      {
        name: 'maintenance',
        title: 'Maintenance'
      }
    ];

    vm.isActiveTab = function (viewName) {
      return $state.current.name === viewName;
    };

    return vm;

  }
})();

