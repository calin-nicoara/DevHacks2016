(function () {
  'use strict';

  angular.module('eCarrefour.order')
    .controller('OrderDetailsController', orderDetailsController);

  function orderDetailsController(selectedOrder) {
    var vm = this;

    vm.selectedOrder = mapOrderInfo(selectedOrder);

    function mapOrderInfo(info) {
      var mappedOrderInfo = _.clone(info);

      mappedOrderInfo.orderDate = mappedOrderInfo.orderDate.replace('T', ' ');
      mappedOrderInfo.deliveryAddress = mappedOrderInfo.deliveryAddress.city + ', Street ' + mappedOrderInfo.deliveryAddress.street
                                        + ', Number ' + mappedOrderInfo.deliveryAddress.streetNumber
                                        + ', Building ' + mappedOrderInfo.deliveryAddress.building
                                        + ', Floor ' + mappedOrderInfo.deliveryAddress.floor
                                        + ', Apartment' + mappedOrderInfo.deliveryAddress.apartment
                                        + ', Zip code ' + mappedOrderInfo.deliveryAddress.zipCode;
      mappedOrderInfo.deliveryDate = mappedOrderInfo.deliveryDate + ' / ' + mappedOrderInfo.deliveryHourStart + ' - ' + mappedOrderInfo.deliveryHourEnd;
      mappedOrderInfo.quantitiesInfo = mappedOrderInfo.numberOfSkus + ' / ' + mappedOrderInfo.numberOfPieces;
      mappedOrderInfo.weightsInfo = 'Initial: ' + mappedOrderInfo.initialTotalWeight  || '' + ' Shipped: ' + mappedOrderInfo.shippedTotalWeight || '' + ' Delivered: ' + mappedOrderInfo.deliveredTotalWeight || '';
      mappedOrderInfo.amountsInfo = 'Initial: ' + mappedOrderInfo.initialTotalAmountWithTax || '' + ' Shipped: ' + mappedOrderInfo.shippedTotalAmountWithTax || '' + ' Delivered: ' + mappedOrderInfo.deliveredTotalAmountWithTax || '';

      return mappedOrderInfo;
    }


    vm.clientInfoMapper = {
      firstname: 'First name',
      lastname: 'Last name',
      phone: 'Phone number',
      email: 'Email',
    };

    vm.orderDetailsMapper = {
      id: 'Sub-order id',
      clientOrderId: 'Client-order id',
      storeCode: 'Store',
      deliveryAddress: 'Delivery address',
      orderDate: 'Order date',
      deliveryDate: 'Delivery date / Delivery hour start - end',
      amount: 'Total price with tax',
      amountsInfo: 'Prices with taxes',
      weightsInfo: 'Weights',
      transportTaxValue: 'Transport tax value',
      weightTaxValue: 'Weight tax value',
      quantitiesInfo: 'Number of SUKs / Number of pieces',
      paymentType: 'Payment method',
      orderStatus: 'Order status'
    };

    return vm;
  }
})();
