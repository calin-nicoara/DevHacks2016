(function () {

  'use strict';
  angular
    .module('eCarrefour.catalog', [])
    .config(configure);

  function configure($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/product/:id', '/product/:id/product_details');
    $urlRouterProvider.when('/product_list', '/product_list/main_product_list');

    var catalogState = {
      name: 'catalog',
      url: '/catalog',
      templateUrl: 'views/catalog.html',
      controller: 'CatalogController as vm',
      hideNavbar: false,
      title: 'Categories',
      data: {
        roles: (function () {
          return ['ROLE_ADMIN', 'ROLE_WMS_ADMIN'];
        })()
      },
      resolve: {
        categoryList: ['catalogService', function(catalogService) {
          return catalogService.loadCategories();
        }]
      }
    };

    var productState = {
      name: 'product',
      url: '/product/:id',
      templateUrl: 'views/product.html',
      controller: 'ProductController',
      controllerAs: 'productCtrl',
      hideNavbar: false,
      resolve: {
        productInfo: ['productService', '$stateParams', function (productService, $stateParams) {
          return productService.getOneProduct($stateParams.id);
        }]
      },
      data: {
        roles: (function () {
          return ['ROLE_ADMIN', 'ROLE_WMS_ADMIN'];
        })()
      }
    };

    var productDetailsState = {
      name: 'details',
      parent: 'product',
      url: '/product_details',
      templateUrl: 'views/productDetailTabs/productDetailsTab.html',
      controller: 'ProductDetailsController',
      controllerAs: 'productCtrl',
      resolve: {
        stockInfo: ['productInfo', 'productService', function(productInfo, productService) {
          return productService.getStockInfo(productInfo.metiCode);
        }]
      }
    };

    var metiFieldsState = {
      name: 'meti',
      parent: 'product',
      url: '/details_meti',
      templateUrl: 'views/productDetailTabs/productMetiTab.html',
      controller: 'ProductMetiController',
      controllerAs: 'metiCtrl',
      resolve: {
        stockInfo: ['productInfo', 'productService', function(productInfo, productService) {
            return productService.getStockInfo(productInfo.metiCode);
        }]
      }
    };

    var priceState = {
      name: 'price',
      parent: 'product',
      url: '/product_price',
      templateUrl: 'views/productDetailTabs/productPriceTab.html',
      controller: 'ProductPriceController',
      controllerAs: 'priceCtrl'
    };

    var imagesState = {
      name: 'images',
      parent: 'product',
      url: '/product_images',
      templateUrl: 'views/productDetailTabs/productImagesTab.html',
      controller: 'ProductImagesController',
      controllerAs: 'imagesCtrl',
      resolve: {
        imageInfo: ['productInfo', 'productService', function(productInfo, productService) {
          return productService.getProductImagesInfo(productInfo.metiCode);
        }]
      }
    };

    var productCategoriesState = {
      name: 'categories',
      parent: 'product',
      url: '/product_categories',
      templateUrl: 'views/productDetailTabs/productCategoriesTab.html',
      controller: 'ProductCategoriesController',
      controllerAs: 'categoriesCtrl'
    };

    var attributesState = {
      name: 'attributes',
      parent: 'product',
      url: '/product_attributes',
      templateUrl: 'views/productDetailTabs/productAttributeTab.html',
      controller: 'ProductAttributesController',
      controllerAs: 'attrsCtrl',
      resolve: {
        productAttributeValues: ['productService', '$stateParams', function(productService, $stateParams) {
          return productService.getProductAttributeValues($stateParams.id);
        }]
      }
    };

    var publishStatusState = {
      name: 'publishStatus',
      parent: 'product',
      url: '/product_publish_status',
      templateUrl: 'views/productDetailTabs/productPublishStatusTab.html',
      controller: 'ProductPublishStatusController',
      controllerAs: 'publishCtrl',
      resolve: {
        publishInfo: ['$stateParams', 'productService', function ($stateParams, productService) {
          var publishInfo = {};
          return productService.getUnpublishedProductInfo($stateParams.id)
            .then(function (data) {
              publishInfo.publishProperties = data;
              return productService.getPublishSettings();
            })
            .then(function (publishSettingsInfo) {
              publishInfo.publishSettings = publishSettingsInfo;
              return publishInfo;
            });
        }]
      }
    };

    var eanListState = {
      name: 'eanList',
      parent: 'product',
      url: '/product_ean_list',
      templateUrl: 'views/productDetailTabs/productEanListTab.html',
      controller: 'ProductEanListController',
      controllerAs: 'eanCtrl',
      resolve: {
        eanList: ['productService', '$stateParams', function (productService, $stateParams) {
          return productService.getProductEanList($stateParams.id);
        }]
      }
    };

    var pcbDimensionsState = {
      name: 'wmsInfo',
      parent: 'product',
      url: '/product_wms_info',
      templateUrl: 'views/productDetailTabs/wmsInfoTab.html',
      controller: 'ProductWmsInfoController as vm',
      resolve: {
        wmsInfo: ['wmsService', 'productInfo', function (wmsService, productInfo) {
          var wmsInfo = {};
          wmsInfo.dlc= productInfo.dlc;
          return wmsService.getPCBDimensions(productInfo.metiCode)
            .then(function (pcbDetails) {
              wmsInfo.pcbDetails = pcbDetails;
              return wmsService.getZoneList(1, 1000, {sortParameter: 'code', sortOrder: 'ASC'});
            })
            .then(function (data) {
              wmsInfo.zones = data.items;
              if (wmsInfo.pcbDetails.zoneId !== null) {
                return wmsService.getSectionList(wmsInfo.pcbDetails.zoneId, 1, 10000)
                  .then(function (sectionListModel) {
                    wmsInfo.sections = sectionListModel.items;
                    return wmsInfo;
                  });
              }
              else {
                return wmsInfo;
              }
            });
        }]
      }
    };

    var productListState = {
      name: 'productList',
      url: '/product_list',
      reloadOnSearch: false,
      templateUrl: 'views/productList.html',
      controller: 'productsListController',
      controllerAs: 'productsCtrl',
      hideNavbar: false,
      title: 'Products List',
      data: {
        roles: (function () {
          return ['ROLE_ADMIN', 'ROLE_WMS_ADMIN'];
        })()
      }

    };

    var mainProductListState = {
      name: 'mainList',
      parent: 'productList',
      url: '/main_product_list',
      templateUrl: 'views/productListDetailTabs/productListTab.html',
      controller: 'ProductMainListController',
      controllerAs: 'mainListCtrl'
    };

    var assignListState = {
      name: 'assignList',
      parent: 'productList',
      url: '/product_assign_list',
      templateUrl: 'views/productListDetailTabs/productListAssignCategoryTab.html',
      controller: 'ProductAssignListController',
      controllerAs: 'assignListCtrl'
    };

    var publishListState = {
      name: 'unpublishedList',
      parent: 'productList',
      url: '/product_unpublished_list',
      templateUrl: 'views/productListDetailTabs/productListUnpublishedTab.html',
      controller: 'ProductUnpublishedListController',
      controllerAs: 'unpublishedListCtrl',
      resolve: {
        publishSettings: ['productService', function(productService) {
            return productService.getPublishSettings();
        }]
      }
    };

    $stateProvider
      .state(catalogState)
      .state(productState)
      .state(productDetailsState)
      .state(metiFieldsState)
      .state(priceState)
      .state(imagesState)
      .state(productCategoriesState)
      .state(attributesState)
      .state(publishStatusState)
      .state(eanListState)
      .state(pcbDimensionsState)
      .state(productListState)
      .state(mainProductListState)
      .state(assignListState)
      .state(publishListState);
  }

})();
