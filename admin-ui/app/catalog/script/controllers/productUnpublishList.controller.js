(function () {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductUnpublishedListController', productUnpublishedListController);

  function productUnpublishedListController(productService, publishSettings) {
    var vm = this;

    function isSettingEnabled(field, settings) {
      var publishConditionInfoMapper = {
        hasSiteName: 'PRODUCT_SITE_NAME_FILLED',
        hasImage: 'IMAGE_ATTACHED',
        hasStock: 'STOCK_GREATER_THAN_ZERO',
        hasPrice: 'PRICE_GREATER_THAN_ZERO',
        hasMandatoryCategoryAttributesSet: 'MANDATORY_ATTRIBUTES_FILLED',
        hasCategory: 'ATTACHED_TO_ONE_CATEGORY',
        isEnabled: 'PRODUCT_ENABLED'
      };
      return _.find(settings, {code: publishConditionInfoMapper[field]}).enabled;
    }

    vm.columns = [
      {
        title: 'Meti Name (Product Name)',
        field: 'productName',
        show: true
      },
      {
        title: 'Meti Code (Product Code)',
        field: 'productCode',
        show: true
      },
      {
        title: 'Product State',
        field: 'state',
        show: true
      },
      {
        title: 'Site name Condition',
        field: 'hasSiteName',
        show: isSettingEnabled('hasSiteName', publishSettings),
        getValue: function (row) {
          return '<span class="glyphicon glyphicon-ok icon-accepted" ng-if="'
                 + row.hasSiteName + '"></span>'
                 + '<span class="glyphicon glyphicon-remove icon-rejected" ng-if="'
                 + !row.hasSiteName + '"></span>';
        }
      },
      {
        title: 'Image Condition',
        field: 'hasImage',
        show: isSettingEnabled('hasImage', publishSettings),
        getValue: function (row) {
          return '<span class="glyphicon glyphicon-ok icon-accepted" ng-if="'
                 + row.hasImage + '"></span>'
                 + '<span class="glyphicon glyphicon-remove icon-rejected" ng-if="'
                 + !row.hasImage + '"></span>';
        }
      },
      {
        title: 'Stock Condition',
        field: 'hasStock',
        show: isSettingEnabled('hasStock', publishSettings),
        getValue: function (row) {
          return '<span class="glyphicon glyphicon-ok icon-accepted" ng-if="'
                 + row.hasStock + '"></span>'
                 + '<span class="glyphicon glyphicon-remove icon-rejected" ng-if="'
                 + !row.hasStock + '"></span>';
        }
      },
      {
        title: 'Price Condition',
        field: 'hasPrice',
        show: isSettingEnabled('hasPrice', publishSettings),
        getValue: function (row) {
          return '<span class="glyphicon glyphicon-ok icon-accepted" ng-if="'
                 + row.hasPrice + '"></span>'
                 + '<span class="glyphicon glyphicon-remove icon-rejected" ng-if="'
                 + !row.hasPrice + '"></span>';
        }
      },
      {
        title: 'Mandatory attributes Condition',
        field: 'hasMandatoryCategoryAttributesSet',
        show: isSettingEnabled('hasMandatoryCategoryAttributesSet', publishSettings),
        getValue: function (row) {
          return '<span class="glyphicon glyphicon-ok icon-accepted" ng-if="'
                 + row.hasMandatoryCategoryAttributesSet + '"></span>'
                 + '<span class="glyphicon glyphicon-remove icon-rejected" ng-if="'
                 + !row.hasMandatoryCategoryAttributesSet + '"></span>';
        }
      },
      {
        title: 'Category Condition',
        field: 'hasCategory',
        show: isSettingEnabled('hasCategory', publishSettings),
        getValue: function (row) {
          return '<span class="glyphicon glyphicon-ok icon-accepted" ng-if="'
                 + row.hasCategory + '"></span>'
                 + '<span class="glyphicon glyphicon-remove icon-rejected" ng-if="'
                 + !row.hasCategory + '"></span>';
        }
      },
      {
        title: 'Active Condition',
        field: 'isEnabled',
        show: isSettingEnabled('isEnabled', publishSettings),
        getValue: function (row) {
          return '<span class="glyphicon glyphicon-ok icon-accepted" ng-if="'
                 + row.isEnabled + '"></span>'
                 + '<span class="glyphicon glyphicon-remove icon-rejected" ng-if="'
                 + !row.isEnabled + '"></span>';
        }
      },
      {
        title: 'Details',
        field: 'details',
        show: true,
        getValue: function (row) {
          return '<a class="btn btn-default" href="" ui-sref="product({id:'
                 + row.productCode + '})">Details</a>';
        }
      }
    ];

    vm.getData = productService.getUnpublishedProducts;

    return vm;
  }

})();
