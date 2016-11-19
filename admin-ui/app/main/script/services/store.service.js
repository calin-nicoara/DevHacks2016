(function () {

  'use strict';
  angular.module('eCarrefourWeb').factory('storeService', storeService);

  function storeService($http, $q, $state) {
    var service = {
      setStores: setStores,
      setCurrentStore: setCurrentStore,
      changeStore: changeStore,
      getStores: getStores,
      currentStore: null
    };

    var stores = null;

    function changeStore(id, newStore) {
      _.remove(stores, {id: id});
      stores.push(newStore);
    }

    function getStores() {
        return stores;
    }

    function setStores() {
      var defer = $q.defer();
      if (stores === null) {
        $http.get('/api/delivery/store')
          .then(function (response) {
            stores = response.data;
            defer.resolve(stores);
          })
          .catch(function () {
            defer.reject('error retrieving stores');
          });
      }
      else {
        defer.resolve(stores);
      }
      return defer.promise;
    }

    function setCurrentStore(storeCode) {
      var reload = !!service.currentStore;
      service.currentStore = _.find(stores, {code: storeCode});
      if (reload){
        $state.reload();
      }
    }

    return service;
  }

})();
