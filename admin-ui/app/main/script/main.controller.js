(function () {

  angular.module('MadSkillsDeveloperWeb').controller('AppController', mainController);

  function mainController($scope) {
    var vm = this;


    function stateChangeSuccess(ev, toState) {

    }

    var unStateChangeSuccess = $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    $scope.$on('$destroy', function () {
      unStateChangeSuccess();
    });

    return vm;

  }

})();
