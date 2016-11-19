(function () {

  'use strict';
  angular.module('eCarrefourWeb').factory('responseToastInterceptor', responseToastInterceptor);

  function responseToastInterceptor($injector) {
    var interceptedUrlFormat = /\/*(api)\/.*/;
    var excludedUrlFormats = [
      /^\/api\/catalog\/product\/images\/validate$/,
      /^\/api\/stock$/,
      /^api\/order\/admin\/[0-9]+\/changeState$/,
      /api\/order\/admin\/[0-9]+\/products\/[0-9]+\/changeState/,
      /api\/alert\/.*/
    ];

    var interceptor = {};

    interceptor.response = function (originalResponse) {

      $injector.get('$rootScope').progressBar.complete();

      var entryCondition = interceptedUrlFormat.test(originalResponse.config.url)
                           && originalResponse.config.method !== 'GET';

      if (entryCondition) {

        _.forEach(excludedUrlFormats, function (elem) {
          if (elem.test(originalResponse.config.url)) {
            return entryCondition = false;
          }
        });

        var hasErrors = originalResponse.data.errors && (originalResponse.data.errors.length > 0);
        if (hasErrors) {
          _.forEach(originalResponse.data.errors, function (elem) {
            if (!elem.errorId) {
              $injector.get('toastr').warning(elem.message, 'Warning');
            }
          });
        }
        // else if (entryCondition) {
        //   $injector.get('toastr').success('Operation finished successfully', 'Success');
        // }

      }

      return originalResponse;
    };

    interceptor.responseError = function (error) {

      $injector.get('$rootScope').progressBar.complete();

      if (error.config && interceptedUrlFormat.test(error.config.url)
          && error.status !== 401 && error.status !== 403) {
        var message = (error.statusText || 'Connection Error');
        $injector.get('toastr').error(message, 'Error');
      }

      throw error;
    };

    return interceptor;

  }

})();
