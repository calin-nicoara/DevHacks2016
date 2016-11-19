(function () {

  'use strict';

  angular.module('eCarrefour.alert').controller('ValidationController', validationController);

  function validationController($scope, $location, catalogService, ngTableService) {

    var vm = this;

    $scope.data = {};

    vm.selectedRows = [];

    vm.postPriceValidation = function(selectedRows, status) {
      var postModel = {
        'price_validation_ids': _.map(selectedRows, 'id'),
        'price_validation_status': status
      };
      catalogService.postPriceValidation(postModel)
        .then(function() {
          vm.selectedRows.length = 0;
          ngTableService.reload();
        });
    };

    var getPriceValidationInfo = function () {
      $scope.data = null;
      var columns = [
        {
          title: 'Product Name',
          field: 'product_site_name',
          show: true
        },
        {
          title: 'Meti Stock',
          field: 'meti_stock',
          show: true
        },
        {
          title: 'Product Code',
          field: 'product_code',
          show: true
        },
        {
          title: 'Current Price',
          field: 'current_price',
          show: true
        },
        {
          title: 'New Price',
          field: 'new_price',
          show: true
        },
        {
          title: 'Percentage Difference',
          field: 'percentage_difference',
          show: true
        },
        {
          title: 'Actions',
          field: 'details',
          show: true,
          getValue: function () {
            return '<a class="btn btn-default" href="" ui-sref="product({id:item.product_code})">Details</a>';
          }
        }

      ];
      return {
        getData: catalogService.getPriceValidationList,
        columns: columns
      };
    };

    $scope.tabList = [
      {
        title: 'Price Validation',
        url: 'views/validationTabs/priceValidationTab.html',
        data: getPriceValidationInfo(),
        query: {
          tab: 1
        }
      }
    ];

    $scope.queryParams = $location.search();
    $scope.currentTab = $scope.tabList[$scope.queryParams.tab - 1];

    return vm;

  }




})();
