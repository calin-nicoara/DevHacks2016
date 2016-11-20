(function (angular) {

  angular.module('MadSkillsDeveloper.learn').controller('StudentStudyGroupsController', studentStudyGroups);

  function studentStudyGroups($http, $auth) {
    $auth.currentUser = { id: 1};
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

    makeCall('GET', '/api/custom/studyGroups?userId=' + $auth.currentUser.id)
      .then(function(data) {
        vm.subjects = data;
      });

    return vm;
  }

})(angular);
