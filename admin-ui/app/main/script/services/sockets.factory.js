(function (SockJS, Stomp) {

  'use strict';
  angular.module('MadSkillsDeveloperWeb').factory('socket', socketFactory);

  function socketFactory($q, $timeout) {
    var RECONNECT_TIMEOUT = 3000;
    var SOCKET_URL = '/notification-connection';
    var TOPIC = {
      //todo set available topics
    };

    var connectionOpened = false;
    var listener = $q.defer();
    var socket = {
      client: null,
      stomp: null
    };

    var reconnect = function () {
      $timeout(function () {
        initialize();
      }, RECONNECT_TIMEOUT);
    };

    var startListener = function (frame) {

      // socket.stomp.subscribe(TOPIC.price, function (data) {
      //   listener.notify(angular.fromJson(data.body));
      // });
    };

    return {
      receive: receive,
      initialize: initialize
    };

    function initialize() {
      if (!connectionOpened) {
        connectionOpened = true;
        socket.client = new SockJS(SOCKET_URL);
        socket.stomp = Stomp.over(socket.client);
        socket.stomp.debug = null;
        socket.stomp.connect({}, startListener);
        socket.stomp.onclose = reconnect;
      }
    }

    function receive() {
      return listener.promise;
    }

  }

})(SockJS, Stomp);
