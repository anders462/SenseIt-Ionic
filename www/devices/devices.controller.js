(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.devices')
   .controller('DeviceController',DeviceController);

  DeviceController.$inject = [
  '$location',
  '$ionicModal',
  '$scope',
  'deviceFactory',
  'authFactory',
  '$rootScope'
];

  function DeviceController($location,$ionicModal,$scope, deviceFactory, authFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false;
  vm.activated = authFactory.getCurrentUser().activated;
  $scope.deviceIdData = {};
  vm.deviceForm ={};
  vm.deviceData = {};
  vm.currentUser = authFactory.getCurrentUser().username;

    var getCachedDeviceId = function(deviceId){
      vm.deviceData = deviceFactory.getCachedDevices();
      vm.deviceData.forEach(function(device){
        if(device._id == deviceId){
          vm.deviceIdData = device;
        }
      });
    }

    // Create the add device modal that we will use later
    $ionicModal.fromTemplateUrl('devices/devices.add.html', {
      scope: $scope
    }).then(function(modal) {
      console.log("create device Modal");
      vm.deviceAddModal = modal;
    }).catch(function(err){
      console.log(err);
    });

    // Create the device delete modal that we will use later
    $ionicModal.fromTemplateUrl('devices/devices.delete.html', {
      scope: $scope
    }).then(function(modal) {
      console.log("create delete Modal");
      vm.deviceDeleteModal = modal;
    }).catch(function(err){
      console.log(err);
    });

    // Create the device edit modal that we will use later
    $ionicModal.fromTemplateUrl('devices/devices.edit.html', {
      scope: $scope
    }).then(function(modal) {
      console.log("create edit Modal");
      vm.deviceEditModal = modal;
    }).catch(function(err){
      console.log(err);
    });

    // Triggered in the device edit modal to close it
    vm.closeDeviceEditModal = function() {
      console.log("close edit modal")
      vm.deviceEditModal.hide();
    };

    // Open the device edit modal
    vm.openDeviceEditModal = function(deviceId){
      getCachedDeviceId(deviceId);
      console.log(vm.deviceIdData);
      console.log("open editmodal", deviceId);
      vm.deviceEditModal.show();
    };

    // Triggered in the device delete modal to close it
    vm.closeDeviceDeleteModal = function() {
      console.log("close")
      vm.deviceDeleteModal.hide();
    };

  // Open the device delete modal
    vm.openDeviceDeleteModal = function(deviceId){
      getCachedDeviceId(deviceId);
      console.log(vm.deviceIdData);
      console.log("open delete modal", deviceId);
      vm.deviceDeleteModal.show();
    };

    // Triggered in the device add modal to close it
    vm.closeDeviceAddModal = function() {
      console.log("close")
      vm.deviceData = {}; // reset form
      vm.deviceAddModal.hide();
    };

  // Open the device add modal
    vm.openDeviceAddModal = function(){
      console.log("open add modal");
      vm.error = false; //no error
      vm.deviceForm.$setPristine();
      vm.deviceAddModal.show();
    };



    vm.addDevice = function(){
      console.log("device",vm.deviceData)
      deviceFactory.addDevice(vm.deviceData)
        .then(function(response){
          vm.deviceData = '';
          vm.closeDeviceAddModal();
          vm.error = false;
          deviceFactory.notify();
          console.log(response.data);
        })
        .catch(function(err){
          if(err.status == 500){
            vm.errorMessage = "Device Name not unique!";
          } else {
            console.log(err)
            vm.errorMessage = err.data.message;
          }
          vm.error = true;
        })
    }

     vm.editDevice = function(deviceData){
       console.log("editDevice",deviceData);
       delete deviceData.sensors;
      deviceFactory.updateDevice(deviceData._id,deviceData)
        .then(function(response){
          vm.deviceIdData = '';
          vm.closeDeviceEditModal();
          vm.error = false;
          deviceFactory.notify();
          console.log("after device edit",response.data);
        })
        .catch(function(err){
          if(err.status == 500){
            vm.errorMessage = "Device Name not unique!";
          } else {
            console.log(err)
            vm.errorMessage = err.data.message;
          }
          vm.error = true;
        })
    }

    vm.deleteDevice = function(deviceId){
      console.log( "delete",deviceId);
      deviceFactory.deleteDevice(deviceId)
        .then(function(response){
          vm.closeDeviceDeleteModal();
          vm.error = false;
          deviceFactory.notify();
          console.log("after device delete",response.data);
        })
        .catch(function(err){
          if(err.status == 500){
            vm.errorMessage = "Something went wrong!";
          } else {
            console.log(err)
            vm.errorMessage = err.data.message;
          }
          vm.error = true;
        })
    }

  }

})();
