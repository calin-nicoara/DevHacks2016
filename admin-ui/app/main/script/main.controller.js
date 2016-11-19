(function () {

  angular.module('webApp').controller('AppController', mainController);

  function mainController($scope, $rootScope, $state) {
    var vm = this;

    $rootScope.stateTitle = {
      name: null
    };
    vm.hideNavbar = false;
    vm.title = $rootScope.stateTitle;

    function stateChangeSuccess(ev, toState) {
      vm.hideNavbar = toState.hideNavbar;
      if (angular.isDefined(toState.title)) {
        $rootScope.stateTitle = {
          name: toState.title
        };
      }
      else if (angular.isDefined($state.current.parent) &&
               angular.isDefined($state.get($state.current.parent).title)) {
        $rootScope.stateTitle = {
          name: $state.get($state.current.parent).title
        };
      }
      vm.title = $rootScope.stateTitle;
    }

    var unStateChangeSuccess = $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    $scope.$on('$destroy', function () {
      unStateChangeSuccess();
    });

    return vm;

  }

})();
