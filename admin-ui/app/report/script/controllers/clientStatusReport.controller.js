(function () {

  'use strict';
  angular.module('eCarrefour.report').controller('ClientStatusController', clientStatusController);

  function clientStatusController(reportService) {
    var vm = this;

    reportService.getMaximumAddressesForClient()
      .then(function(data) {
        var deliveryPrefix = 'delivery_addresses_';
        var companyDetailsPrefix = 'company_details_';
        var maximumAddresses = data['max_addresses'];
        var maximumBillingInfos = data['max_billing'];

        vm.columns = [
          {
            title: 'Client Id',
            field: 'client_id',
            show: true
          },
          {
            title: 'First Name',
            field: 'first_name',
            show: true
          },
          {
            title: 'Last Name',
            field: 'last_name',
            show: true
          },
          {
            title: 'Email',
            field: 'email',
            show: true
          },
          {
            title: 'Phone Number',
            field: 'phone_number',
            show: true
          },
          {
            title: 'Account Creation Date',
            field: 'account_creation_date',
            show: true
          },
          {
            title: 'First Order Date',
            field: 'first_order_date',
            show: true
          },
          {
            title: 'Last login Date',
            field: 'last_login_date',
            show: true
          },
          {
            title: 'Last order Date',
            field: 'last_order_date',
            show: true
          },
          {
            title: 'Gender',
            field: 'gender',
            show: true
          },
          {
            title: 'Birthday',
            field: 'birthday',
            show: true
          },
          {
            title: 'Total Number of orders',
            field: 'total_number_of_orders',
            show: true
          },
          {
            title: 'Number of finalized orders',
            field: 'number_of_finalized_orders',
            show: true
          }
        ];

        for(var i = 1; i <= maximumBillingInfos; i++) {
          vm.columns.push({
            title: "Company Details " + i,
            field: companyDetailsPrefix + i,
            getValue: getCompanyDetailsValue(i),
            show: true
          })
        }

        for(var i = 1; i <= maximumAddresses; i++) {
          vm.columns.push({
            title: "Delivery address " + i,
            field: deliveryPrefix + i,
            getValue: getDeliveryAddresessValue(i),
            show: true
          })
        }

        vm.getData = function(page, size, filterModel){
          return reportService.getClientStatusReport(page, size, filterModel)
            .then(function(data) {
              showHideMultiColumn(data, vm.columns);
              return data;
            });
        };

        vm.scopeFunctions = {};

        function getDeliveryAddresessValue(i) {
          return function() {return '<span class="nb-table-wide-cell">{{ item.delivery_addresses[' + (i-1) + '] }}</span>' }
        }

        function getCompanyDetailsValue(i) {
          return function() {return '<span class="nb-table-wide-cell">{{ item.company_details[' + (i-1) + '] }}</span>' }
        }

        function showHideMultiColumn(data, columns) {
          hideAndShowColumnsForField('company_details', companyDetailsPrefix, maximumBillingInfos);
          hideAndShowColumnsForField('delivery_addresses', deliveryPrefix, maximumAddresses);

          function hideAndShowColumnsForField(fieldName, prefix, maxGeneral) {
            var maxOnCurrentSelection = _
              .chain(data.items)
              .map(function(item) {
                return item[fieldName] ? item[fieldName].length : 0;
              })
              .max()
              .value();

            var firstIndexOfField = _.findIndex(columns, function(columnItem) {
              return columnItem.field === prefix + '1';
            });

            for(var i = firstIndexOfField;
                i < firstIndexOfField + maxOnCurrentSelection; i++) {
              columns[i].show = true;
            }

            for(var j = firstIndexOfField + maxOnCurrentSelection;
                j < firstIndexOfField + maxGeneral; j++) {
              columns[j].show = false;
            }
          }
        }
      });

    return vm;
  }

})();
