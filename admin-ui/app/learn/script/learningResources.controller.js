(function (angular) {

  angular.module('MadSkillsDeveloper.learn').controller('LearningResourcesController', studentStudyGroups);

  function studentStudyGroups($http, $auth) {
    $auth.currentUser = { id: 1};
    var vm = this;


    vm.subjects = [
      {
        linkState: 'learningResourcesJavascript',
        name: 'Learn some nice Javascript!',
        smallTitle: 'You\'ll be all the rage at parties!',
        linkImage: 'https://www.sololearn.com/Icons/Courses/1024.png'
      },
      {
        linkState: 'learningResourcesJava',
        name: 'Java ain\'t dead yet!',
        smallTitle: 'Or is it a zombie!?',
        linkImage: 'https://ignite.apache.org/images/java.png'
      },
      {
        linkState: 'learningResourcesAndroid',
        name: 'Robots are cool!',
        smallTitle: 'Until they try to murder you...',
        linkImage: 'http://www.masonbruce.com/wp-content/uploads/2015/03/android-logo-transparent-background.png'
      },
    ];

    return vm;
  }

})(angular);
