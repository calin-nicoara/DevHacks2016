'use strict';
angular.module("eCarrefour.catalog")
  .directive('addAttribute', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/addAttribute.html',
      controller: 'addAttributeController',
      scope: false
    }
  }).controller('addAttributeController', function ($scope, $http, catalogService, fileReaderService) {
  $scope.attrImage = {};
  $scope.attr = {};
  $scope.attributeName = "";
  $scope.itemsList = [];
  $scope.itemName = "";

  $scope.attrTypes = ["Alphanumeric", "Numeric", "Boolean", "List", "Icon","Rangeable"];

  $scope.prepareAttrModel = function () {
    $scope.attr.type = 'ALPHANUMERIC';
    $scope.resetAttrModel();
  };


  $scope.resetAttrModel = function () {
    $scope.imageEncodedUrl = null;
    $scope.attrImage.image = null;
    $scope.attr.isMandatory = false;
    $scope.attr.id = null;
    $scope.attr.isSearchable = false;
    $scope.attr.isFilterable = false;
    $scope.attr.isSortable = false;
    $scope.attr.isHidden = false;
    $scope.attr.name = '';
    $scope.attr.slug = '';
    $scope.attr.values = [];
  };

  $scope.addAttribute = function (attr) {
    var callbackPromise;

    attr.categoryId = $scope.categorySelected;
    if (attr.type === 'ICON') {
      callbackPromise =
        catalogService.updateImageForIconAttribute($scope.attr.slug, $scope.attrImage.image)
          .then(function (data) {
            $scope.attr.values[0] = "images/icon_attribute/" + $scope.attr.slug + "/image.png";
            return catalogService.addAttribute(attr);
          });
    } else {
      callbackPromise = catalogService.addAttribute(attr);
    }
    callbackPromise.then(function (response) {
      angular.element("#addAttributeModal").modal('toggle');
      attr.id = response.id;
      $scope.info.category.categoryAttributes.push(_.cloneDeep(attr));
    })
      .catch(function (err) {
        $scope.error = "Something went wrong during server call ..";
        console.error(new Error(err.status || err.statusCode || err.message
                                || 'Connection Error', err.data));
      })
      .finally(function () {
        $scope.busy = false;
      });
  };

  $scope.addListItem = function (name) {
    if ($scope.attr.values.indexOf(name) === -1 && name !== "") {
      $scope.attr.values.push(name);
    }
    $scope.itemName = "";
  };

  $scope.invalidRange = function (attr) {
    var ret = false;
    if (attr.type === 'RANGEABLE') {
      if (attr.range.inferiorLimit >= attr.range.superiorLimit) {
        ret = true;
      }

      if (attr.range.superiorLimit - attr.range.inferiorLimit < attr.range.gap) {
        ret = true;
      }
    }

    return ret;
  };


  $scope.$watch('attrImage.image', function (newValue) {
    if (newValue && newValue.length > 0) {
      fileReaderService.readAsDataURL(newValue[0], $scope)
        .then(function(result) {
          $scope.imageEncodedUrl = result;
        });
    }
  });

});
