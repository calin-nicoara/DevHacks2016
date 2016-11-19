'use strict';
angular.module('eCarrefour.order')
  .service('orderService', function ($http) {
    var service = {};

    var makeCall = function (verb, url, data, params) {
      var base = '';
      return $http({
                     method: verb,
                     data: data,
                     url: base + url,
                     params: params
                   })
        .then(function (reply) {
          return reply.data;
        })
    };

    service.list = function (page, size, filterModel) {
      if (filterModel === undefined) {
        filterModel = {
          page: 1,
          size: 10
        }
      }

      filterModel.page = page - 1;
      filterModel.size = size;
      return makeCall('GET', '/api/order/admin/', '', filterModel);
    };


    service.getOrderSummary = function (id) {
      return makeCall('GET', 'api/order/admin/' + id);
    };

    service.getOrderHistory = function (orderId) {
      return makeCall('GET', 'api/order/admin/' + orderId + '/history');
    };

    service.getOrderProductList = function (id) {
      return makeCall('GET', 'api/order/admin/' + id + '/products');
    };

    service.getOrderProduct = function (orderId, productId) {
      return makeCall('GET', '/api/order/admin/' + orderId + '/products/' + productId);
    };

    service.assignPicker = function (orderList, picker) {

      var model = {};
      model.pickerId = picker;
      model.orderIds = orderList.map(function (elem) {
        return elem.id;
      });

      return makeCall('PUT', 'api/order/admin/assign/', model);
    };

    service.getPickers = function () {
      return makeCall('GET', '/api/sso-admin/user/', null, {role: 'ROLE_PICKER'})
    };

    service.getclientInfo = function (clientId) {
      return makeCall('GET', '/api/client/' + clientId);
    };

    service.updateOrderProductStatus = function (orderId, orderProductId, newState) {
      var model = {state: newState};

      return makeCall('PUT', '/api/order/admin/' + orderId + '/products/' + orderProductId
                             + '/changeState', model);
    };

    service.saveOrderComment = function (orderId, newComment) {
      var model = {comment: newComment};

      return makeCall('POST', '/api/order/admin/' + orderId + '/comment', model);
    };

    service.replaceProduct = function (orderId, orderProductId, replacementProduct) {
      var model = {
        product_code: replacementProduct.metiCode,
        title: replacementProduct.title,
        quantity: replacementProduct.replacementQuantity,
        price: replacementProduct.price

      };

      return makeCall('PUT',
                      '/api/order/admin/' + orderId + '/products/' + orderProductId + '/replace',
                      model);
    };

    service.updateOrderStatus = function (orderId, newStatus) {
      var model = {state: newStatus};
      return makeCall('PUT', '/api/order/admin/' + orderId + '/changeState', model);
    };

    service.generateAWB = function (model) {
      return makeCall('POST', 'api/delivery/awb/', model);
    };

    service.sendOrd = function (id) {
      return makeCall('PUT', '/api/middleware/admin/' + id + '/reset', '');
    };

    return service;
  });
