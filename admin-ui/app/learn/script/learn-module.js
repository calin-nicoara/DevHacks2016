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

    }


}(angular));