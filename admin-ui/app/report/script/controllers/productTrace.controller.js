(function () {

  'use strict';
  angular.module('eCarrefour.report').controller('ProductTraceController', productTraceController);

  function productTraceController(reportService, ngTableService, moment, reportDownloadUrlService) {
    var vm = this;

    reportDownloadUrlService.setDownloadUrl(null);

    vm.currentProduct = null;
    vm.currentReport = {};
    vm.generateReport = generateReport;

    vm.popover = {
      productCode: {
        visible: false,
        message: 'Please insert product code'
      }
    };

    vm.closePopover = function(popoverObject) {
      popoverObject.visible = false;
    };

    function generateReport() {
      if(!_.isEmpty(vm.currentReport.productCode)) {
        vm.currentProduct = _.clone(vm.currentReport);
        ngTableService.reload();
      } else {
        vm.popover.productCode.visible = true;
      }

    }

    vm.columns = [
      {
        title: 'Date of operation',
        field: 'operation_date_time'
      },
      {
        title: 'Product code',
        field: 'product_code'
      },
      {
        title: 'Site name',
        field: 'product_site_name'
      },
      {
        title: 'Operator',
        field: 'operator',
        filter: {
          isSystemOperator: 'select'
        },
        filterData: [
          {id: null, title: 'All'},
          {id: true, title: 'System'},
          {id: false, title: 'Backend user'}
        ]
      },
      {
        title: 'Operation',
        field: 'operation'
      },
      {
        title: 'Initial value',
        field: 'initial_value'
      },
      {
        title: 'Changed value',
        field: 'new_value'
      }
    ];
    vm.getData = function (page, size, filterModel) {
      if(angular.isDefined(vm.currentProduct.fromDate) && moment(vm.currentProduct.fromDate, 'YYYY-MM-DD').isValid()) {
        vm.currentProduct.fromDate = moment(vm.currentProduct.fromDate).format('YYYY-MM-DD');
      }
      if(angular.isDefined(vm.currentProduct.toDate) && moment(vm.currentProduct.toDate, 'YYYY-MM-DD').isValid()) {
        vm.currentProduct.toDate = moment(vm.currentProduct.toDate).format('YYYY-MM-DD');
      }

      return reportService.getProductTraceList(page, size, _.merge(vm.currentProduct, filterModel));
    };
    vm.scopeFunctions = {};

    return vm;
  }

})();
