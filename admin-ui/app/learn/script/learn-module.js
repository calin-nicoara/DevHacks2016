(function (angular) {

  'use strict';
  angular.module('MadSkillsDeveloper.learn', ['uiGmapgoogle-maps']).config(configure);

  function configure($stateProvider) {

    $stateProvider.state('learn', {
      url: '/learn',
      templateUrl: 'views/learn.html',
      controller: 'LearnController as vm'
    });

    $stateProvider.state('selectSubject', {
      url: '/selectSubject',
      templateUrl: 'views/selectSubject.html',
      controller: 'SelectSubjectController as vm'
    });

    $stateProvider.state('studentStudyGroups', {
      url: '/student/studyGroups',
      templateUrl: 'views/studentStudyGroups.html',
      controller: 'StudentStudyGroupsController as vm',
      resolve: {
        studyGroups: function (learnService) {
          return learnService.getStudyGroupsForUser();
        }
      }
    });

    $stateProvider.state('learningResources', {
      url: '/learningResources',
      templateUrl: 'views/learningResources.html',
      controller: 'LearningResourcesController as vm'
    });

    $stateProvider.state('learningResourcesJavascript', {
      url: '/learningResourcesJavascript',
      templateUrl: 'views/learningResourcesJavascript.html',
      controller: 'LearningResourcesController as vm'
    });
  }

}(angular));
