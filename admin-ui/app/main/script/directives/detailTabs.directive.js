'use strict';
angular.module("eCarrefourWeb")
  .directive('detailTabs', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/detailTabs.html',
      scope: false,
      controller: 'detailTabsController'
    }
  })
  .controller('detailTabsController', function ($scope, $location, $state) {

    if($location.search().tab){
      $scope.currentTab = $scope.tabList[$location.search().tab - 1];
    }
    else {
      $scope.currentTab = $scope.tabList[0];
    }


    if (!$scope.busy) {
      $scope.busy = true;
    }

    $scope.onClickTab = function (tab) {
      $scope.currentTab = tab;
      if(tab.link !== undefined) {
        $state.go(tab.link.state, tab.link.params);
        return;
      }

      _.forEach(tab.query, function (value, key) {
        $location.search(key, value);
      });

      if($scope.watches && $scope.watches.length > 0) {
        _.forEach($scope.watches, function(unregister) {
          unregister();
        })
      }
      getData();
    };

    $scope.isActiveTab = function (tabUrl) {
      return tabUrl == $scope.currentTab.url;
    };

    var getData = function () {
      if ("data" in $scope.currentTab && $scope.currentTab.data !== null) {
        $scope.data = $scope.currentTab.data;
        $scope.busy = false;
      }
      else if ("getData" in $scope.currentTab && $scope.currentTab.getData !== null) {
        $scope.busy = true;
        $scope.currentTab.getData()
          .then(function (data) {
            $scope.data = data;
          })
          .catch(function (err) {
            $scope.error = "Something went wrong during server call ..";
            console.error(new Error(err.status || err.statusCode || err.message
                                    || 'Connection Error', err.data));

          })
          .finally(function () {
            $scope.busy = false;
          })
      }
      else {
        $scope.busy = false;
      }

    };

    getData();

  });
