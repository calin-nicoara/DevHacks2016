(function () {

  angular.module('MadSkillsDeveloper.learn').controller('MentorController', quizController);

  function quizController($http, authService, learnService){
    var vm = this;

   authService.getAuthenticatedUser()
     .then(function(data) {
      return learnService.getStudyGroupsForMentor(data.id);
    })
     .then(function(studyGroups) {
        vm.studyGroups = studyGroups;
       console.log(vm.studyGroups);
     });

    return vm;
  }

})();
