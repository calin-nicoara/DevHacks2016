(function () {
  'use strict';

  angular.module('eCarrefour.client')
    .controller('ClientListController', clientListController);
  function clientListController(clientService) {

    var vm = this;

    vm.tableInfo = {
      columns: [
        {
          title: 'Id',
          field: 'client_id'
        },
        {
          title: 'Email',
          field: 'email',
          filter: {email: 'text'}
        }, {
          title: 'First Name',
          field: 'firstname',
          sortable: 'firstName'
        },
        {
          title: 'Last Name',
          field: 'lastname',
          sortable: 'lastName'
        },
        {
          title: 'Phone',
          field: 'phone'
        },
        {
          title: 'Details',
          getValue: function (row) {
            return '<a class="btn btn-default" href="" ui-sref="client({id:'
                   + row.client_id + '})">Details</a>';
          }
        }
      ],
      getData: clientService.list
    };

    return vm;

  }

})();
