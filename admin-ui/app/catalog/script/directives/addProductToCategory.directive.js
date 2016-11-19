(function () {
  'use strict';
  angular.module('eCarrefour.catalog')
    .directive('addProductToCategory', addProductToCategoryDirective);
  function addProductToCategoryDirective() {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/addProductToCategory.html',
      controller: addProductToCategoryController,
      controllerAs: 'addProductCtrl',
      scope: {
        isProductListPage: '=',
        metiCode: '=',
        categoryPaths: '=',
        categoryList: '=',
        selectedRows: '='
      }
    };
  }

  function addProductToCategoryController($scope, productService, treeService, ngTableService) {

    var vm = this;

    var tree = angular.element('#tree');

    var checkedCategories = [];

    var isProductListPage = $scope.isProductListPage;
    var metiCode = $scope.metiCode;
    var selectedRows = $scope.selectedRows;

    vm.addProductCategoryAssignments = addProductCategoryAssignments;
    vm.collapseAll = collapseAll;
    vm.expandAll = expandAll;

    angular.element('#categoryModal').on('show.bs.modal', function () {
      checkedCategories.length = 0;
      refreshTree();
    });

    function refreshTree() {
      var treeInfo = treeService.redrawTree($scope.categoryList, tree);
      treeService.makeCheckableCategoryTree(treeInfo.treeData, onCheckCallback, onUnCheckCallback,
                                            tree);

      _.forEach(tree.treeview('getEnabled'), function (node) {
        if (_.find($scope.categoryPaths, {'categoryId': node.id})) {
          tree.treeview('checkNode', [node.nodeId]);
        }
      });

    }

    function collapseAll() {
      tree.treeview('collapseAll', {silent: true});
    }

    function expandAll() {
      tree.treeview('expandAll', {silent: true});
    }

    function addProductCategoryAssignments() {
      productService.addProductCategoryAssignments(metiCode, checkedCategories,
                                                   isProductListPage)
        .then(function () {
          if (isProductListPage) {
            ngTableService.reload();
          }
          else {
            $scope.categoryPaths.length = 0;
            _.forEach(checkedCategories, function (assignment) {
              $scope.categoryPaths.push({
                categoryId: assignment.categoryId,
                fullTreePath: assignment.categoryPath
              });
            });
          }
        }).finally(function () {
        checkedCategories.length = 0;
      });
      angular.element('#categoryModal').modal('hide');
    }

    function onCheckCallback(event, node) {
      if (isProductListPage) {
        _.forEach(selectedRows, function (value) {
          checkedCategories.push(
            {
              productCode: value.metiCode,
              categoryId: node.id,
              categoryPath: node.categoryPath
            }
          );
        });

      } else {
        checkedCategories.push(
          {
            productCode: metiCode,
            categoryId: node.id,
            categoryPath: node.categoryPath
          }
        );
      }

      applyToChildNodes(node, 'disableNode');
    }

    function onUnCheckCallback(event, node) {
      checkedCategories = _.filter(checkedCategories, function (categoryObj) {
        return categoryObj.categoryId !== node.id;
      });

      applyToChildNodes(node, 'enableNode');
    }

    function applyToChildNodes(node, event, option) {
      if (node.nodes) {
        _.forEach(node.nodes, function (nodeElem) {
          tree.treeview(event, [nodeElem.nodeId, option]);
        });
      }
    }

    return vm;

  }
})
();
