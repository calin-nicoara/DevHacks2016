(function () {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductAttributesController', productAttributesController);

  function productAttributesController(productAttributeValues, $stateParams, toastr,
                                       productService, linkService) {
    var vm = this;

    vm.allMandatoryAttributeValuesSet = true;
    vm.data = setOrganizedProdAttrValues(productAttributeValues);
    vm.getImageMediaSrc = linkService.getImageMediaSrc;
    vm.enableEditAttribute = enableEditAttribute;
    vm.cancelEditAttribute = cancelEditAttribute;
    vm.saveAttributeValue = saveAttributeValue;
    vm.removeAttributeValue = removeAttributeValue;
    vm.isAttributeIcon = isAttributeIcon;
    vm.useBooleanTypeEdit = useBooleanTypeEdit;
    vm.categoryAttributeMappings = {
      'id': 'Attribute Id',
      'categoryId': 'Category Id',
      'slug': 'Attribute Slug',
      'name': 'Attribute Name',
      'type': 'Attribute Type',
      'values': 'Values',
      'isFilterable': 'Filterable',
      'isSortable': 'Sortable',
      'isSearchable': 'Searchable',
      'isMandatory': 'isMandatory',
      'isHidden': 'isHidden',
      'categoryPath': 'Category Path'
    };

    function setOrganizedProdAttrValues(productAttributeValues) {
      var tempData = {
        optionalAttrValues: {},
        mandatoryAttrValues: {}
      };
      _.forEach(productAttributeValues, function (attrObj) {

        if (attrObj.categoryAttribute.type === 'NUMERIC' || attrObj.categoryAttribute.type
                                                            === 'RANGEABLE') {
          if (attrObj.attributeValue.value === null) {
            attrObj.attributeValue.value = '';
          } else {
            attrObj.attributeValue.value = Number(attrObj.attributeValue.value);
          }
        }

        var categoryPath = attrObj.categoryAttribute.categoryPath;

        if (attrObj.categoryAttribute.isMandatory === true) {
          if (angular.isUndefined(tempData.mandatoryAttrValues[categoryPath])) {
            tempData.mandatoryAttrValues[categoryPath] = [];
          }

          tempData.mandatoryAttrValues[categoryPath].push(attrObj);
          if (attrObj.attributeValue.value === null || attrObj.attributeValue.value === '') {
            vm.allMandatoryAttributeValuesSet = false;
          }
        } else {
          if (angular.isUndefined(tempData.optionalAttrValues[categoryPath])) {
            tempData.optionalAttrValues[categoryPath] = [];
          }

          tempData.optionalAttrValues[categoryPath].push(attrObj);
        }
      });

      return {
        requiredAttributes: {
          title: 'Mandatory Attributes',
          data: tempData.mandatoryAttrValues
        },
        nonRequiredAttributes: {
          title: 'Optional Attributes',
          data: tempData.optionalAttrValues
        }
      };
    }

    function enableEditAttribute(attribute) {
      if (attribute.attributeValue !== null) {
        attribute.backupValue = attribute.attributeValue.value;
      }

      attribute.enableEdit = true;
    }

    function cancelEditAttribute(attribute) {
      attribute.enableEdit = false;
      attribute.attributeValue.value = attribute.backupValue;
    }

    function saveAttributeValue(attribute) {
      attribute.enableEdit = false;

      productService.saveProductAttributeValue($stateParams.id, attribute.attributeValue)
        .then(function (data) {
          attribute.attributeValue.id = data;
        });
    }

    function removeAttributeValue(attribute) {
      if (attribute.attributeValue.id !== null) {
        productService.deleteProductAttributeValue($stateParams.id, attribute.attributeValue)
          .then(function () {
            attribute.attributeValue.id = null;
            attribute.attributeValue.value = null;
          });
      }
      else {
        toastr.warning('Attribute value is already empty', 'Warning');
      }
    }

    function isAttributeIcon(key, attributeType) {
      return key === 'values' && attributeType === 'ICON';
    }

    function useBooleanTypeEdit(type) {
      return type === 'BOOLEAN' || type === 'ICON';
    }

    return vm;
  }

})();
