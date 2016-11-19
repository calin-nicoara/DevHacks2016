'use strict';
angular.module("eCarrefour.order")
  .controller('statusFilterController', function ($scope, $compile, $timeout) {
    var $elm;

    $scope.showModal = function () {

      $scope.statuses = ['NEW', 'ASSIGNED', 'IN_WORK', 'WAITING_FOR_CLIENT',
                         'VALIDATED_BY_CLIENT', 'PREPARED', 'SHIPPED', 'DELIVERED'];

      $scope.gridOptions = {
        data: [],
        enableColumnMenus: false,
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;

          if ($scope.colFilter && $scope.colFilter.listTerm) {
            $timeout(function () {
              $scope.colFilter.listTerm.forEach(function (status) {
                var entities = $scope.gridOptions.data.filter(function (row) {
                  return row.status === status;
                });

                if (entities.length > 0) {
                  $scope.gridApi.selection.selectRow(entities[0]);
                }
              });
            });
          }
        }
      };

      $scope.statuses.forEach(function (status) {
        $scope.gridOptions.data.push({status: status});
      });

      var html = '<div class="modal" ng-style="{display: \'block\'}"><div class="modal-dialog">'
                 + '<div class="modal-content"><div class="modal-header">Filter statuses</div>'
                 + '<div class="modal-body"><div id="grid1" ui-grid="gridOptions" ui-grid-selection class="modalGrid">'
                 + '</div></div><div class="modal-footer">'
                 + '<button id="buttonClose" class="btn btn-primary" ng-click="close()">Filter</button>'
                 + '<button  class="btn btn-danger" ng-click="closeWithoutFilter()">Cancel</button>'
                 + '</div></div></div></div>';
      
      $elm = angular.element(html);
      angular.element(document.body).prepend($elm);

      $compile($elm)($scope);

    };

    $scope.closeWithoutFilter = function () {
      if ($elm) {
        $elm.remove();
      }
    };

    $scope.close = function () {
      var statuses = $scope.gridApi.selection.getSelectedRows();
      $scope.colFilter.listTerm = [];

      statuses.forEach(function (status) {
        $scope.colFilter.listTerm.push(status.status);
      });

      $scope.colFilter.term = $scope.colFilter.listTerm.join(', ');
      $scope.colFilter.condition = new RegExp($scope.colFilter.listTerm.join('|'));

      if ($elm) {
        $elm.remove();
      }
    };
  })
  .directive('statusesModal', function () {
    return {
      template: '<label>{{colFilter.term}}</label><button ng-click="showModal()">choose</button>',
      controller: 'statusFilterController'
    };
  });
