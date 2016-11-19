(function () {

  'use strict';
  angular.module('eCarrefour.report').controller('SalesController', salesController);

  function salesController(reportService, ngTableService, moment, reportDownloadUrlService) {
    var vm = this;

    reportDownloadUrlService.setDownloadUrl(null);

    var currentReport = null;
    vm.firstTime = true;
    vm.generatedReport = {};

    vm.generatedReport.orderType = 'RECEIVED';

    vm.generateReport = function () {
      if (vm.firstTime) {
        vm.firstTime = false;
      }
      currentReport = _.clone(vm.generatedReport);
      ngTableService.reload();
    };

    vm.columns = [
      {
        title: 'Order number',
        field: 'order_id'
      },
      {
        title: 'Sub-order number',
        field: 'sub_order_id'
      },
      {
        title: 'Client id',
        field: 'client_id'
      },
      {
        title: 'Client name',
        field: 'client_name'
      },
      {
        title: 'Client phone number',
        field: 'client_phone_number'
      },
      {
        title: 'Order day',
        field: 'order_date'
      },
      {
        title: 'Delivery day',
        field: 'delivery_date'
      },
      {
        title: 'Delivery interval',
        field: 'delivery_interval'
      },
      {
        title: 'Initial amount',
        field: 'initial_amount'
      },
      {
        title: 'Delivered amount',
        field: 'delivered_amount'
      },
      {
        title: 'Charged amount',
        field: 'charged_amount'
      },
      {
        title: 'Final weight',
        field: 'final_weight'
      },
      {
        title: 'AWB number',
        field: 'awb_number'
      },
      {
        title: ' Delivery city/sector',
        field: 'delivery_city'
      },
      {
        title: 'Out of stock amount',
        field: 'out_of_stock_amount'
      },
      {
        title: 'Company name',
        field: 'company_name'
      },
      {
        title: 'Is delayed',
        field: 'is_delayed'
      },
      {
        title: 'Is mobile',
        field: 'is_mobile'
      },
      {
        title: 'Initial weight',
        field: 'initial_weight'
      },
      {
        title: 'Prepared weight',
        field: 'prepared_weight'
      },
      {
        title: 'Store',
        field: 'store_code'
      },
      {
        title: 'Payment type',
        field: 'payment_type'
      },
      {
        title: 'Street name',
        field: 'street_name'
      },
      {
        title: 'Street number',
        field: 'street_number'
      },
      {
        title: 'Order status',
        field: 'order_status'
      }

    ];

    vm.getData = function (page, size, filterModel) {

      if (angular.isDefined(currentReport.fromDate) && moment(currentReport.fromDate, 'YYYY-MM-DD')
          .isValid()) {
        filterModel.fromDate = moment(currentReport.fromDate).format('YYYY-MM-DD');
      }

      if (angular.isDefined(currentReport.toDate) && moment(currentReport.toDate, 'YYYY-MM-DD')
          .isValid()) {
        filterModel.toDate = moment(currentReport.toDate).format('YYYY-MM-DD');
      }

      if (currentReport.orderType) {
        filterModel.orderType = currentReport.orderType;
      }

      return reportService.getSalesList(page, size, filterModel);
    };

    return vm;
  }

})();
