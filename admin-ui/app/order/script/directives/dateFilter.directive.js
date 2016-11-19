'use strict';
angular.module("eCarrefour.order")
  .directive('dateFilter', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/dateFilterDirective.html',
      scope: false,
      controller: 'dateFilterController'
    }
  })
  .controller('dateFilterController', function ($scope) {

    (function () {
      angular.element(".datePicker").datepicker(
        {format: "yyyy-mm-dd", autoclose: true});
    })();

    $scope.clearSearch = function () {
      $scope.col.filters[0].term = '';
    }

  });
