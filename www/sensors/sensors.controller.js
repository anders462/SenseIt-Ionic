(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.sensors')
   .controller('SensorController',SensorController);

  SensorController.$inject = [
    '$location',
    '$ionicModal',
    '$scope',
    'sensorFactory',
    'deviceFactory',
    'authFactory',
    'activateFactory'
  ];

  function SensorController($location,$ionicModal,$scope, sensorFactory, deviceFactory,authFactory,activateFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false;
  vm.sensorCreated = false;
  vm.activated = authFactory.getCurrentUser().activated;
  vm.sensorIdData = {};
  vm.deviceData = [];
  vm.oldDeviceid="";
  vm.sensorTopic ="";
  vm.deviceId = "";
  vm.currentUser = authFactory.getCurrentUser().username;


  var getCachedSensorId = function(sensorId){
    vm.sensorData = sensorFactory.getCachedSensors();
    vm.sensorData.forEach(function(sensor){
      if(sensor._id == sensorId){
        console.log("cached sensorId", sensor)
        vm.sensorIdData = sensor;
        vm.oldDeviceid = sensor.belongTo;

      }
    });
  }

  var getCachedDevices = function(){
    vm.deviceData = deviceFactory.getCachedDevices();
  };

  // Create the sensor modal that we will use later
  $ionicModal.fromTemplateUrl('sensors/sensors.add.html', {
    scope: $scope
   }).then(function(modal) {
    console.log("create sensor Modal");
    vm.sensorAddModal = modal;
   }).catch(function(err){
    console.log(err);
  });

  // Create the sensor delete modal that we will use later
  $ionicModal.fromTemplateUrl('sensors/sensors.delete.html', {
    scope: $scope
  }).then(function(modal) {
    console.log("create delete Modal");
    vm.sensorDeleteModal = modal;
  }).catch(function(err){
    console.log(err);
  });

  // Triggered in the sensor delete modal to close it
  vm.closeSensorDeleteModal = function() {
    console.log("close")
    vm.sensorDeleteModal.hide();
  };

// Open the sensor delete modal
  vm.openSensorDeleteModal = function(sensorId){
    getCachedSensorId(sensorId);
    console.log("open delete modal", sensorId);
    vm.sensorDeleteModal.show();
  };

  // Triggered in the device add modal to close it
  vm.closeSensorAddModal = function() {
    console.log("close")
    vm.sensorData = {}; // reset form
    vm.sensorAddModal.hide();
  };


// Open the sensor add modal
  vm.openSensorAddModal = function(){
    console.log("open modal");
    vm.error = false; //no error
    vm.sensorCreated = false;
    vm.deviceId = "";
    vm.sensorTitle = "Add Sensor";
    getCachedDevices();
    vm.activated = authFactory.getCurrentUser().activated;
    vm.sensorForm.$setPristine();
    vm.sensorAddModal.show();
  };


    vm.openSensorEditModal = function(sensorId){
      getCachedSensorId(sensorId);
      getCachedDevices();
      console.log($scope.sensorIdData)
          // ngDialog.open({
          //    template: 'app/sensors/sensors.edit.modal.html',
          //    className: 'ngdialog-theme-default',
          //    showClose: false,
          //    scope:$scope,
          //    closeByNavigation: true,
          //    closeByEscape: false
          // })
    }


    vm.addSensor = function(sensorData,deviceId){
      console.log("add sensor", deviceId, sensorData);
      sensorFactory.addSensorToDevice(sensorData,deviceId)
        .then(function(response){
          vm.sensorTitle ="Your MQTT Sensor topic";
          vm.sensorCreated = true;
          vm.sensorIdData = '';
          var user = authFactory.getCurrentUser();
          sensorFactory.notify();
          deviceFactory.notify();
          console.log("getuser",user)
          vm.sensorName = response.data.data.sensorName;
          vm.sensorTopic = "mysensor/" + user.username +'/' + response.data.data._id
          console.log("sensor topic", vm.sensorTopic);
          vm.error = false;
          console.log("response", response.data.data);
        })
        .catch(function(err){
          vm.error = true;
          if(err.status == 500){
            vm.errorMessage = "Sensor Name not unique!";
            console.log(vm.errorMessage, vm.error);
          } else {
            vm.errorMessage = err.data.message;
          }

        })
    }

    $scope.editSensor = function(){
      delete $scope.sensorIdData.data;
      console.log("edited",$scope.sensorIdData);
      sensorFactory.updateSensor(vm.oldDeviceid,$scope.sensorIdData._id,$scope.sensorIdData)
        .then(function(response){
          $scope.sensorIdData = '';
          ngDialog.close();
          vm.error = false;
          sensorFactory.notify();
          deviceFactory.notify();
          console.log("after sensor edit",response.data);
        })
        .catch(function(err){
          if(err.status == 500){
            vm.errorMessage = "Sensor Name is not unique!";
          } else {
            console.log(err)
            vm.errorMessage = err.data.message;
          }
          vm.error = true;
        })
    }

    vm.deleteSensor = function(deviceId,sensorId){
      console.log( "delete",deviceId,sensorId);
      sensorFactory.deleteSensor(deviceId,sensorId)
        .then(function(response){
          vm.closeSensorDeleteModal();
          vm.error = false;
          sensorFactory.notify();
          deviceFactory.notify();
          console.log("after sensor delete",response.data);
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
