(function () {

  angular.module('MadSkillsDeveloper.learn').controller('MissionController', quizController);

  function quizController($http, authService, learnService, $stateParams){
    var vm = this;

    vm.task = {};
    learnService.getStudyGroup($stateParams.groupId)
      .then(function(data) {
        vm.studyGroup = data;
      })

    return vm;
  }

})();
