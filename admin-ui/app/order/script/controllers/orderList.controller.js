(function () {
  'use strict';

  angular.module('eCarrefour.order')
    .controller('OrderListController', orderListController);

  function orderListController(orderService, authService, ngTableService, $log, SweetAlert) {
    var vm = this;

    vm.isCoord = authService.isInRole(['ROLE_COORD']);
    vm.isPicker = authService.isInRole(['ROLE_PICKER']);

    vm.busy = true;
    vm.data = {};
    vm.selectedRows = [];

    var pickers = {};

    var updateStatus = function (oldStatus, orderId) {
      var newStatus = oldStatus === 'PREPARED' ? 'SHIPPED' : 'DELIVERED';

      vm.busy = true;
      orderService.updateOrderStatus(orderId, newStatus)
        .then(function (reply) {
          $log.info('state changed', reply, newStatus);
          ngTableService.reload();
        })
        .catch(function (err) {
          vm.error = 'Something went wrong during server call ..';
          $log.error(new Error(err.status || err.statusCode || err.message
                               || 'Connection Error', err.data));
        })
        .finally(function () {
          vm.busy = false;
        });
    };

    var generateAWB = function (orderId, packages) {
      vm.busy = true;
      orderService.generateAWB({'sub_order_id': orderId, packages: packages})
        .then(function () {
          ngTableService.reload();
        })
        .catch(function (err) {
          vm.error = 'Something went wrong during server call ..';
          $log.error(new Error(err.status || err.statusCode || err.message
                               || 'Connection Error', err.data));
        })
        .finally(function () {
          vm.busy = false;
        });
    };

    var getAWBPdf = function (orderId) {
      return '/api/delivery/awb?sub_order_id=' + orderId;
    };

    vm.clearSelection = function () {
      vm.selectedRows.length = 0;
      ngTableService.reload();
    };

    var getDataFunction = function (page, size, filterModel) {
      if (vm.isCoord) {
        return orderService.getPickers()
          .then(function (pickersList) {

            return orderService.list(page, size, filterModel)
              .then(function (res) {
                _.forEach(res.items, function (elem) {
                  if (elem.pickerId) {
                    elem.pickerName = _.find(pickersList.items, {'id': elem.pickerId}).username;
                  }
                  else {
                    elem.pickerName = '';
                  }
                });
                return res;
              });
          });
      }
      else if (vm.isPicker) {
        return orderService.list(page, size, filterModel);
      }
    };

    function sendOrd(order) {
      SweetAlert.swal(
        {
          title: 'Are you sure you want to resend order?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes, I am sure!',
          closeOnConfirm: false
        },
        function (isConfirm) {
          if (isConfirm) {
            orderService.sendOrd(order.id)
              .then(function () {
                ngTableService.reload();
              });
          }

          swal.close();
        });
    }

    function printDetailsOrder(orderId) {
      return '/api/report/sub-order-print/' + orderId;
    }

    var initializeTableInfo = function () {
      vm.tableInfo = {
        columns: [
          {
            title: 'Client-order id',
            field: 'clientOrderId'
          },
          {
            title: 'Sub-order id',
            field: 'id'
          },
          {
            title: 'Amount',
            field: 'amount'
          },
          {
            title: 'SKUs',
            field: 'numberOfSkus',
            sortable: 'numberOfSkus'
          },
          {
            title: 'Id Client',
            field: 'clientId'
          },
          {
            title: 'Order Date',
            field: 'orderDate',
            getValue: function (row) {
              return row.orderDate.replace('T', ' ');
            }
          },
          {
            title: 'Pieces',
            field: 'numberOfPieces'
          },
          {
            title: 'Picker Name',
            field: 'pickerName',
            show: vm.isCoord,
            filter: {assignedPickerId: 'select'},
            filterData: function () {
              var selectOptions = _.map(pickers, function (value, key) {
                return {
                  id: key,
                  title: value
                };
              });
              selectOptions.splice(0, 0, {id: null, title: 'All'});

              return selectOptions;
            }
          },
          {
            title: 'Status',
            field: 'orderStatus',
            filter: {
              orderStatus: 'views/filters/multipleSelect.html'
            }
          },
          {
            title: 'Delivery Date',
            field: 'deliveryDate',
            sortable: 'deliveryDate',
            filter: {
              deliveryDate: 'views/filters/datePickerOrderDeliveryDate.html'
            }
          },
          {
            title: 'Start Hour',
            field: 'deliveryHourStart',
            sortable: 'deliveryHourStart',
            filter: {
              startHours: 'views/filters/greaterThanOrderStartHour.html'
            }
          },
          {
            title: 'End Hour',
            field: 'deliveryHourEnd',
            sortable: 'deliveryHourEnd',
            filter: {
              endHours: 'views/filters/lessThanOrderEndHour.html'
            }
          },
          {
            title: 'Actions',
            show: vm.isCoord,
            getValue: function (row) {

              var resendOrdButton = '<button class="btn btn-primary btn-table-action" '
                                    + 'ng-click="scopeFunctions.sendOrd(item)">'
                                    + 'Resend ORD</button>';

              var printDetailsOrdButton = '<a ng-href="{{scopeFunctions.printDetailsOrder(item.id)}}" target="_blank" data-toggle="tooltip" title="Print details" ' +
                'class="btn btn-primary btn-table-action initial-width">Print Details</a>'
              var actionButtonHtml = {
                'PREPARED': resendOrdButton
                            + '</br><button uib-popover-template="scopeFunctions.popoverTemplate" '
                            + 'data-toggle="tooltip" title="Generate AWB" '
                            + ' popover-title="Generate AWB" popover-trigger="outsideClick" class="btn btn-primary btn-table-action" '
                            + 'ng-click="orderId= ' + row.id + '">'
                            + '<i class="fa fa-truck" aria-hidden="true"></i></button>'
                            + printDetailsOrdButton,

                'SHIPPED': resendOrdButton
                           + '</br><button class="btn btn-primary btn-table-action initial-width" '
                           + 'ng-click="scopeFunctions.updateStatus(item.orderStatus, item.id)">'
                           + 'Delivered</button>'

                           + '<button uib-popover-template="scopeFunctions.popoverTemplate" '
                           + 'data-toggle="tooltip" title="Regenerate AWB" popover-title="Generate AWB" popover-trigger="outsideClick" '
                           + 'class="btn btn-primary btn-table-action initial-width" '
                           + 'ng-click="orderId= ' + row.id + '">'
                           + '<i class="fa fa-truck" aria-hidden="true"></i></button>'

                           + '<a ng-href="{{scopeFunctions.getAWBPdf(item.id)}}" target="_blank" data-toggle="tooltip" title="Download AWB pdf"'
                           + ' class="btn btn-primary btn-table-action initial-width">'
                           + '<i class="fa fa-file-pdf-o" aria-hidden="true"></i></a>'

                           +printDetailsOrdButton,

                'DELIVERED': printDetailsOrdButton,

                'OTHER': resendOrdButton

              };

              return actionButtonHtml[row.orderStatus] || actionButtonHtml['OTHER'];
            }
          },
          {
            title: 'Actions',
            show: !vm.isCoord && vm.isPicker,
            getValue: function (row) {
              var html = '<button class="btn btn-default" '
                         + 'ng-show="item.orderStatus == \'ASSIGNED\' || item.orderStatus ==\'IN_WORK\' '
                         + '|| item.orderStatus == \'VALIDATED_BY_CLIENT\' " '
                         + 'ui-sref="orderPrepare({id: ' + row.id
                         + '})" href="">Prepare</button>';

              return html;
            }
          },

          {
            title: 'Details',
            getValue: function (row) {
              var html = '<a class="btn btn-default" href="" ui-sref="order({id:'
                         + row.id + '})">Details</a>';
              return html;
            }
          }
        ],
        getData: getDataFunction,
        scopeFunctions: {
          updateStatus: updateStatus,
          generateAWB: generateAWB,
          getAWBPdf: getAWBPdf,
          sendOrd: sendOrd,
          printDetailsOrder: printDetailsOrder,
          popoverTemplate: 'views/popover/generateAwbPopoverTemplate.html'
        }
      };

    };

    var initialize = function () {
      if (vm.isCoord) {
        orderService.getPickers()
          .then(function (pickersList) {

            _.forEach(pickersList.items, function (picker) {
              pickers[picker.id] = picker.username;
            });

            initializeTableInfo();

          });
      }
      else if (vm.isPicker) {
        initializeTableInfo();
        vm.tableInfo.defaultFilters = {
          assignedPickerId: authService.getUser().id
        };
      }
    };

    initialize();

    return vm;

  }
})();

