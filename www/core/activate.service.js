(function(){
'use strict';

  //Factory for all sensors API calls part of sub module "core"
angular
  .module('SenseIt.core')
    .factory('activateFactory', activateFactory);

    activateFactory.$inject = [
      'BASE_URL',
      '$http',
      '$window',
      '$rootScope'
    ];

    function activateFactory (BASE_URL, $http,$window,$rootScope){


      // Activate MQTT account
      var activate = function(mqttPassword) {
        console.log(mqttPassword)
        return $http.post(BASE_URL +'activate',mqttPassword,{headers: {"x-access-token": $window.localStorage.token}});
      }


      // De Activate MQTT account
      var deActivate = function() {
        return $http.delete(BASE_URL +'activate',{headers: {"x-access-token": $window.localStorage.token}});
      }

      //Creates a handler to listen to device updates
      var subscribe = function(scope, callback) {
              var handler = $rootScope.$on('activationUpdated', callback);
              scope.$on('$destroy', handler);
          }
      //notify change in devices
      var notify = function(event) {
              $rootScope.$emit('activationUpdated');
          }


      return {
        activate: activate,
        deActivate: deActivate,
        subscribe: subscribe,
        notify: notify
      };


    };








})();
