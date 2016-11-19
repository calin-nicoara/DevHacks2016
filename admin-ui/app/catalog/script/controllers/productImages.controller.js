(function () {

  'use strict';
  angular.module('eCarrefour.catalog')
    .controller('ProductImagesController', productImagesController);

  function productImagesController(productService, toastr, SweetAlert, imageInfo, $scope) {

    var vm = this;

    var metiCode = imageInfo['product_code'];
    var acceptedTypes = '(png)';   // (png|jpg)

    var format = new RegExp('^images\/product\/' + metiCode + '\/(N([0-9])+_' + metiCode + '.'
                            + acceptedTypes + ')$');
    var localTime = new Date().getTime();

    vm.imageList = imageInfo.images.sort();
    vm.busy = false;
    vm.uploadedFiles = [];
    vm.dropComplete = dropComplete;
    vm.getName = getName;
    vm.removeImage = confirmRemoveImages;
    vm.getImageMediaSrc = getImageMediaSrc;

    $scope.$watch(function () {
      return vm.uploadedFiles;
    }, function (newValue) {

      if (newValue && newValue.length > 0) {
        uploadImages(newValue);
      }
    });

    function getFileUrl(file, index) {

      if (vm.imageList.length > 0) {
        index += getOrder(_.last(vm.imageList));
      }

      return getLocalUrl(index, file.type.split('/')[1]);
    }

    function formatFiles(files) {
      var urls = [];
      var fd = new FormData();

      var count = 1;

      for (var i = 0; i < files.length; i++) {
        var url = getFileUrl(files[i], count);

        if (format.exec(url) === null) {
          toastr.warning('Some files did not match the required type (PNG)'
                         + ' and were not uploaded. File: ' + files[i].name + ' . ', 'Warning', {
                           closeButton: true,
                           timeOut: 0,
                           extendedTimeOut: 0
                         });
        } else {
          urls.push(url);
          count++;
          fd.append('images[]', files[i], vm.getName(url));
        }
      }

      return {
        urls: urls,
        files: fd
      };
    }

    var uploadImages = function (images) {

      var imagesData = formatFiles(images);

      if (imagesData.urls.length > 0) {
        vm.busy = true;
        productService.addProductImagesFiles(metiCode, imagesData.files)
          .then(function () {
            return productService.addProductImagesInfo(metiCode, imagesData.urls);
          })
          .then(function () {
            vm.imageList = vm.imageList.concat(imagesData.urls);
            localTime = new Date().getTime();
          })
          .finally(function () {
            vm.busy = false;
            vm.uploadedFiles = [];
          });
      }

    };

    function removeImages(urlForDelete) {
      var sortedImages = _.map(vm.imageList, vm.getName);

      var originalImages = _.cloneDeep(sortedImages);
      originalImages.splice(vm.imageList.indexOf(urlForDelete), 1);
      originalImages.push(vm.getName(urlForDelete));

      urlForDelete = _.last(vm.imageList);
      vm.busy = true;

      productService.reorderImageFiles(originalImages, sortedImages, metiCode)
        .then(function () {
          return productService.removeProductImagesFiles(urlForDelete);
        })
        .then(function () {
          vm.imageList.pop();
          return productService.updateProductImagesInfo(metiCode, vm.imageList);
        })
        .then(function () {
          localTime = new Date().getTime();
        })
        .catch(function () {
          vm.imageList.push(urlForDelete);
        })
        .finally(function () {
          vm.busy = false;
        });
    }

    function getOrder(image) {
      var match = format.exec(image);
      return parseInt(match[2], 10);
    }

    function getName(image) {
      var match = format.exec(image);
      return match[1];
    }

    function getLocalUrl(order, type) {
      return 'images/product/' + metiCode + '/N' + order + '_' + metiCode + '.' + type;
    }

    function getImageMediaSrc(name) {
      return '/media/' + name + '?time=' + localTime;
    }

    function dropComplete(newIndex, data) {
      var oldIndex = vm.imageList.indexOf(data.url);
      var sortedImages = _.map(vm.imageList, getName);

      var originalImages = _.cloneDeep(sortedImages);
      var aux = originalImages[oldIndex];
      originalImages[oldIndex] = sortedImages[newIndex];
      originalImages[newIndex] = aux;

      vm.busy = true;
      productService.reorderImageFiles(originalImages, sortedImages, metiCode)
        .then(function () {
          localTime = new Date().getTime();
        })
        .finally(function () {
          vm.busy = false;
        });

    }

    function confirmRemoveImages(urlForDelete) {
      SweetAlert.swal({
                        title: 'Are you sure you want to delete this?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Yes, delete it!',
                        closeOnConfirm: true
                      },
                      function (isConfirm) {
                        if (isConfirm) {
                          removeImages(urlForDelete);
                        }
                      });
    }

    return vm;

  }

})();
