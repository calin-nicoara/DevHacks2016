(function () {
  'use strict';
  angular.module('eCarrefour.catalog').directive('categoryDetails', categoryDetailsDirective);

  function categoryDetailsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/categoryDetails.html',
      scope: false,
      controller: 'CategoryDetailsDirectiveController as vm',
    };
  }

  angular.module('eCarrefour.catalog').controller('CategoryDetailsDirectiveController', categoryDetailsController);

  function categoryDetailsController($scope, catalogService, $uibModal, linkService) {
    $scope.categoryImage = {};
    $scope.categoryBanner = {};

    $scope.categoryDetailsMappings = {
      'id': 'Category Id',
      'name': 'Category Name',
      'description': 'Description',
      'startDate': 'Start Date',
      'endDate': 'End Date',
      'positionInParent': 'Sort order',
      'parentCategoryId': 'Parent Category Id',
      'link': 'Full category link'
    };

    $scope.categoryAttributeMappings = {
      'id': 'Attribute Id',
      'categoryId': 'Category Id',
      'slug': 'Attribute Slug',
      'name': 'Attribute Name',
      'type': 'Attribute Type',
      'values': 'Values',
      'ranges': 'Ranges',
      'isFilterable': 'Filterable',
      'isSortable': 'Sortable',
      'isSearchable': 'Searchable',
      'isMandatory': 'Mandatory',
      'isHidden': 'Hidden',
      'categoryPath': 'Category Path'
    };

    $scope.tabs = [{
      title: 'Category Details',
      url: 'views/categoryDetailTabs/categoryDetailsTab.html'
    }, {
      title: 'Category Attributes',
      url: 'views/categoryDetailTabs/categoryAttributesTab.html'
    }, {
      title: 'Category Media',
      url: 'views/categoryDetailTabs/categoryMediaDetailsTab.html'
    }];

    $scope.fontIconClasses = ['fa-comment-o', 'fa-cube', 'fa-dashboard', 'fa-dot-circle-o',
                              'fa-drupal', 'fa-comment-o', 'fa-cube', 'fa-dashboard',
                              'fa-dot-circle-o',
                              'fa-drupal', 'fa-comment-o', 'fa-cube', 'fa-dashboard',
                              'fa-dot-circle-o',
                              'fa-drupal', 'fa-comment-o', 'fa-cube', 'fa-dashboard',
                              'fa-dot-circle-o',
                              'fa-drupal'];

    $scope.currentTab = 'views/categoryDetailTabs/categoryDetailsTab.html';

    $scope.onClickTab = function (tab) {
      $scope.currentTab = tab.url;
    };

    $scope.isActiveTab = function (tabUrl) {
      return tabUrl == $scope.currentTab;
    };

    var removeById = function (id, list) {
      for (var index = 0; index < list.length; index++) {
        if (list[index].id == id) {
          list.splice(index, 1);
        }
      }
    };

    $scope.removeCategoryAttribute = function (attributeId) {
      catalogService.removeCategoryAttribute(attributeId)
        .then(function () {
          removeById(attributeId, $scope.info.category.categoryAttributes);
        });

    };

    $scope.selectIcon = function () {
      $scope.modalInstance = $uibModal.open({
                                              animation: true,
                                              templateUrl: 'views/modals/selectCategoryIcon.html',
                                              scope: $scope
                                            });
    };

    $scope.saveIcon = function (icon) {
      $scope.info.category.categoryDetails.icon = icon;
      $scope.saveCategoryFront($scope.info.category.categoryDetails);
      $scope.modalInstance.dismiss('cancel');
    };

    $scope.saveCategoryFront = function (category) {
      catalogService.saveCategory(category)
    };

    $scope.$watch('categoryImage.image', function (newValue) {
      if (newValue && newValue.length > 0) {
        catalogService.updateCategoryImage($scope.categorySelected, newValue)
          .then(function () {
            $scope.info.category.categoryDetails.image =
              'images/category/' + $scope.categorySelected + '/image.png';
            $scope.saveCategoryFront($scope.info.category.categoryDetails);
          });
      }
    });

    $scope.$watch('categoryBanner.image', function (newValue) {
      if (newValue && newValue.length > 0) {
        catalogService.updateCategoryBanner($scope.categorySelected, newValue)
          .then(function () {
            $scope.info.category.categoryDetails.banner =
              'images/category_banner/' + $scope.categorySelected + '/image.png';
            $scope.saveCategoryFront($scope.info.category.categoryDetails);
          });
      }
    });

    $scope.getImageMediaSrc = linkService.getImageMediaSrc;
    $scope.getImageMediaSrcWithTime = linkService.getImageMediaSrcWithTime;

  }
})();
