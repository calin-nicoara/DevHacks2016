(function () {

  angular.module('MadSkillsDeveloper.learn').controller('QuizController', quizController);

  function quizController($http, $stateParams, $mdDialog){
    var vm = this;

    vm.selectedAnswers = {};
    vm.numberSelectAnswers = 0;
    vm.currentQuestionsInQuiz = 0;

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

    makeCall('GET', '/api/quizes/'+ $stateParams.id)
      .then(function(data) {
        vm.quiz = data;
        console.log(data);
      })
      .then(function() {
        makeCall('GET', '/api/custom/questions', null, {
          page: 0,
          size: 20,
          quizId: $stateParams.id
        })
          .then(function(dataQuestions) {
            _.forEach(dataQuestions, function(question) {
              var linesSplit = question.question.split("\n");
              question.title = linesSplit.splice(0, 1)[0];
              var answers = ["a", "b", "c", "d"];
              question.lines = _.zip(answers, linesSplit);
            });
            vm.questions = dataQuestions;
            vm.currentQuestionsInQuiz = vm.questions.length;
          })
      });

    vm.submitQuiz = function() {
      console.log(vm.questions);
      var correctAnswers = 0;
      _.forEach(vm.questions, function(question) {
        if(question.response === question.selection) {
          correctAnswers++;
        }
      });

      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title('Quiz results')
          .textContent('Congrats! You got ' + correctAnswers + " out of " +  vm.currentQuestionsInQuiz + " correct!")
          .ok('Got it!')
      );
    };

    vm.increaseAnswered = function() {
      vm.numberSelectAnswers++;
    };

    return vm;
  }

})();
