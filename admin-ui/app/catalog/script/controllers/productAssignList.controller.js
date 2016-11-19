(function () {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductAssignListController', productAssignListController);

  function productAssignListController(productService) {
    var vm = this;

    vm.columns = [
      {
        title: 'Meti Name (Product Name)',
        field: 'metiName',
        sortable: 'productName'
      },
      {
        title: 'Meti Code (Product Code)',
        field: 'metiCode',
        sortable: 'productCode',
        filter: {productCode: 'text'}
      },
      {
        title: 'Department Name',
        field: 'departmentName',
        filter: {departmentName: 'text'},
        sortable: 'productDetails.departmentName'
      },
      {
        title: 'Rayon Name',
        field: 'rayonName',
        filter: {rayonName: 'text'},
        sortable: 'productDetails.rayonName'
      },
      {
        title: 'Family Name',
        field: 'familyName',
        filter: {familyName: 'text'},
        sortable: 'productDetails.familyName'
      },
      {
        title: 'Sub Family Name',
        field: 'subFamilyName',
        filter: {subFamilyName: 'text'},
        sortable: 'productDetails.subFamilyName'
      },
      {
        title: 'UB Name',
        field: 'ubName',
        filter: {ubName: 'text'},
        sortable: 'productDetails.ubName'
      },
      {
        title: 'Categories',
        field: 'categoryPaths',
        filter: {
          onlyUnassigned: 'select'
        },
        filterData: [{id: true, title: 'Only Unassigned'}, {id: false, title: 'All'}],
        getValue: function () {
          return '<div ng-if="item.categoryPaths.length > 0" ng-repeat="path in item.categoryPaths">{{path.fullTreePath}}</div>'
                 + '<div ng-if="item.categoryPaths.length === 0">Unassigned</div>';

        }

      },

      {
        title: 'Details',
        getValue: function (row) {
          return '<a class="btn btn-default" href="" ui-sref="product({id:'
                 + row.metiCode + '})">Details</a>';
        }
      }
    ];

    vm.getData = productService.list;
    
    return vm;
  }

})();
