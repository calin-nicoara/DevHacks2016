(function () {

  'use strict';
  angular.module('eCarrefour.report').controller('ReportController', reportController);

  function reportController($state, reportService, reportDownloadUrlService) {
    var vm = this;

    vm.viewList = [
      {
        name: 'productTrace',
        title: 'Product trace'
      },
      {
        name: 'orderComment',
        title: 'Order Comments'
      },
      {
        name: 'productInOrder',
        title: 'Products in order'
      },
      {
        name: 'sales',
        title: 'Sales'
      },
      {
        name: 'clientStatus',
        title: 'Client status'
      }
    ];

    vm.isActiveTab = isActiveTab;
    vm.startDownloadTemplate = reportDownloadUrlService.getDownloadUrl;

    function isActiveTab(viewName) {
      return $state.current.name === viewName;
    }

    return vm;
  }
})();
