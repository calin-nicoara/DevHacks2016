(function () {

  'use strict';
  angular.module('eCarrefour.settings')
    .controller('MaintenanceController', maintenanceController);

  function maintenanceController(settingsService, SweetAlert) {
    var vm = this;
    var maintenanceModel = {};

    vm.textMaintenance = {
      on: {
        p: 'Maintenance mode is ON! Turn if off to put the webShop back online. The admin site will also be down a few seconds.',
        button: 'Turn maintenance mode OFF',
        prompt: 'Are you sure you want to turn maintenance mode OFF? This will put the webShop back online.'
      },
      off: {
        p: 'Maintenance mode is OFF! Site running as normal. When maintenance mode is ON, the webShop'
           + ' is not accessible. The admin site will also be down a few seconds.',
        button: 'Turn maintenance mode ON',
        prompt: 'Are you sure you want to turn maintenance mode ON? This will make the webShop inaccessible!'
      }
    };

    vm.changeMaintenanceMode = function() {
      maintenanceModel['is_in_maintenance_mode'] = vm.currentMaintenance !== 'on';
      SweetAlert.swal(
        {
          title: vm.textMaintenance[vm.currentMaintenance].prompt,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes, I am sure!',
          closeOnConfirm: false
        },
        function (isConfirm) {
          if (isConfirm) {
            settingsService.setMaintenanceSettings(maintenanceModel)
              .then(function() { updateCurrentMaintenance(maintenanceModel); });
          }
          swal.close();
        });
    };

    settingsService.getMaintenanceInfo().then(updateCurrentMaintenance);

    function updateCurrentMaintenance(data) {
      maintenanceModel = data;
      vm.currentMaintenance = data['is_in_maintenance_mode'] ? 'on': 'off';
    }

    return vm;

  }
})();