(function (angular) {

  'use strict';
  angular.module('MadSkillsDeveloperWeb').directive('customNavBar', navbarDirective);

  function navbarDirective() {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/navbar.html',
      controller: navbarController,
      controllerAs: 'navCtrl'
    };

    function navbarController() {
      var vm = this;

      return vm;

    }
  }

})(angular);
