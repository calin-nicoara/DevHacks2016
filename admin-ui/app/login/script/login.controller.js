(function () {

  'use strict';
  angular.module('MadSkillsDeveloper.login').controller('LoginController', loginController);
  function loginController($state, socket, $auth) {

    var vm = this;

    vm.authenticate = function (provider) {
      $auth.authenticate(provider)
        .then(function (res) {
          debugger
        })
    };

    var verifyAuthentication = function () {
      // if ($state.params.retryLogin) {
      //
      //   if (authService.isLoggedIn()) {
      //     successLogin();
      //   }
      //   else {
      //     authService.getAuthenticatedUser()
      //       .then(successLogin);
      //   }
      // }
      // else {
      //   authService.login();
      // }
    };

    verifyAuthentication();

    function successLogin() {
      socket.initialize();
      $state.go($state.params.to, $state.params.toParams, {location: 'replace'});
    }

    return vm;
  }

})();
