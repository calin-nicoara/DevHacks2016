'use strict';
angular.module("eCarrefour.catalog")
  .directive('addCategory', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/addCategory.html',
      controller: 'addCategoryController',
      scope: false
    }
  }).controller('addCategoryController', function ($scope, $http, catalogService, treeService) {

  if($scope.editModel.startDate === undefined) {
    var now = new Date(Date.now());
    var month = now.getMonth() + 1;
    var day = now.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    $scope.editModel.startDate = now.getFullYear() + '-' + month + '-' + day;
  }


  (function () {
    angular.element('.datePicker').datepicker({
                                                format: "yyyy-mm-dd",
                                                autoclose: true
                                              });
  })();

  $scope.close = function () {
    $scope.modalInstance.dismiss('cancel');
  };
});
