(function () {
  'use strict';
  angular.module('eCarrefourWeb').factory('requestToastInterceptor', requestToastInterceptor);

  function requestToastInterceptor($injector, $q) {

    var excludedDeleteUrlFormats = [
      /\/*media\/api\/images[a-z0-9\/]*/
    ];

    var interceptor = {};

    interceptor.request = function (config) {
      var storeService = $injector.get('storeService');
      if(storeService.currentStore){
        config.headers['X-STORE-CODE'] = storeService.currentStore.code;
      }

      var deferred = $q.defer();

      var entryCondition = config.method === 'DELETE';
      _.forEach(excludedDeleteUrlFormats, function (elem) {
        if (elem.test(config.url)) {
          return entryCondition = false;
        }
      });

      if (entryCondition) {
        $injector.get('SweetAlert').swal(
          {
            title: 'Are you sure you want to delete this?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            closeOnConfirm: false
          },
          function (isConfirm) {
            if (isConfirm) {
              $injector.get('$rootScope').progressBar.start();
              deferred.resolve(config);
            }
            swal.close();
          });
      }
      else {
        $injector.get('$rootScope').progressBar.start();
        deferred.resolve(config);
      }

      return deferred.promise;

    };

    return interceptor;
  }

})();
