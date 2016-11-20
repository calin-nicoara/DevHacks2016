(function (angular) {

  angular.module('MadSkillsDeveloper.learn')
    .controller('StudentStudyGroupsController', studentStudyGroups);

  function studentStudyGroups($mdDialog) {
    var vm = this;

    vm.startJoinGroup = function (event) {
      $mdDialog.show({
                       controller: dialogController,
                       controllerAs: 'vm',
                       templateUrl: 'views/joinGroupDialog.html',
                       parent: angular.element(document.body),
                       targetEvent: event,
                       clickOutsideToClose: true,
                       resolve: {
                         subjects: function (learnService) {
                           return learnService.getUserSubjects();
                         }
                       }
                     })
        .then(function (answer) {

        }, function () {
          //cancel
        });
    };

    return vm;
  }

  function dialogController($mdDialog, subjects, learnService) {
    var vm = this;
    vm.isJoinDisabled = true;

    vm.subjects = subjects;
    vm.selectedSubject = null;
    vm.selectedGroup = null;
    vm.studyGroups = [];

    vm.getStudyGroups = function () {
      return learnService.getStudyGroupsForSubject(vm.selectedSubject)
        .then(function (res) {
          vm.studyGroups = res;
          return res;
        })
    };

    vm.joinGroup = function () {
      learnService.addUserToStudyGroup(vm.selectedGroup)
        .then(function () {
          $mdDialog.hide('ok');
        })
    };

    vm.cancel = function () {
      $mdDialog.cancel();
    };

    return vm;

  }

})(angular);
