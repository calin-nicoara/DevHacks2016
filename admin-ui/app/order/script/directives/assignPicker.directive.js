'use strict';
angular.module("eCarrefour.order")
  .directive('assignPicker', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/assignPicker.html',
      scope: {
        selectedOrders: "=",
        afterAssign: "&"
      },
      controller: 'assignPickerController'
    }
  })
  .controller('assignPickerController', function ($scope, orderService) {

    $scope.selectedPicker = undefined;
    $scope.busy = true;
    $scope.pickers = [];

    $scope.selectPicker = function (picker) {
      $scope.selectedPicker = picker;
    };

    var getData = function () {
      $scope.busy = true;
      orderService.getPickers()
        .then(function (reply) {
          $scope.pickers = reply.items;

        })
        .catch(function (err) {
          $scope.error = "Something went wrong during server call ..";
          console.error(new Error(err.status || err.statusCode || err.message || 'Connection Error', err.data));

        })
        .finally(function () {
          $scope.busy = false;
        })
    };

    getData();

    $scope.assignPicker = function (picker) {
      $scope.busy = true;

      orderService.assignPicker($scope.selectedOrders, $scope.selectedPicker.id)
        .then(function (reply) {
          if($scope.afterAssign){
            $scope.afterAssign({pickerAssigned: $scope.selectedPicker.id});
          }
          $scope.selectedPicker = undefined;

        })
        .finally(function () {
          $scope.busy = false;
        })

    };


  });

