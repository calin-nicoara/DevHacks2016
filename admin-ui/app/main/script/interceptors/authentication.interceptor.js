angular.module('eCarrefourWeb')

  // This http interceptor listens for authentication failures
  .factory('authenticationInterceptor', function ($injector) {

    var interceptor = {
      responseError: function (error) {
        switch (error.status) {
         case 401:
           $injector.get('$state').go('login', {retryLogin: false}, {reload: true});
           break;
         case 403:
           $injector.get('$state').go('notAuthorized');
           break;
         default:
           break;
        }
        
        throw error;
      }
    };

    return interceptor;

  });
