(function(){

'use strict';

//Activate sub module Controller
angular
  .module('SenseIt.activate')
   .controller('ActivateController',ActivateController);

  ActivateController.$inject = [
  '$state',
  '$ionicModal',
  '$scope',
  'activateFactory',
  'authFactory',
  'mqttFactory'
];


  function ActivateController($state,$ionicModal, $scope, activateFactory,authFactory,mqttFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false; //reset error messages for dialogs
  vm.currentUser = authFactory.getCurrentUser().username;  //get username for cache
  vm.activated = authFactory.getCurrentUser().activated; //get activation status from cache
  vm.toggleActivated = vm.activated; //set toggle flag for activate button
  vm.mqttUsername = authFactory.getCurrentUser().username; //get username for cache
  vm.mqttPassword = '*******';  //set masked PASSWORD
  vm.activationData ={};
  vm.connected = mqttFactory.getConnected(); //get connection status

    // call createMqttClient with 10 sec delay to take into
    //acount creation delay on cloudmqtt side as well, make sure
    //retry doesn't happen to often at connection fail or loss
    vm.connectMqtt = function(){
      var timeOut = setTimeout(function(){
        clearTimeout(timeOut);
        mqttFactory.createMqttClient()
      },10000);
    };

    //if customer is already activated  not connected try to connect to mqtt service
    if(vm.activated && !vm.connected){
      vm.connectMqtt();
    }

    // Create the register modal that we will use later
    $ionicModal.fromTemplateUrl('activate/activate.html', {
      scope: $scope
    }).then(function(modal) {
      vm.activateModal = modal;
    });

    // Triggered in the activate modal to close it
    vm.closeActivate = function() {
      console.log("close")
      vm.activateData = {}; // reset form
      vm.toggleActivated = vm.activated; //change state of button
      vm.mqttPassword ='';
      vm.activateModal.hide();
    };


  // Open the activate modal
    vm.openActivationModal = function(statusChange){
      vm.error = false; //no error
      vm.activateForm.$setPristine();
      vm.activateModal.show();
      vm.activateTitle ="MQTT Account Settings";
      console.log("open Activate", statusChange);
    };


///Note: ADD MIN PASSWORD LENGTH of 8
//activate user account on CloudMqtt
    vm.doActivate = function(){
      console.log("creds",vm.activationData);
      activateFactory.activate(vm.activationData)
        .then(function(response){
          vm.activationData = '';
          vm.error = false;
          vm.activated = response.data.resp.activated;
          vm.toggleActivated = vm.activated;
          vm.mqttPassword = response.data.resp.cmq_password;
          console.log('activated',vm.activated)
          authFactory.setCurrentUserActivated(vm.activated);
          activateFactory.notify();
          vm.connectMqtt();
        })
        .catch(function(err){
          if(err.status == 500){
            console.log(err)
            vm.errorMessage = "Something went wrong!";
          } else {
            console.log(err)
          }
          vm.activationData = '';
          vm.error = true;
        })
    }

    //deActivate == delete CloudMqtt account
    vm.deActivate = function(){
      activateFactory.deActivate()
        .then(function(response){
          vm.error = false;
          vm.activated = response.data.resp.activated;
          console.log('activated',vm.activated)
          authFactory.setCurrentUserActivated(vm.activated); //cache status change
          activateFactory.notify(); //notify status change
          vm.toggleActivated = vm.activated;
          vm.closeActivate();
        })
        .catch(function(err){
          if(err.status == 500){
            console.log(err)
            vm.errorMessage = "Something went wrong!";
          } else {
            console.log(err)
          }
          vm.error = true;
        })
    }

    //subscribe to connectionLost event listner
    mqttFactory.subscribe($scope, function connectionLost() {
      console.log("connectionLost");
      mqttFactory.setConnected(false);
      vm.connected = mqttFactory.getConnected();
      vm.connectMqtt();
    });

    //subscribe to connect event listner
    mqttFactory.subscribeConnect($scope, function connect() {
      console.log("connected");
      mqttFactory.setConnected(true);
      vm.connected = mqttFactory.getConnected();
    });

//set validation params
    vm.shouldValidate = function(name){
      var rules = {
        password: true,
        password_len: 0,
      }
      return rules[name];
    }


  }

})();
