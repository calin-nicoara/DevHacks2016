(function () {

  'use strict';
  angular.module('eCarrefour.catalog').controller('productsListController', productsListController);

  function productsListController($scope, productService, ngTableService, $state, catalogService,
                                  NgTableParams, SweetAlert) {

    var vm = this;

    initialize();

    $scope.$watch(function () {
      return vm.assignmentFile;
    }, function (newValue) {
      if (newValue && newValue.length > 0) {
        productService.importAssignmentFile(newValue)
          .then(function () {
            if (vm.isActiveTab('assignList')) {
              ngTableService.reload();
            }
          });
      }
    });

    $scope.$watch(function () {
      return vm.imageFile;
    }, function (newValue) {
      if (newValue && newValue.length > 0) {
        uploadBulkImages(newValue);
      }
    });

    function initialize() {
      vm.assignmentFile = [];
      vm.imageFile = [];
      vm.reportData = [];
      vm.selectedRows = $scope.selectedRows = [];
      vm.viewList = [
        {
          name: 'mainList',
          title: 'Product list'
        },
        {
          name: 'assignList',
          title: 'Product assign list'
        },
        {
          name: 'unpublishedList',
          title: 'Unpublished product list'
        }
      ];
      vm.isActiveTab = isActiveTab;
      vm.reindexProducts = reindexProducts;

      catalogService.loadCategories()
        .then(function (categories) {
          vm.categoryList = categories;
        });
    }

    function isActiveTab(viewName) {
      return $state.current.name === viewName;
    }

    function displayImagesStatuses(initialData, finalData) {

      var acceptedImageTypes = 'png';
      var format = new RegExp('^N[0-9]+_[0-9]+.' + acceptedImageTypes + '$');

      vm.reportData = [];

      var acceptedImages = [];

      finalData.items.forEach(function (elem) {
        acceptedImages = acceptedImages.concat(elem.images);
      });

      initialData.files.forEach(function (elem) {
        if (acceptedImages.indexOf(elem) >= 0) {
          vm.reportData.push({name: elem, status: 'ACCEPTED'});
        }
        else {
          if (!format.test(elem)) {
            vm.reportData.push({name: elem, status: 'INCORRECT FORMAT'});
          }
          else {
            vm.reportData.push({name: elem, status: 'INVALID METI CODE'});
          }
        }
      });

      displayImagesReportTable();
    }

    function displayImagesReportTable() {
      vm.tableParams = new NgTableParams(
        {
          page: 1,
          count: 5
        },
        {
          counts: [5, 10],
          data: vm.reportData
        }
      );
      angular.element('#reportModal').modal('show');
    }

    function uploadBulkImages(file) {
      var initialImagesData = {};
      var finalImagesData = {};
      productService.uploadBulkImages(file)
        .then(function (mediaServerRes) {
          initialImagesData = mediaServerRes;
          return productService.validateBulkImages(mediaServerRes.files);
        })
        .then(function (validatedRes) {
          finalImagesData = validatedRes;
          return productService.finishUploadBulkImages(initialImagesData.id, validatedRes);
        })
        .then(function () {
          displayImagesStatuses(initialImagesData, finalImagesData);
        })
        .finally(function () {
          vm.imageFile = [];
        });
    }

    function reindexProducts() {
      SweetAlert.swal(
        {
          title: 'Are you sure you want to reindex all products?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes, I am sure!',
          closeOnConfirm: false
        },
        function (isConfirm) {
          if (isConfirm) {
            productService.reindexProducts();
          }
          swal.close();
        });
    }

    return vm;

  }
})();

