(function () {

  angular.module('MadSkillsDeveloperWeb').controller('AppController', mainController);

  function mainController($scope, authService) {
    var vm = this;

    vm.hideNavbar = false;
    vm.user = authService.getUser();

    vm.navbarItems = [
      {
        title: 'Subjects',
        description: 'Select your subjects capable for your skills!',
        icon: 'css/icons/learn.svg',
        state: 'selectSubject'
      },
      {
        title: 'Study groups',
        description: 'It\'s time to play with others',
        icon: 'css/icons/study_group.svg',
        state: 'studentStudyGroups'
      },
      {
        title: 'Resources',
        description: 'Take a look at some collected tutorials from our partners',
        icon: 'css/icons/external_resources.svg',
        state: 'learningResources'
      }
    ];

    function stateChangeSuccess(ev, toState) {
      vm.user = authService.getUser();
      if(toState.name === 'login'){
        vm.hideNavbar = true;
      }

      if(toState.hideNavbar){
        vm.hideNavbar = true;
      }
      else {
        vm.hideNavbar = false;
      }

    }

    var unStateChangeSuccess = $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    $scope.$on('$destroy', function () {
      unStateChangeSuccess();
    });

    return vm;

  }

})();
