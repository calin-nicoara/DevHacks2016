(function () {

  'use strict';
  angular.module("eCarrefourWeb").directive('ngInfiniteScroll', infiniteScroll);

  infiniteScroll.$inject = ['$rootScope', '$window', '$timeout'];

  function infiniteScroll($rootScope) {
    return {
      restrict: 'A',
      link: infiniteScrollLink
    };

    function infiniteScrollLink(scope, elem, attrs) {
      var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
      scrollDistance = 0;

      if (attrs.infiniteScrollDistance != null) {
        scope.$watch(attrs.infiniteScrollDistance, function (value) {
          return scrollDistance = parseInt(value, 10);
        });
      }
      scrollEnabled = true;
      checkWhenEnabled = false;
      if (attrs.infiniteScrollDisabled != null) {
        scope.$watch(attrs.infiniteScrollDisabled, function (value) {
          scrollEnabled = !value;
          if (scrollEnabled && checkWhenEnabled) {
            checkWhenEnabled = false;
            return handler();
          }
        });
      }

      handler = function () {
        elem = elem[0] || elem;

        var shouldScroll = elem.scrollTop + elem.offsetHeight >= elem.scrollHeight;

        if (shouldScroll && scrollEnabled) {
          if ($rootScope.$$phase) {
            return scope.$eval(attrs.ngInfiniteScroll);
          } else {
            scope.$apply(attrs.ngInfiniteScroll);
          }
        } else if (shouldScroll) {
          return checkWhenEnabled = true;
        }
      };

      angular.element(elem).on('scroll', handler);
      scope.$on('$destroy', function () {
        return angular.element(elem).off('scroll', handler);
      });
    }
  }

})();




