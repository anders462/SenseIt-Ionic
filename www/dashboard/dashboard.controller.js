(function(){

'use strict';

//dashboard page sub module controller
angular
  .module('SenseIt.dashboard')
   .controller('DashboardController',DashboardController);

  DashboardController.$inject = [
    '$state',
    'deviceFactory',
    'sensorFactory',
    '$scope',
    '$ionicModal',
    '$rootScope',
    'authFactory',
    'activateFactory',
    'mqttFactory',
    'chartFactory',
    '$ionicScrollDelegate',
    '$location'
  ];

function DashboardController($state,deviceFactory,sensorFactory,$scope,$ionicModal,$rootScope,authFactory,activateFactory,mqttFactory,chartFactory,$ionicScrollDelegate,$location){

  var vm = this; //set vm (view model) to reference main object
  //reset all var and objects
  vm.deviceData = [];
  vm.sensorData = [];
  vm.messages = [];
  vm.mqttData = {};
  vm.liveData =[];
  var topic = "";
  var MAX_SAMPLE_TIME = 30*60*1000; //throttle to 30 min max sample time, due to Mobile limitations
  //setup of defaultChart data when no other Historical is available
  var defaultChart = null;
  var defaultSampleType;
  var sampleSeries = [{ name:'sample-name', data:[[5757579399,2],[5757579400,3],[5757579401,4],[5757579402,3],[5757579403,5],[5757579404,4]] }];

 // Note: CHANGE TO REQUEST FULL OBJECT ONE TIME
 //get current user and activation status
  vm.activated = authFactory.getCurrentUser().activated;
  vm.currentUser = authFactory.getCurrentUser().username;

//gets anchor from location hash and goes to anchor
vm.goToAnchor = function(anchor){
  $location.hash(anchor);
  $ionicScrollDelegate.anchorScroll(true);
}


//update chart
//this is a somewhat complicated function that need to
//be refactored in later versions
//sensorId is the id of the sensor beeing chart and sampleType
//is the type of value to chart, for ex temperature
vm.updateChart = function(sensorId,sampleType) {
  var series = [];
  var data = [];
  var point;
  var chartTitle;
  console.log("updateChart",sensorId,sampleType)
  var yAxisData = sampleType + " sample value";
  //format samples to the correct format for HighCharts
  var sensor = vm.sensorData.filter(function(sensor){
    if (sensor._id == sensorId){
      chartTitle = "Historical data for sensor " + sensor.sensorName;
      return sensor;
    }
  })
 var oldSampleTime = sensor[0].data[0].time;
 //limit sample rate to MAX_SAMPLE_TIME
 sensor[0].data.forEach(function(obj,index){
   if (obj.time >= (oldSampleTime + MAX_SAMPLE_TIME) ) {
     point = [obj.time,obj.data[sampleType]];
     data.push(point);
     oldSampleTime = obj.time;
   }
 })
 console.log("sample size",data.length);
 var sample = {name:sampleType,data:data};
 series.push(sample);
 //chart the values using HighCharts
 chartFactory.chartValues(series,chartTitle, yAxisData);
};

//count the total historical messages from all sensors
  var countMessages = function(sensorData){
    vm.messages = sensorData.reduce(function(aggr,curr,index,arr){
      // console.log(curr.sensorName, curr.data.length, defaultChart );
      if (defaultChart == null && curr.data.length > 0 ){
        defaultChart = curr._id;
        defaultSampleType = Object.keys(curr.data[0].data)[0];
        console.log("defaultChart", defaultChart, defaultSampleType);
        vm.updateChart(defaultChart, defaultSampleType)
      }
      aggr += curr.data.length;
      return aggr;
    },0);
    if (vm.messages == 0){
      //if no historical data show default chart
      chartFactory.chartValues(sampleSeries,"Sample", "Sample");
    }
  }

  //update mqtt data as a new message was received
  var updateMqttData  = function(data){
    var payload = getPayload(data.payloadString);
    var id = getId(data.destinationName);
    var mappedSensorData = getMatch(id,payload);
    //update liveData with the new message
    vm.liveData = mappedSensorData.filter(function(sensor){
      if (sensor.hasOwnProperty('payload')){
        return sensor;
      }
    });
    $scope.$apply();
  }
  //format mqtt payload to obj
  var getPayload = function(data){
    return JSON.parse(data).d;
  }
  //return sensor id from topic
  var getId = function(data){
    return data.split('/')[2];
  }
  //return sensor that matched the id and
  //adds a  new playload object to sensor obj
  var getMatch = function(id, payload){
    var mapped = vm.sensorData.map(function(sensor){
      if(sensor._id == id){
        sensor.payload =[];
        var keys = Object.keys(payload);
        keys.forEach(function(key){
          sensor.payload.push({type:key,value:Math.round(payload[key]*10)/10})
        })
        return sensor;
      } else {
        return sensor;
      }
    })
    return mapped;
  }
  //update device model
  var updateDeviceModel = function(){
    deviceFactory.getDevices()
      .then(function(response){
        //update device data
        vm.deviceData = response.data;
        //cache device in factory
        deviceFactory.cacheDevices(vm.deviceData);
      })
      .catch(function(err){
        console.log(err);
      })
  };
  //update sensor model
  var updateSensorModel = function(){
    sensorFactory.getAllSensors()
      .then(function(response){
        //update sensor data
        vm.sensorData = response.data;
        //update sensor data counts
        countMessages(vm.sensorData);
        //cache sensor data
        sensorFactory.cacheSensors(vm.sensorData);
      })
      .catch(function(err){
        console.log(err);
      })
  };

//update device and sensor objects when page reload
  $scope.$on('$stateChangeSuccess',function(){
    ///ADD LOADING.... Message
    //CAN I DO THIS FROM CACHE INSTEAD??
    console.log("updateDeviceModel and updateSensorModel")
      updateDeviceModel();
      updateSensorModel();

    }());

    //listen for device update events
    deviceFactory.subscribe($scope, function deviceUpdated() {
      console.log("devices updated emit received");
      updateDeviceModel();
     });

     //listen for Sensor update events
     sensorFactory.subscribe($scope, function sensorUpdated() {
       console.log("sensors updated emit received");
       updateSensorModel();
      //  console.log(sensorFactory.getCachedSensors());
      });

      //listen for change in activation status
      activateFactory.subscribe($scope, function activationUpdated() {
        console.log("activation updated emit received");
        vm.activated = authFactory.getCurrentUser().activated;
       });

       //listen for new mqtt message
       mqttFactory.subscribeMqtt($scope, function messageUpdated(event,data) {
        console.log("new mqtt message received", data.payloadString, data.destinationName);
         //check valid payload object
         if(typeof JSON.parse(data.payloadString) =='object'){
           updateMqttData(data);
           vm.messages++;
         }
       });

  }

})();
