(function () {

  'use strict';
  angular.module('eCarrefour.catalog').factory('treeService', treeService);

  function treeService() {
    var service = {};
    
    service.makeDefaultCategoryTree = function (treeData, selectCallback, unSelectCallback, tree) {
      tree.treeview({
                      data: treeData,
                      onNodeSelected: selectCallback,
                      onNodeUnselected: unSelectCallback
                    });
    };

    service.makeCheckableCategoryTree = function (treeData, checkCallback, unCheckCallback, tree) {
      tree.treeview({
                      data: treeData,
                      showCheckbox: true,
                      onNodeChecked: checkCallback,
                      onNodeUnchecked: unCheckCallback
                    });
    };

    service.selectNodeAndReveal = function (categoryId, tree) {
      var exactCategoryNode = tree.treeview('getEnabled').filter(function (node) {
        return node.id === categoryId;
      })[0];

      tree.treeview('revealNode', [exactCategoryNode.nodeId, {silent: true}]);
      tree.treeview('selectNode', [exactCategoryNode.nodeId, {silent: true}]);
      tree.treeview('expandNode', [exactCategoryNode.nodeId, {silent: true}]);
    };

    service.redrawTree = function (originalList) {
      var list = _.sortBy(originalList, ['level', 'positionInParent']);
      var indexRoot = _.findIndex(list, function (category) {
        return category.level === 0;
      });
      list.unshift(list.splice(indexRoot, 1)[0]);
      list[0].parentCategoryId = null;

      var treeData = [];
      for (var i = 0; i < list.length; i++) {
        var currentCategory = list[i];
        var treeElem = {};
        treeElem.text = currentCategory.name;
        treeElem.id = currentCategory.id;
        treeElem.level = currentCategory.level;
        treeElem.categoryPath = currentCategory.categoryPath;

        if (currentCategory.parentCategoryId !== null) {
          addSubCategory(treeData, currentCategory);
        } else {
          treeData.push(treeElem);
        }

      }

      function addSubCategory(treeData, currentCategory) {
        treeData.forEach(function (parentNode) {
          if (parentNode.id == currentCategory.parentCategoryId) {
            if (!parentNode.nodes) {
              parentNode.nodes = [];
            }
            var childNode = {};
            childNode.text = currentCategory.name;
            childNode.id = currentCategory.id;
            childNode.level = currentCategory.level;
            childNode.categoryPath = currentCategory.categoryPath;

            parentNode.nodes.push(childNode);
          } else {
            if (parentNode.nodes) {
              addSubCategory(parentNode.nodes, currentCategory);
            }
          }
        });
      }

      return {
        treeData: treeData,
        list: list
      };

    };

    return service;
  }

})();
