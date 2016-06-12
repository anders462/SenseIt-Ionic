(function(){

'use strict';

//sensor sub module controller
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
  //reset all var and obj, get currentUser username and activated status
  vm.error = false;
  vm.sensorCreated = false;
  vm.activated = authFactory.getCurrentUser().activated;
  vm.sensorIdData = {};
  vm.deviceData = [];
  vm.oldDeviceid="";
  vm.sensorTopic ="";
  vm.deviceId = "";
  vm.currentUser = authFactory.getCurrentUser().username;


//get the cached sensor obj for certain sensor if
  var getCachedSensorId = function(sensorId){
    vm.sensorData = sensorFactory.getCachedSensors();
    vm.sensorData.forEach(function(sensor){
      if(sensor._id == sensorId){
        console.log("cached sensorId", sensor)
        vm.sensorIdData = sensor;
        vm.oldDeviceid = sensor.belongTo; //save what device sensor is currently connected to as it might change

      }
    });
  }

//get all cached devices
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

  // Create the sensor edit modal that we will use later
  $ionicModal.fromTemplateUrl('sensors/sensors.edit.html', {
    scope: $scope
  }).then(function(modal) {
    console.log("create sensors edit Modal");
    vm.sensorEditModal = modal;
  }).catch(function(err){
    console.log(err);
  });

  // Triggered in the sensor edit modal to close it
  vm.closeSensorEditModal = function() {
    console.log("close edit modal")
    vm.sensorEditModal.hide();
  };

  // Open the sensor edit modal
  vm.openSensorEditModal = function(sensorId){
    vm.error = false; //no error
    vm.deviceId = "";
    vm.sensorForm.$setPristine();
    getCachedSensorId(sensorId);
    getCachedDevices();
    vm.sensorEditModal.show();
  };


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

//add sensor function
    vm.addSensor = function(sensorData,deviceId){
      console.log("add sensor", deviceId, sensorData);
      sensorFactory.addSensorToDevice(sensorData,deviceId)
        .then(function(response){
          vm.sensorTitle ="Your MQTT Sensor topic";
          vm.sensorCreated = true;
          vm.sensorIdData = '';
          var user = authFactory.getCurrentUser();
          sensorFactory.notify(); //notify change in object
          deviceFactory.notify(); //notify change in object
          console.log("getuser",user)
          //setup data to display when new sensor been created
          //need to display valid topic for sensor etc
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

  vm.editSensor = function(){
      delete vm.sensorIdData.data;
      console.log("edited",vm.sensorIdData);
      sensorFactory.updateSensor(vm.oldDeviceid,vm.sensorIdData._id,vm.sensorIdData)
        .then(function(response){
          vm.sensorIdData = '';
          vm.closeSensorEditModal();
          vm.error = false;
          sensorFactory.notify(); //notify change in object
          deviceFactory.notify(); //notify change in object
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
          sensorFactory.notify(); //notify change in object
          deviceFactory.notify(); //notify change in object
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
