(function () {

    angular.module('MadSkillsDeveloper.learn').controller('SelectSubjectController', selectSubjectController);

    function selectSubjectController($http) {
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

        var userId = '1';

        makeCall('GET', 'api/subjects').then(function(subjectsReply) {
            makeCall('GET', '/api/custom/subjects?userId=' + userId).then(function(userSubjectsReply) {

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
        return vm;
    }

})();
