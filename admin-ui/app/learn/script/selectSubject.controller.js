(function () {

    angular.module('MadSkillsDeveloper.learn').controller('SelectSubjectController', selectSubjectController);

    function selectSubjectController($http, $mdDialog, authService) {
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

        var userId = authService.getUser().id;

        makeCall('GET', 'api/subjects')
          .then(function(subjectsReply) {
            makeCall('GET', '/api/custom/subjects?userId=' + userId)
              .then(function(userSubjectsReply) {

                vm.allSubjects = subjectsReply._embedded.subjects;
                vm.userSubjects = userSubjectsReply;

                var selectedMap = {};
                _.forEach(vm.userSubjects, function (value,key) {
                    selectedMap[value.id] = true;
                });

                _.forEach(vm.allSubjects, function (value,key) {
                    if(selectedMap[value.id]) {
                        value.isChecked = true;
                    }
                });

            });
        });

        vm.submitSubjects = function() {
            var checkedSubjectsMap = {};
            _.forEach(vm.allSubjects, function (value,key) {
                if(value.hasOwnProperty("isChecked")) {
                    checkedSubjectsMap[value.id] = value.isChecked;
                }
            });
            makeCall('POST', '/api/custom/subjects?userId=' + userId, checkedSubjectsMap);
        };

        vm.addNewSubject = function (event) {
          $mdDialog.show({
            controller: dialogController,
            controllerAs: 'vm',
            templateUrl: 'views/addSubjectDialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true

          })
            .then(function (newSubject) {
              debugger
              vm.allSubjects.push(newSubject);

            }, function () {
              //cancel
            })
        };

        return vm;
    }

  function dialogController($mdDialog, $http, authService) {
    var vm = this;

    var userId = authService.getUser().id;

    vm.addSubject = function () {
      var subject = {};
      subject.name = vm.subject.name;
      subject.linkImage = vm.subject.linkImage;
      subject.popularity = 69;


      return $http({
        method: 'POST',
        data : subject,
        url: '/api/subjects?userId=' + userId
      }).then(function(response){
        $mdDialog.hide(response.data);
      });
    };

    vm.cancel = function () {
      $mdDialog.cancel();
    };

    return vm;

  }

})();
