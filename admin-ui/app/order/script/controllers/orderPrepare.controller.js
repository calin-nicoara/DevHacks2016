'use strict';

angular.module('eCarrefour.order')
  .controller("OrderPrepareController", function ($scope, $uibModal, $stateParams, $state,
                                                  NgTableParams, orderService, productService) {
    $scope.busy = false;
    $scope.data = {};
    $scope.currentComment = null;
    $scope.previousComment = 'Comment...';
    $scope.replacementProducts = [];
    $scope.selectedProduct = null;
    $scope.orderProducts = [];
    $scope.finalizeEnabled = false;
    $scope.orderSummary = {};
    $scope.replaceStarted = false;

    $scope.orderId = $stateParams.id;

    var changeStatus = function (productId, newStatus) {
      $scope.data.orderAdminProductModels = _.map($scope.data.orderAdminProductModels,
                                                  function (elem) {
                                                    if(elem.id === productId){
                                                      elem.status = newStatus;
                                                    }
                                                    return elem;
                                                  })
    };

    var isEnabledFinalize = function (orderProducts) {
      var finalizableStates = ['FOUND', 'NOT_FOUND', 'PROPOSED', 'ACKNOWLEDGED_OK', 'ACKNOWLEDGED_CANCEL'];
      var ok = true;

      _.forEach(orderProducts, function(orderProduct) {
        if (orderProduct.type === 'INITIAL' && finalizableStates.indexOf(orderProduct.status) === -1) {
          ok = false;
          return false;
        }
      });

      return ok;
    };

    var mapOrderProducts = function (data) {
      var orderProducts = [];

      data.forEach(function (elem) {
        var product = elem.initial;

        product.status = elem.status;
        product.id = elem.id;
        product.type = 'INITIAL';
        orderProducts = _.concat(orderProducts, product);

        if (elem.replacement) {
          product = elem.replacement;
          product.status = elem.status;
          product.id = elem.id;
          product.type = 'REPLACEMENT';
          orderProducts = _.concat(orderProducts, product);
        }
      });

      return orderProducts;
    };

    var getData = function () {

      $scope.busy = true;

      orderService.getOrderProductList($scope.orderId)
        .then(function (data) {
          $scope.data = data;

          $scope.orderProducts = mapOrderProducts($scope.data.orderAdminProductModels);
          $scope.finalizeEnabled = isEnabledFinalize($scope.orderProducts);
        })
        .catch(function (err) {
          $scope.error = "Something went wrong during server call ..";
          console.error(new Error(err.status || err.statusCode || err.message
                                  || 'Connection Error', err.data));
        })
        .finally(function () {
          $scope.busy = false;
        })
    };

    var initialize = function () {
      orderService.getOrderSummary($scope.orderId)
        .then(function (data) {
          $scope.orderSummary = data;
          if (['ASSIGNED', 'IN_WORK', 'VALIDATED_BY_CLIENT'].indexOf(data.orderStatus) === -1) {
            $state.go('orderList');
          }
          else if (data.orderStatus === 'ASSIGNED'){
            orderService.updateOrderStatus(data.id, 'IN_WORK')
              .then(function (reply) {
                getData();
              });
          }
          else {
            getData();
          }

        })
        .catch(function (err) {
          $state.go('orderList');
        });
    };

    initialize();

    $scope.updateStatus = function (product, status) {
      $scope.busy = true;

      orderService.updateOrderProductStatus($scope.orderId, product.id, status)
        .then(function (data) {
          if(status == 'FOUND' && product.status !== 'NEW'){
            $scope.orderProducts = _.filter($scope.orderProducts, function (el) {
              return !(el.id === product.id && el.type === 'REPLACEMENT');

            });
          }

          changeStatus(product.id, status);
          product.status = status;
          $scope.finalizeEnabled = isEnabledFinalize($scope.orderProducts);

        })
        .catch(function (err) {
          $scope.error = "Something went wrong during server call ..";
          console.error(new Error(err.status || err.statusCode || err.message
                                  || 'Connection Error', err.data));
        })
        .finally(function () {
          $scope.busy = false;
        })

    };

    $scope.saveComment = function () {
      $scope.busy = true;
      orderService.saveOrderComment($scope.orderId, $scope.currentComment)
        .then(function (data) {
          $scope.previousComment = "Old comment: " + $scope.currentComment;
          $scope.currentComment = null;
        })
        .catch(function (err) {
          $scope.error = "Something went wrong during server call ..";
          console.error(new Error(err.status || err.statusCode || err.message
                                  || 'Connection Error', err.data));
        })
        .finally(function () {
          $scope.busy = false;
        })
    };

    var modalInstance;

    $scope.startReplace = function (product) {
      $scope.replaceStarted = true;
      $scope.selectedProduct = product;

      modalInstance = $uibModal.open({
         animation: true,
         templateUrl: 'views/modals/orderReplaceModal.html',
         size: 'lg',
         scope: $scope
       });
    };

    $scope.closeModal = function() {
      modalInstance.close();
    };

    $scope.replace = function (product) {
      $scope.busy = true;

      orderService.replaceProduct($scope.orderId, $scope.selectedProduct.id, product)
        .then(function (data) {
          return orderService.getOrderProduct($scope.orderId, $scope.selectedProduct.id);
        })
        .then(function (newOrderProduct) {
          $scope.selectedProduct = null;
          $scope.replacementProducts = [];

          $scope.data.orderAdminProductModels = _.map($scope.data.orderAdminProductModels, function (el) {
            return (el.id === newOrderProduct.id) ? newOrderProduct : el;
          });

          //change old orderProduct
          $scope.orderProducts = mapOrderProducts($scope.data.orderAdminProductModels);

          $scope.finalizeEnabled = isEnabledFinalize($scope.orderProducts);

          modalInstance.close();
          $scope.replaceStarted = false;
        })
        .catch(function (err) {
          $scope.error = "Something went wrong during server call ..";
          console.error(new Error(err.status || err.statusCode || err.message
                                  || 'Connection Error', err.data));
        })
        .finally(function () {
          $scope.busy = false;

        })
    };

    $scope.acknowledge = function (product) {
      var newStatus = product.status === 'ACCEPTED' ? 'ACKNOWLEDGED_OK' : 'ACKNOWLEDGED_CANCEL';

      $scope.busy = true;
      orderService.updateOrderProductStatus($scope.orderId, product.id, newStatus)
        .then(function (reply) {
          changeStatus(product.id, newStatus);
          product.status = newStatus;
          $scope.finalizeEnabled = isEnabledFinalize($scope.orderProducts);
        })
        .catch(function (err) {
          $scope.error = "Something went wrong during server call ..";
          console.error(new Error(err.status || err.statusCode || err.message
                                  || 'Connection Error', err.data));
        })
        .finally(function () {
          $scope.busy = false;

        })

    };

    $scope.finalizeOrder = function () {

      var isPrepared = true;
      var isPreparedStatuses = ['ACKNOWLEDGED_OK', 'ACKNOWLEDGED_CANCEL'];

      $scope.data.orderAdminProductModels.forEach(function (elem) {
        if (elem.replacement && isPreparedStatuses.indexOf(elem.status) === -1) {
          isPrepared = false;
        }
      });

      var newState = isPrepared ? "PREPARED" : "WAITING_FOR_CLIENT";

      $scope.busy = true;
      orderService.updateOrderStatus($scope.orderId, newState)
        .then(function (data) {
          $state.go('order', {id: $scope.orderId});

        })
        .catch(function (err) {
          $scope.error = "Something went wrong during server call ..";
          console.error(new Error(err.status || err.statusCode || err.message
                                  || 'Connection Error', err.data));
        })
        .finally(function () {
          $scope.busy = false;
        });
    };

    $scope.replacementTableData = {
      columns: [
        {
          title: 'Meti Code (Product Code)',
          field: 'metiCode',
          sortable: 'productCode',
          filter: {productCode: 'text'}
        },
        {
          title: 'Meti Name',
          field: 'metiName',
          sortable: 'productName'
        },
        {
          title: 'Title (Site Name)',
          field: 'title'
        },
        {
          title: 'Stock',
          field: 'stock'
        },
        {
          title: 'Product Price',
          field: 'price'
        },
        {
          title: 'Quantity',
          field: 'replacementQuantity',
          getValue: function(row) {
            return '<input type="number" min="0" max="{{item.stock}}" ng-model="item.replacementQuantity">';
          }
        },
        {
          title: 'Action',
          getValue: function(row) {
            return '<button type="button" class="btn btn-primary" ng-click="scopeFunctions.replace(item)" '
                   + 'ng-disabled="item.replacementQuantity === 0">Select</button>'
          }
        }
      ],
      getData: function(page, size, filter) {
        return productService.list(page, size, filter)
          .then(function (data) {

            $scope.replacementProducts = data.items.map(function (elem) {
              elem.replacementQuantity = 0;
              return elem;
            });
            return {items: $scope.replacementProducts, totalCount: data['total_count']};
          })
      },
      scopeFunctions: {
        replace: $scope.replace
      }
      };
    return this;

  });
