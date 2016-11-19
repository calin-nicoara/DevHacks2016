(function () {
  'use strict';
  angular.module('eCarrefour.catalog')
    .factory('productService', productService);

  function productService($http, $q) {
    var service = {};

    var makeCall = function (verb, url, data, params, toastActive) {
      var base = '';
      return $http({
                     method: verb,
                     data: data,
                     url: base + url,
                     params: params,
                     toastActive: toastActive
                   })
        .then(function (reply) {
          return reply.data;
        });
    };

    service.list = function (page, size, filterModel) {
      if (angular.isUndefined(filterModel)) {
        filterModel = {
          page: 0,
          size: 5
        };
      }

      filterModel.page = page - 1;
      filterModel.size = size;
      return makeCall('GET', '/api/catalog/admin/product', '', filterModel);
    };

    service.removeCategory = function (categoryId, productCode) {
      return makeCall('DELETE',
                      '/api/catalog/admin/product/' + productCode + '/categories/' + categoryId);
    };

    service.getOneProduct = function (productCode) {
      return makeCall('GET', '/api/catalog/admin/product/' + productCode, '');
    };

    service.saveProductInfo = function (productCode, productInfo) {
      return makeCall('POST', '/api/catalog/admin/product/' + productCode, productInfo);
    };

    service.saveProductPrice = function (productCode, productInfo) {
      return makeCall('POST', '/api/catalog/admin/product/' + productCode + '/price', productInfo);
    };

    service.setProductStock = function (stockInfo) {
      return makeCall('POST', '/api/stock', stockInfo);
    };

    service.addProductCategoryAssignments = function (productCode, assignments, isFromProductList) {
      if (isFromProductList) {
        return makeCall('POST', '/api/catalog/admin/product/manualCategoryAssignment', assignments);
      } else {
        return makeCall('POST', '/api/catalog/admin/product/' + productCode + '/categories',
                        assignments);
      }
    };

    service.getStockInfo = function (productCode) {
      return makeCall('GET', '/api/stock/' + productCode);
    };

    service.getProductAttributeValues = function (productCode) {
      return makeCall('GET', '/api/catalog/admin/product/' + productCode + '/attribute');
    };

    service.getPublishSettings = function () {
      return makeCall('GET', '/api/catalog/product/settings/publish');
    };

    service.getUnpublishedProductInfo = function (productCode) {
      return makeCall('GET', '/api/catalog/admin/product/unpublished/' + productCode);
    };

    service.getUnpublishedProducts = function (page, size) {
      var filterModel = {
        page: page - 1,
        size: size
      };

      return makeCall('GET', '/api/catalog/admin/product/unpublished', '', filterModel);
    };

    service.saveProductAttributeValue = function (productCode, attribute) {
      return makeCall('POST', '/api/catalog/admin/product/' + productCode + '/attribute', attribute);
    };

    service.deleteProductAttributeValue = function (productCode, attribute) {
      return makeCall('DELETE',
                      '/api/catalog/admin/product/' + productCode + '/attribute/' + attribute.id);
    };

    service.importAssignmentFile = function (file) {

      var fd = new FormData();
      fd.append('file', file[0]);

      var url = '/api/catalog/admin/product/categoryAssignment';

      return $http.post(url, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
        .then(function (reply) {
          return reply.data;
        });
    };

    service.getProductImagesInfo = function (productCode) {
      return makeCall('GET', '/api/catalog/product/' + productCode + '/images');
    };

    service.updateProductImagesInfo = function (productCode, data) {
      return makeCall('PUT', '/api/catalog/product/' + productCode + '/images', data);
    };

    service.addProductImagesInfo = function (productCode, data) {
      return makeCall('POST', '/api/catalog/product/' + productCode + '/images', data);
    };

    service.addProductImagesFiles = function (productCode, files) {

      var url = '/media/api/images/product/' + productCode;

      return $http.post(url, files, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (reply) {
          return reply.data;
        });
    };

    service.removeProductImagesFiles = function (url) {
      url = '/media/api/' + url;
      return $http({
                     method: 'DELETE',
                     url: url
                   })
        .then(function (reply) {
          return reply.data;
        });
    };

    service.removeProductImagesInfo = function (id, data) {
      return makeCall('DELETE', '/api/catalog/product/' + id + '/images', data);
    };

    service.reorderImageFiles = function (original, sorted, productCode) {

      var model = {
        original: original,
        sorted: sorted
      };

      var url = '/media/api/images/product/' + productCode + '/order';
      return $http({
                     method: 'POST',
                     data: model,
                     url: url
                   })
        .then(function (reply) {
          return reply.data;
        });

    };

    service.uploadBulkImages = function (file) {
      var fd = new FormData();
      fd.append('archive', file[0]);

      var url = '/media/api/bulk';

      return $http.post(url, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (reply) {
          return reply.data;
        });
    };

    service.addProductBulkImagesInfo = function (data) {
      return makeCall('POST', '/api/catalog/product/images', data);
    };

    service.validateBulkImages = function (data) {
      return makeCall('POST', '/api/catalog/product/images/validate', data);
    };

    service.finishUploadBulkImages = function (id, data) {
      var url = '/media/api/bulk/process/' + id;
      var deferred = $q.defer();

      if (data.items && data.items.length > 0) {
        data.items = _.map(data.items, function (elem) {
          return {
            folder: '' + elem.folder,
            images: elem.images,
            filteringGroupSlug: 'product'
          };
        });

        $http.post(url, data)
          .then(function () {

            var imagesUrls = _.map(data.items, function (elem) {
              return {
                folder: elem.folder,
                images: _.map(elem.images, function (image) {
                  return 'images/product/' + elem.folder + '/' + image;
                })
              };
            });

            return makeCall('POST', '/api/catalog/product/images', imagesUrls);
          })
          .then(function () {
            deferred.resolve([]);
          })
          .catch(function (err) {
            deferred.reject(err);
          });
      }
      else {
        deferred.resolve([]);
      }

      return deferred.promise;

    };

    service.getProductEanList = function (productCode) {
      return makeCall('GET', '/api/catalog/admin/product/' + productCode + '/eanCodes');
    };

    service.getProductBrandList = function (brandName) {
      return makeCall('GET', '/api/catalog/brand/list', '', {name: brandName})
        .then(function(response) {
           return response.items; 
        });
    };

    service.reindexProducts = function() {
      return makeCall('POST', 'api/catalog/admin/product/rebuildIndex', {});
    };

    return service;
  }
})();

