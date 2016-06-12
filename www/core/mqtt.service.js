(function(){

'use strict'

//Factory that handles mqtt messaging part of sub module "core"
angular
.module('SenseIt.core')
  .factory('mqttFactory', mqttFactory);

  mqttFactory.$inject = [
    '$http',
    '$window',
    '$rootScope',
    'authFactory'
  ];

function mqttFactory ($http, $window, $rootScope, authFactory){

var mqttData = {};
var connected = false;

//create mqtt client
 var createMqttClient = function() {
   console.log("createMqttClient");
  //NEED TO ENCRYPT MQTT password
  //Gets credentials for mqtt account
   authFactory.getMe()
    .then(function(resp){
      //call connection function
      console.log("me",resp.data)
      connect(resp.data);
    })
    .catch(function(err){
      console.log(err);
    })


//connect to cloudmqtt via paho-mqtt client
var connect = function(creds){

  // Create a client instance!! use 32337 port for testing
 var client = new Paho.MQTT.Client("m12.cloudmqtt.com", 35588,"web_" + parseInt(Math.random() * 100, 10));
  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // set connections options
  var options = {
    useSSL: true,
    userName: creds.username,
    password: creds.mqtt,
    onSuccess:onConnect,
    onFailure:doFail
  }

  // connect the client
  client.connect(options);
  //define my allowed topics
  var topic_all_mine = "mysensor/" + creds.username + "/#";
  // console.log(topic_all_mine)

  // called when the client connects
  function onConnect() {
    //notify account is connected
    notifyConnect();
    console.log("onConnect");
    //subscribe to my allowed topics
    client.subscribe(topic_all_mine);
  }

  //NEED TO TRY TO RECONNECT
  function doFail(e){
    console.log("onFail err", e);
    notify();
  }

  //NEED TO TRY TO RECONNECT
  // notify() called when the client loses its connection
  function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
        notify();
      }
   }

  // called when a message arrives
  function onMessageArrived(message) {
      mqttData = message;
      notifyMqtt(message);
    //  console.log("onMessageArrived:"+message.payloadString,"topic",message.destinationName);
    }
 }
}

//get cached mqtt message (not used in this version, need set method as well)
function getCachedMqttData(){
  return mqttData;
}

//set connect status
function setConnected(status){
  connected = status;
}

//get connect status
function getConnected(){
  return connected;
}


//Creates a handler to listen to connectionLost
var subscribe = function(scope, callback) {
        var handler = $rootScope.$on('connectionLost', callback);
        scope.$on('$destroy', handler);
    }

//Creates a handler to listen to connection
var subscribeConnect = function(scope, callback) {
    var handler = $rootScope.$on('connection', callback);
    scope.$on('$destroy', handler);
}

//notify change connection
var notifyConnect = function() {
        $rootScope.$emit('connection');
    }

//notify change connectionLost
var notify = function() {
        $rootScope.$emit('connectionLost');
    }

    //Creates a handler to listen to connectionLost
    var subscribeMqtt = function(scope, callback) {
            var handler = $rootScope.$on('messageRecieved', callback);
            scope.$on('$destroy', handler);
        }

    //notify change connectionLost
    var notifyMqtt = function(message) {
            $rootScope.$emit('messageRecieved', message );
        }

    //methods available from mqttFactory
      return {
        createMqttClient: createMqttClient, //creates new client
        subscribe: subscribe, //subscribe handler for rootScope changes
        subscribeMqtt: subscribeMqtt,
        subscribeConnect: subscribeConnect,
        getCachedMqttData: getCachedMqttData,
        getConnected: getConnected,
        setConnected: setConnected
      };



};

})();
