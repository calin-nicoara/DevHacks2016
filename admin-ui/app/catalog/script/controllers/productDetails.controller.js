(function () {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductDetailsController', productDetailsController);

  function productDetailsController(productInfo, stockInfo, productService, $timeout) {
    var vm = this;

    var backupData = {};
    var timeOutBrand = null;

    vm.brandValidator = {
      message: 'Selected brand must exist',
      visible: false
    };

    function initialize() {
      vm.productDetails = productInfo;
      vm.productDetails.stock = stockInfo['stock_quantity'];
      vm.searchBrandText = '';
      vm.editDisabled = true;
    }

    initialize();

    function isValidSaveInfo(data, validateMap) {
      var valid = true;
      _.forOwn(data, function (value, field) {
        var mapValue = validateMap[field];
        if (mapValue && mapValue.validate) {
          if (!mapValue.validate(value)) {
            mapValue.visible = true;
            valid = false;
          }
        }
      });

      if (data.maxSellingQuantity > 0 && data.maxSellingQuantity
                                         < data.minSellingQuantity) {
        validateMap['maxSellingQuantity'].visible = true;
        validateMap['maxSellingQuantity'].message =
          'Max selling quantity must be greater than min selling quantity';

        valid = false;
      }

      if (!data.brandModel && vm.searchBrandText.length > 0) {
        vm.brandValidator.visible = true;
        valid = false;
      }

      return valid;
    }

    vm.querySearch = function (query) {
      if (timeOutBrand) {
        $timeout.cancel(timeOutBrand);
      }

      timeOutBrand = $timeout(function () {
        query = encodeURIComponent(query);
        return productService.getProductBrandList(query);
      }, 250);

      return timeOutBrand;
    };

    vm.selectedItemChange = function (item) {
      if (item) {
        vm.productDetails.brandModel = item;
      }
    };

    vm.enableProductEdit = function () {
      backupData = _.clone(vm.productDetails);
      vm.editDisabled = false;
    };

    vm.cancelProductEdit = function () {
      vm.productDetails = backupData;
      vm.editDisabled = true;
    };

    vm.saveProductInfo = function () {
      if (isValidSaveInfo(vm.productDetails, vm.validateProductDetailsMap)) {

        if (vm.productDetails.stock !== backupData.stock) {
          productService.setProductStock(
            {
              product_code: vm.productDetails.metiCode,
              stock_quantity: vm.productDetails.stock
            });
        }

        productService.saveProductInfo(productInfo.metiCode, vm.productDetails)
          .then(function (res) {
            vm.editDisabled = true;
            vm.productDetails.link = res.link;
          });
      }
    };

    vm.closePopover = function (item) {
      item.visible = false;
    };

    vm.validateProductDetailsMap = {
      'product_id': {
        title: 'Product Id'
      },
      'title': {
        inputType: 'text',
        title: 'Product Name',
        visible: false
      },
      'description': {
        inputType: 'text',
        title: 'Description',
        visible: false
      },
      'metiCode': {
        title: 'Meti Code'
      },
      'metiName': {
        title: 'Meti Name'
      },
      'stock': {
        inputType: 'number',
        title: 'Available Site Stock'
      },
      'link': {
        title: 'Product link'
      },
      'keywords': {
        message: '',
        inputType: 'text',
        title: 'Keywords',
        visible: false
      },
      'packaging': {
        message: 'Field is required',
        inputType: 'select',
        title: 'Packaging',
        visible: false,
        validate: function (value) {
          return (value !== null && value.length > 0);
        },
        valueList: ['PIECE', 'KILOGRAM', 'BUNDLE', 'LITER', 'BOX']
      },
      'minSellingQuantity': {
        inputType: 'number',
        title: 'Min selling quantity'
      },
      'maxSellingQuantity': {
        inputType: 'number',
        title: 'Max selling quantity'
      },
      'weight': {
        inputType: 'number',
        title: 'Weight (kg)'
      },
      'deliveryType': {
        inputType: 'select',
        title: 'Delivery Type',
        visible: false,
        valueList: ['STANDARD', 'DUAL', 'DELAYED']
      },
      'weightIncrement': {
        inputType: 'number',
        title: 'Weight increment'
      }
    };

    return vm;
  }

})();
