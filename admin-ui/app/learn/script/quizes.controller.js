(function () {

  angular.module('MadSkillsDeveloper.learn').controller('QuizzesController', quizController);

  function quizController($http, $stateParams){
    var vm = this;

    var makeCall = function (verb, url, data, params) {
      return $http({
                     method: verb,
                     data : data,
                     url: url,
                     params: params
                   })
        .then(function (reply) {
          return reply.data;
        });
    };

    makeCall('GET', '/api/custom/quizzes?subjectId='+ $stateParams.subject)
      .then(function(data) {
        vm.quizzes = data;
        console.log(vm.quizzes);
      })
      .then(function() {
        console.log('BLABLA');
      });

    return vm;
  }

})();
