(function () {

  'use strict';
  angular.module('eCarrefourWeb').directive('customNavBar', navbarDirective);

  function navbarDirective() {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/navbar.html',
      controller: navbarController,
      controllerAs: 'navCtrl'
    };

    function navbarController($scope, authService, storeService, $state) {
      var vm = this;

      var permissions = {
        catalog: ['ROLE_ADMIN', 'ROLE_WMS_ADMIN'],
        clientList: ['ROLE_ADMIN', 'ROLE_COORD'],
        orderList: ['ROLE_COORD', 'ROLE_PICKER'],
        productList: ['ROLE_ADMIN', 'ROLE_WMS_ADMIN'],
        usersList: ['ROLE_ADMIN'],
        alerts: ['ROLE_COORD', 'ROLE_PICKER', 'ROLE_ADMIN', 'ROLE_WMS_ADMIN'],
        settings: ['ROLE_ADMIN'],
        zoneList: ['ROLE_WMS_ADMIN'],
        validation: ['ROLE_COORD', 'ROLE_ADMIN'],
        report: ['ROLE_ADMIN']
      };

      vm.tabs = {
        zoneList: {
          title: 'Zones',
          baseUrl: [
            'zone',
            'zone_details',
            'section_list',
            'rack_list',
          ]
        },
        catalog: {
          title: 'Catalog',
          baseUrl: ['catalog']
        },
        clientList: {
          title: 'Clients',
          baseUrl: ['clients']
        },
        orderList: {
          title: 'Orders',
          baseUrl: [
            'orders',
            'order',
            'prepare',
            'order_details',
            'order_history',
            'order_products'
          ]
        },
        productList: {
          title: 'Products',
          baseUrl: [
            'product',
            'product_details',
            'details_meti',
            'product_price',
            'product_images',
            'product_categories',
            'product_attributes',
            'product_publish_status',
            'product_ean_list',
            'product_pcb_dimensions',
            'product_list',
            'main_product_list',
            'product_assign_list',
            'product_unpublished_list'
          ]
        },
        usersList: {
          title: 'Users',
          baseUrl: ['user']
        },
        settings: {
          title: 'Settings',
          baseUrl: [
            'settings',
            'publish',
            'tax',
            'brand',
            'store',
            'price_stock',
            'delivery'
          ]
        },
        validation: {
          title: 'Validations',
          baseUrl: ['validation']
        },
        report: {
          title: 'Reporting',
          baseUrl: [
            'report',
            'product-trace',
            'order-comment',
            'product-in-order',
            'client-status',
            'sales'
          ]
        }
      };
      vm.user = null;

      vm.isActive = isActive;
      vm.hasRightsFor = hasRightsFor;
      vm.isCurrentStore = isCurrentStore;
      vm.clickStore = clickStore;
      vm.getStores = getStores;
      vm.logout = authService.logout;

      function isActive(baseUrls) {
        var url = $state.current.url.split('/')[1];
        return _.indexOf(baseUrls, url) > -1;
      }

      function hasRightsFor(tab) {
        return authService.isInRole(permissions[tab]);
      }

      function isCurrentStore(store) {
        return store.code === storeService.currentStore.code;
      }

      function clickStore(store, event) {
        event.stopPropagation();
        if (store) {
          storeService.setCurrentStore(store.code);
        }
      }

      function getStores() {
        return _.filter(storeService.getStores(), function (store) {
          return _.includes(vm.user.stores, store.code);
        });
      }

      var unWatchUser = $scope.$watch(authService.getUser, function (newVal) {
        vm.user = newVal;
      });

      $scope.$on('$destroy', function () {
        unWatchUser();
      });

      return vm;

    }
  }

})();
