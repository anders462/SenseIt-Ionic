(function(){
'use strict';

  //Factory for all device API calls part of sub module "core"
angular
  .module('SenseIt.core')
    .factory('deviceFactory', deviceFactory);

    deviceFactory.$inject = [
      'BASE_URL',
      '$http',
      '$window',
      '$rootScope'
    ];


    function deviceFactory (BASE_URL, $http,$window,$rootScope){
      var deviceData = [];
      // Adds new device (USED)
      var addDevice = function(deviceData) {
        return $http.post(BASE_URL +'devices',deviceData,{headers: {"x-access-token": $window.localStorage.token}});
      }

      // Get all devices beloning to user (USED)
      var getDevices = function() {
        return $http.get(BASE_URL +'devices',{headers: {"x-access-token": $window.localStorage.token}});
      }


      // Delete all devices Should this be allowed???? (Not USED)
      var deleteDevices = function() {
        return $http.delete(BASE_URL +'devices',{headers: {"x-access-token": $window.localStorage.token}});
      }


      // Get all device with deviceId (Not USED)
      var getDevice = function(deviceId) {
        return $http.get(BASE_URL +'devices/' + deviceId, {headers: {"x-access-token": $window.localStorage.token}});
      }


      // Delete device with deviceId (USED)
      var deleteDevice = function(deviceId) {
        return $http.delete(BASE_URL +'devices/' + deviceId, {headers: {"x-access-token": $window.localStorage.token}});
      }

      // Update device with deviceId (USED)
      var updateDevice = function(deviceId,newDeviceData) {
        return $http.put(BASE_URL +'devices/' + deviceId, newDeviceData, {headers: {"x-access-token": $window.localStorage.token}});
      }

      //Creates a handler to listen to device updates
      var subscribe = function(scope, callback) {
              var handler = $rootScope.$on('devicesUpdated', callback);
              scope.$on('$destroy', handler);
          }
      //notify change in devices
      var notify = function(event) {
              $rootScope.$emit('devicesUpdated');
          }
      //cache devices
      var cacheDevices = function(data){
            deviceData = data;
          }
      //get cached devices
      var getCachedDevices = function(){
            return deviceData;
          }


//make methods available for others to use
      return {
        addDevice: addDevice,
        getDevices: getDevices,
        deleteDevices: deleteDevices,
        getDevice: getDevice,
        deleteDevice: deleteDevice,
        updateDevice: updateDevice,
        subscribe: subscribe,
        cacheDevices: cacheDevices,
        getCachedDevices: getCachedDevices,
        notify: notify
      };


    };


})();
