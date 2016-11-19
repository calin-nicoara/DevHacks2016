(function () {

  'use strict';
  angular.module('eCarrefour.report')
    .controller('ProductInOrderController', productInOrderController);

  function productInOrderController(reportService, ngTableService, moment,
                                    reportDownloadUrlService, storeService) {
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
        title: 'Product EAN',
        field: 'product_ean'
      },
      {
        title: 'Product Meti code',
        field: 'product_code'
      },
      {
        title: 'Product site name',
        field: 'product_site_name'
      },
      {
        title: 'Product main category',
        field: 'product_main_category',
        filter: {
          productMainCategory: 'text'
        }
      },
      {
        title: 'Product subcategory',
        field: 'product_subcategory'
      },
      {
        title: 'Order number',
        field: 'order_id'
      },
      {
        title: 'Sub-order number',
        field: 'sub_order_id'
      },
      {
        title: 'Ordered quantity',
        field: 'ordered_quantity'
      },
      {
        title: 'Shipped quantity',
        field: 'shipped_quantity'
      },
      {
        title: 'Delivered quantity',
        field: 'delivered_quantity'
      },
      {
        title: 'Payment type',
        field: 'payment_type'
      },
      {
        title: 'Order date',
        field: 'order_date_time'
      },
      {
        title: 'Delivery date',
        field: 'delivery_date'
      },
      {
        title: 'Delivery interval',
        field: 'delivery_interval'
      },
      {
        title: 'Total price',
        field: 'total_price'
      },
      {
        title: 'Store',
        field: 'store_code',
        filter: {
          storeCode: 'select'
        },
        filterData: function () {
          var selectOptions = [
            {
              id: null,
              title: 'All stores'
            }
          ];
          _.forEach(storeService.getStores(), function (elem) {
            selectOptions.push({
                                 id: elem.code,
                                 title: elem.code
                               });
          });

          return selectOptions;
        }
      },
      {
        title: 'Client/Company name',
        field: 'billing_contact_name'
      },
      {
        title: 'Delivery city',
        field: 'delivery_city'
      },
      {
        title: 'Order status',
        field: 'order_status',
      }
    ];

    vm.getData = function (page, size, filterModel) {
      if (angular.isDefined(currentReport.fromDate) && moment(currentReport.fromDate, 'YYYY-MM-DD').isValid()) {
        filterModel.fromDate = moment(currentReport.fromDate).format('YYYY-MM-DD');
      }

      if (angular.isDefined(currentReport.toDate) && moment(currentReport.toDate, 'YYYY-MM-DD').isValid()) {
        filterModel.toDate = moment(currentReport.toDate).format('YYYY-MM-DD');
      }

      if (currentReport.orderType) {
        filterModel.orderType = currentReport.orderType;
      }

      return reportService.getProductInOrderList(page, size, filterModel);
    };

    return vm;
  }

})();
