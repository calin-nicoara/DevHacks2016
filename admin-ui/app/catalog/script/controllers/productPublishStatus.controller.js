(function () {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductPublishStatusController', productPublishStatusController);

  function productPublishStatusController(publishInfo) {
    var vm = this;

    var publishConditionInfoMapper = {
      PRODUCT_SITE_NAME_FILLED: 'hasSiteName',
      IMAGE_ATTACHED: 'hasImage',
      STOCK_GREATER_THAN_ZERO: 'hasStock',
      PRICE_GREATER_THAN_ZERO: 'hasPrice',
      MANDATORY_ATTRIBUTES_FILLED: 'hasMandatoryCategoryAttributesSet',
      ATTACHED_TO_ONE_CATEGORY: 'hasCategory',
      PRODUCT_ENABLED: 'isEnabled'
    };

    function initialize() {
      vm.publishProperties = publishInfo.publishProperties;
      vm.publishSettings = _.chain(publishInfo.publishSettings)
        .groupBy('code')
        .mapValues('0')
        .mapKeys(function (value, key) {
          return publishConditionInfoMapper[key];
        })
        .value();
    }

    initialize();

    vm.unPublishMapper = {
      hasSiteName: 'Site name Condition',
      hasImage: 'Image Condition',
      hasStock: 'Stock Condition',
      hasPrice: 'Price Condition',
      hasMandatoryCategoryAttributesSet: 'Mandatory attributes Condition',
      hasCategory: 'Category Condition',
      isEnabled: 'Active Condition'
    };


    return vm;
  }

})();
