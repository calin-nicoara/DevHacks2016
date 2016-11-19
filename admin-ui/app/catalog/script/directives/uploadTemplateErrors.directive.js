'use strict';
angular.module("eCarrefour.catalog")
  .directive('uploadTemplateErrors', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/uploadTemplateErrors.html',
      controller: 'uploadTemplateErrorsController',
      scope: false
    }
  }).
controller('uploadTemplateErrorsController', function ($scope, NgTableParams) {
  $scope.displayUploadErrors = function(errorData) {
    $scope.tableParams = new NgTableParams({
      page: 1,
      count: 10
    },
      {
        counts: [5, 10, 20],
        data: errorData
      });
  };
});
