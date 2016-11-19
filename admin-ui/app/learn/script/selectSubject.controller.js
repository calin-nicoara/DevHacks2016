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

        makeCall('GET', '/api/custom/subjects?userId=' + userId);

        return vm;
    }

})();
