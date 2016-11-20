(function () {

  'use strict';
  angular.module('MadSkillsDeveloper.login').controller('LoginController', loginController);
  function loginController($state, socket, $auth, authService) {

    var vm = this;

    vm.authenticate = function (provider) {
      $auth.authenticate(provider)
        .then(function (res) {
          authService.authenticateUser({
            id: 1,
            fullName: 'Calin Nicoara',
            email: 'calin2811@gmail.com',
            imageLink: 'https://avatars2.githubusercontent.com/u/2725593?v=3&s=400'
                                       })
            .then(function () {
              $state.go('startPage');
            });

          return res
        })

    };

    var verifyAuthentication = function () {
      if ($state.params.retryLogin) {

        if (authService.isLoggedIn()) {
          successLogin();
        }
        else {
          vm.busy = true;
          authService.getAuthenticatedUser()
            .then(successLogin)
            .catch(function () {
              vm.busy = false;
            })
        }
      }
      else {
        authService.login();
      }
    };

    verifyAuthentication();

    function successLogin() {
      // vm.busy = false;
      socket.initialize();
      $state.go($state.params.to || 'learn', $state.params.toParams, {location: 'replace'});
    }

    return vm;
  }

})();
