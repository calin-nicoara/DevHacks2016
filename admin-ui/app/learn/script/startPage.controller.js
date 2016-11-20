(function () {

  'use strict';
  angular.module('MadSkillsDeveloper.learn').controller('StartPageController', startPageController);
  function startPageController(learnService, subjects, $state) {

    var vm = this;

    vm.isNoob = true;
    vm.subjectsCompleted = false;
    vm.userSubjects = [];
    vm.teachingSubjects = [];


    vm.subjectsMap = subjects._embedded.subjects;
    _.forEach(vm.subjectsMap, function (elem) {
      vm.userSubjects[elem.id] = false;
      vm.teachingSubjects[elem.id] = false;
    });

    vm.startQuestions = [
      {
        text: 'Are you a noobie in IT business?',
        answers: {
          'No': '1',
          'Yes': '2'
        },
        show: true
      },

      {
        text: 'Cool! we have so many subjects that you may be interested in. Please select the ones that appeal to you. Also, don\'t'
              + ' forget that we are sure that we have something to learn from you too.',
        answers: vm.subjectsMap,
        show: false,
        send: true
      },

      {
        text: 'Are you a noobie in IT business?',
        answers: {
          'No': 'lessonSelect'
        }
        ,
        show: false
      }
      ,

    ]


    vm.startNoobProcess = function () {

    };

    vm.saveUserSubjects = function () {
      var subjectIds = _.map(vm.userSubjects, function (value, key) {
        if(value === true){
          return key;
        }
      });
      subjectIds = _.filter(subjectIds, function (elem) {
        return angular.isDefined(elem) && elem !== null;
      });

      learnService.saveNewUserSubject(subjectIds)
        .then(function () {
          vm.subjectsCompleted = true;
        })
    };

    vm.saveTeachingSubjects = function () {
      var subjectIds = _.map(vm.teachingSubjects, function (value, key) {
        if(value === true){
          return key;
        }
      });
      subjectIds = _.filter(subjectIds, function (elem) {
        return angular.isDefined(elem) && elem !== null;
      });

      if(subjectIds.length === 0){
        $state.go('learn', {}, {location: 'replace'});
      }
      else {
        learnService.saveTeacherSubject(subjectIds)
          .then(function () {
            $state.go('learn', {}, {location: 'replace'});
          })
      }
    };

    return vm;
  }

})();
