(function () {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductMainListController', productMainListController);

  function productMainListController(productService) {
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
        title: 'Title (Site Name)',
        field: 'title'
      },
      {
        title: 'Site Description',
        field: 'description'
      },
      {
        title: 'Site Price',
        field: 'price'
      },
      {
        title: 'Publish Date',
        field: 'publishDateTime',
        getValue: function () {
          return '<div>{{item.publishDateTime.replace("T", " ")}}</div>';
        }
      },
      {
        title: 'Active',
        field: 'enabled',
        getValue: function (row) {
          return '<span class="glyphicon glyphicon-ok icon-accepted" ng-if="' + row.enabled
                 + '"></span>'
                 + '<span class="glyphicon glyphicon-remove icon-rejected" ng-if="'
                 + !row.enabled + '"></span>';
        }
      },
      {
        title: 'Details',
        field: 'details',
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
