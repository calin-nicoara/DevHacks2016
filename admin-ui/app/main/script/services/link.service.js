(function () {

  'use strict';
  angular.module('eCarrefourWeb').factory('linkService', linkService);

  function linkService() {
    var service = {};

    var getRandomTime = (function () {
      var lastMillis = new Date().getTime();
      return function () {
        var curMillis = new Date().getTime();
        if (curMillis - lastMillis > 500) {
          lastMillis = curMillis;
        }
        return lastMillis;
      };
    })();

    service.getImageMediaSrc = function (name) {
      return '/media/' + name;
    };

    service.getImageMediaSrcWithTime = function (name) {
      return '/media/' + name + '?time=' + getRandomTime();
    };

    return service;

  }

})();
