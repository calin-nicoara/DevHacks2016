(function () {
    'use strict';

    angular.module('eCarrefour.catalog').controller('CatalogController', catalogController);
    function catalogController($scope, $uibModal, catalogService, treeService, categoryList,
                               toastr) {

      var tree = angular.element('#tree');

      var vm = this;

      var treeInfo = null;
      $scope.modalInstance = null;

      $scope.categorySelected = null;
      $scope.disableDeleteCategory = true;
      $scope.disableDownloadTemplate = true;
      $scope.disableAddCategory = true;
      $scope.nodeId = null;
      $scope.selected = false;
      $scope.selectedNode = {};
      $scope.busy = true;
      $scope.attributeValueFile = null;

      $scope.categoryDetails = {};
      $scope.info = {};

      $scope.attributeListInclude = 'views/categoryDetailTabs/categoryAttributesList.html';
      $scope.addCategory = 'add_category.html';

      var onSelectCallback = function (event, node) {

        $scope.$apply(function () {
          $scope.selectedNode = node;
          $scope.selected = true;
          $scope.disableDeleteCategory = node.level === 0;

          $scope.disableAddCategory = false;

          treeInfo.list.forEach(function (category) {
            if (category.id === node.id) {
              $scope.categorySelected = category.id;
              $scope.nodeSelected = node.nodeId;
              $scope.details = category;
            }
          });

          $scope.loadCategoryDetails($scope.categorySelected);

        });

      };

      var onUnSelectCallback = function () {
        $scope.$apply(function () {
          $scope.selected = false;
          $scope.disableDeleteCategory = true;
          $scope.disableAddCategory = true;
        });
      };

      $scope.refreshTree = function () {
        return catalogService.loadCategories()
          .then(function (data) {
            createTree(data);
          });
      };

      function createTree(categories) {
        treeInfo = treeService.redrawTree(categories);
        treeService.makeDefaultCategoryTree(treeInfo.treeData, onSelectCallback, onUnSelectCallback,
                                            tree);
      }

      createTree(categoryList);

      $scope.getDownloadTemplateUrl = function () {
        return '/api/catalog/admin/templates/category/' + $scope.categorySelected;
      };

      $scope.deleteCategory = function () {
        catalogService.deleteCategory($scope.categorySelected)
          .then(function () {
            $scope.refreshTree().then(function () {
              treeService.selectNodeAndReveal($scope.info.category.categoryDetails.parentCategoryId,
                                              tree);
            });

          });
      };

      $scope.loadCategoryDetails = function (categorySelected) {
        return catalogService.getCategory(categorySelected)
          .then(function (data) {

            $scope.info.category = data;

            $scope.info.category.categoryInheritedAttributes =
              $scope.info.category.categoryAttributes
                .filter(function (attribute) {
                  return attribute.categoryId !== categorySelected;
                });

            $scope.info.category.categoryAttributes = $scope.info.category.categoryAttributes
              .filter(function (attribute) {
                return attribute.categoryId === categorySelected;
              });
          });
      };

      $scope.saveCategory = function (editModel) {

        editModel.link = editModel.link.concat(editModel.newLink);

        catalogService.saveCategory(editModel)
          .then(function (data) {
            $scope.refreshTree()
              .then(function () {
                $scope.loadCategoryDetails(data.id);
                treeService.selectNodeAndReveal(data.id, tree);
                $scope.categorySelected = data.id;
              });

          });

        $scope.modalInstance.dismiss('cancel');
      };

      $scope.collapseAll = function () {
        tree.treeview('collapseAll', {silent: true});
      };

      $scope.expandAll = function () {
        tree.treeview('expandAll', {silent: true});
      };

      $scope.$watch('attributeValueFile', function (newValue) {
        if (newValue && newValue.length > 0) {
          catalogService.importAttributeValuesFile(newValue, $scope.categorySelected)
            .then(function (data) {
              if (data.length !== 0) {
                angular.element('#errorsUploadTemplate').modal('show');
                $scope.displayUploadErrors(data);
              }
            });
        }
      });

      $scope.openEditCategoryModal = function () {
        if (userCanEditCategoryLink($scope.info.category.categoryDetails)) {
          $scope.editModel = _.clone($scope.info.category.categoryDetails);

          if ($scope.editModel.link) {
            $scope.editModel.newLink = _.last($scope.editModel.link.split('/'));
          }
          else {
            $scope.editModel.newLink = '';
            $scope.editModel.link = '';
          }
          $scope.editModel.link =
            _.replace($scope.editModel.link, new RegExp($scope.editModel.newLink + '$'), '');

          $scope.modalInstance = $uibModal.open({
                                                  animation: true,
                                                  templateUrl: 'views/modals/addEditCategory.html',
                                                  scope: $scope
                                                });
        }
        else {
          toastr.error(
            'You can\'t edit this category because it\'s parent doesn\'t have a valid link ',
            'Error',
            {
              autoDismiss: false,
              timeout: 0
            });
        }
      };

      function userCanEditCategoryLink(editModel) {
        var parent = _.find(treeInfo.list, {id: editModel.parentCategoryId});
        return !!(angular.isUndefined(parent) || parent.level === 0 || (parent.link.slice(-1)
                                                                        !== '/'
                                                                        && parent.link.slice(-1)
                                                                           !== ''));
      }

      $scope.openAddCategoryModal = function () {
        $scope.editModel = {
          parentCategoryId: $scope.categorySelected,
          link: $scope.details.level === 0 ? '' : $scope.details.link + '/'
        };
        if (userCanEditCategoryLink($scope.editModel)) {
          $scope.modalInstance = $uibModal.open({
                                                  animation: true,
                                                  templateUrl: 'views/modals/addEditCategory.html',
                                                  scope: $scope
                                                });
        }
        else {
          toastr.error(
            'You can\'t add a subcategory because the parent doesn\'t have a valid link ',
            'Error',
            {
              autoDismiss: false,
              timeout: 0
            });
        }
      };

      $scope.shouldDisplayCategoryModalField = function (editModel) {
        return angular.isUndefined(editModel.id) || editModel.level;
      };

      $scope.isAttributeIcon = function (key, attributeType) {
        return key === 'values' && attributeType === 'ICON';
      };

      return vm;
    }

  })();
