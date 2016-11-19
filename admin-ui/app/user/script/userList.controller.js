(function () {

  'use strict';
  angular.module('eCarrefour.user').controller('userListController', userListController);

  function userListController($uibModal, userService, ngTableService, authService) {
    var vm = this;

    vm.tableInfo = {
      columns: [
        {
          title: 'Name of user',
          field: 'username'
        },
        {
          title: 'Active',
          field: 'enabled'
        },
        {
          title: 'Action',
          getValue: function () {
            return '<button type="button" class="btn btn-info"'
                   + 'ng-click="scopeFunctions.addEditUser(item.id)">View/Edit Details </button>';
          }
        }
      ],
      getData: userService.getUserList,
      scopeFunctions: {addEditUser: addEditUser}
    };

    vm.addEditUser = addEditUser;

    function addEditUser(id) {
      var userModal = $uibModal.open(
        {
          templateUrl: 'views/addEditUser.html',
          controller: 'addUserController',
          controllerAs: 'addUserCtrl',
          resolve: { 
            userEditModel: function () {
              if (angular.isDefined(id)) {
                return userService.getUserDetails(id).then(mapEntity);
              }
              else {
                return {};
              }
            }
          }
        });

      userModal.result.then(addSaveUser);
    }

    function addSaveUser(model) {
      model = mapModel(model);
      userService.addUser(model)
        .then(function () {
          if (model.id === authService.getUser().id){
            authService.getAuthenticatedUser();
          }
          ngTableService.reload();
        });
    }

    function mapEntity(entity) {
      var model = entity.userModel;
      model.roles = _.reduce(model.roles, function (rolesObject, currentRole) {
        rolesObject[currentRole] = true;
        return rolesObject;
      }, {});

      model.stores = _.reduce(model.stores, function (storeObj, store) {
        storeObj[store] = true;
        return storeObj;
      }, {});
      return model;
    }

    function mapModel(model) {
      var entity = model;

      entity.roles = _.transform(entity.roles, function (rolesObject, value, key) {
        if (value) {
          rolesObject.push(key);
        }
        return rolesObject;
      }, []);
      entity.stores = _.transform(entity.stores, function (storeList, value, key) {
        if (value) {
          storeList.push(key);
        }
        return storeList;
      }, []);

      if (entity.enabled !== true) {
        entity.enabled = false;
      }

      return entity;
    }

    return vm;

  }

})();
