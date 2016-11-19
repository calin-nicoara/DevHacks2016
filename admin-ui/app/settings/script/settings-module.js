(function () {
  'use strict';
  angular
    .module('eCarrefour.settings', [])
    .config(config);

  function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/settings', '/settings/publish');

    var settingsState = {
      name: 'settings',
      url: '/settings',
      templateUrl: 'views/settings.html',
      controller: 'SettingsController',
      controllerAs: 'settingsCtrl',
      hideNavbar: false,
      title: 'Settings',
      data: {
        roles: (function () {
          return ['ROLE_ADMIN'];
        })()
      }
    };

    var publishState = {
      name: 'publish',
      parent: 'settings',
      url: '/publish',
      templateUrl: 'views/settingsTabs/publishTab.html',
      controller: 'PublishController',
      controllerAs: 'publishCtrl'
    };

    var taxState = {
      name: 'tax',
      parent: 'settings',
      url: '/tax',
      templateUrl: 'views/settingsTabs/taxesTab.html',
      controller: 'TaxController',
      controllerAs: 'taxCtrl'
    };

    var brandState = {
      name: 'brand',
      parent: 'settings',
      url: '/brand',
      templateUrl: 'views/settingsTabs/brandsTab.html',
      controller: 'BrandController',
      controllerAs: 'brandCtrl'
    };

    var storeState = {
      name: 'store',
      parent: 'settings',
      url: '/store',
      resolve: {
        storeData: ['settingsService', function(settingsService) {
          return settingsService.getStoreInfo();
        }]
      },
      views: {
        'locations@store': {
          templateUrl: 'views/settingsTabs/storeDetailsTabLocations.html',
          controller: 'StoreLocationsController as vm'
        },
        'storeInfo@store': {
          templateUrl: 'views/settingsTabs/storeDetailsTabStore.html',
          controller: 'StoreController as vm'
        },
        '': {
          template: '<div ui-view="storeInfo"></div>' 
                    + '<div ui-view="locations"></div>'
        }
      }
    };

    var productState = {
      name: 'price_stock',
      parent: 'settings',
      url: '/price_stock',
      templateUrl: 'views/settingsTabs/priceStockSettingsTab.html',
      controller: 'PriceStockController',
      controllerAs: 'priceStockCtrl'
    };

    var deliveryState = {
      name: 'delivery',
      parent: 'settings',
      url: '/delivery',
      templateUrl: 'views/settingsTabs/deliveryRulesTab.html',
      controller: 'DeliveryController',
      controllerAs: 'deliveryCtrl'
    };

    var maintenanceState = {
      name: 'maintenance',
      parent: 'settings',
      url: '/maintenance',
      templateUrl: 'views/settingsTabs/maintenanceTab.html',
      controller: 'MaintenanceController',
      controllerAs: 'maintenanceCtrl'
    };

    $stateProvider
      .state(settingsState)
      .state(publishState)
      .state(taxState)
      .state(brandState)
      .state(storeState)
      .state(productState)
      .state(deliveryState)
      .state(maintenanceState);

  }

})();
