'use strict';
angular.module('eCarrefour.catalog')
  .factory('catalogService', function ($http) {
    var service = {};

    var makeCall = function (verb, url, data, params) {
      return $http({
                     method: verb,
                     data: data,
                     url: url,
                     params: params
                   })
        .then(function (reply) {
          return reply.data;
        });
    };

    service.makeCall = makeCall;

    service.list = function (url) {
      return makeCall('GET', url + '');
    };

    service.removeCategoryAttribute = function (id) {
      return makeCall('DELETE', '/api/catalog/admin/category/attribute/' + id);
    };

    service.addAttribute = function (data) {
      return makeCall('POST', '/api/catalog/admin/category/attribute', data);
    };

    service.deleteCategory = function (categoryId) {
      return makeCall('DELETE', '/api/catalog/admin/category/' + categoryId);
    };

    service.saveCategory = function (newCategory) {
      return makeCall('POST', 'api/catalog/admin/category/', newCategory);
    };

    service.getCategory = function (categoryId) {
      return makeCall('GET', '/api/catalog/admin/category/' + categoryId);
    };

    service.importAttributeValuesFile = function (file, categoryId) {

      var fd = new FormData();
      fd.append('file', file[0]);

      var url = '/api/catalog/admin/templates/category/' + categoryId;

      return $http.post(url, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
        .then(function (reply) {
          return reply.data;
        });
    };

    service.loadCategories = function () {
      return makeCall('GET', '/api/catalog/admin/category');
    };

    var makeImageInArrayForMediaServer = function (image) {
      var fd = new FormData();
      fd.append('images[]', image, 'image.png');
      return fd;
    };

    service.updateCategoryImage = function (categoryId, image) {
      var files = makeImageInArrayForMediaServer(image[0]);

      var url = '/media/api/images/category/' + categoryId;

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

     service.updateCategoryBanner = function (categoryId, image) {
       var files = makeImageInArrayForMediaServer(image[0]);

       var url = '/media/api/images/category_banner/' + categoryId;

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

    service.updateImageForIconAttribute = function (attributeSlug, image) {
      var files = makeImageInArrayForMediaServer(image[0]);

      var url = '/media/api/images/icon_attribute/' + attributeSlug;

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

    service.getPriceValidationList = function (page, size) {
      var filterModel = {
        page: page - 1,
        size: size
      };

      return makeCall('GET', 'api/catalog/product/price_validation', '', filterModel);
    };

    service.postPriceValidation = function (priceValidationsModel) {
      return makeCall('POST', 'api/catalog/product/price_validation', priceValidationsModel);
    };

    return service;
  });
