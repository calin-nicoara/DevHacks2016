(function () {

  angular.module('MadSkillsDeveloper.learn').controller('LearnController', learnController);

  function learnController() {
      var vm = this;

      vm.markers = [];

      vm.map = {center : {latitude: 45 ,longitude: -73}, zoom: 8};

      return vm;
  }

})();
