(function () {

  'use strict';
  angular.module('MadSkillsDeveloper.login').controller('LoginController', loginController);
  function loginController($state, authService, socket) {

    var vm = this;

    var verifyAuthentication = function () {
      if ($state.params.retryLogin) {

        if (authService.isLoggedIn()) {
          successLogin();
        }
        else {
          authService.getAuthenticatedUser()
            .then(successLogin);
        }
      }
      else {
        authService.login();
      }
    };

    verifyAuthentication();

    function successLogin() {
      socket.initialize();
      $state.go($state.params.to, $state.params.toParams, {location: 'replace'});
    }

    return vm;
  }

})();
