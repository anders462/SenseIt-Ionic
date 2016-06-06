(function(){

'use strict'

//Factory for all sensors API calls part of sub module "core"
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

 var createMqttClient = function() {
   console.log("createMqttClient");
  //NEED TO ENCRYPT MQTT password
  //Gets credentials for mqtt account
   authFactory.getMe()
    .then(function(resp){
      //call connection function
      connect(resp.data);
    })
    .catch(function(err){
      console.log(err);
    })

var connect = function(creds){

  // Create a client instance
 var client = new Paho.MQTT.Client("m12.cloudmqtt.com", 32337,"web_" + parseInt(Math.random() * 100, 10));
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
  // Once a connection has been made, make a subscription.

    console.log("onConnect");
    //subscribe to my allowed topics
    client.subscribe(topic_all_mine);

  // $('#submit').click(function(key) {
  //          var text = $('#message').val();
  //          $('#message').val("");
  //          console.log("message",text);
  //          var message = new Paho.MQTT.Message(text);
  //          message.destinationName = topic_1;
  //          client.send(message);
  //
  // });

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

function getCachedMqttData(){
  return mqttData;
}


//Creates a handler to listen to connectionLost
var subscribe = function(scope, callback) {
        var handler = $rootScope.$on('connectionLost', callback);
        scope.$on('$destroy', handler);
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
        getCachedMqttData: getCachedMqttData
      };



};

})();
