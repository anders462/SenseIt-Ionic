(function(){

'use strict';

//activate page sub module
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
  vm.error = false;
  vm.currentUser = authFactory.getCurrentUser().username;
  vm.activated = authFactory.getCurrentUser().activated;
  vm.toggleActivated = vm.activated;
  vm.mqttUsername = authFactory.getCurrentUser().username;
  vm.mqttPassword = '*******';
  vm.activationData ={};
  vm.connected = mqttFactory.getConnected();

    // call createMqttClient with 10 sec delay to take into
    //acount creation delay on cloudmqtt side as well, make sure
    //retry doesn't happen to often at connection fail or loss
    vm.connectMqtt = function(){
      var timeOut = setTimeout(function(){
        clearTimeout(timeOut);
        mqttFactory.createMqttClient()
      },10000);
    };

    //if customer is already activated try to connect to mqtt service
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
      vm.toggleActivated = vm.activated;
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


///ADD MIN PASSWORD LENGTH of 8
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

    vm.deActivate = function(){
      activateFactory.deActivate()
        .then(function(response){
          vm.error = false;
          vm.activated = response.data.resp.activated;
          console.log('activated',vm.activated)
          authFactory.setCurrentUserActivated(vm.activated);
          activateFactory.notify();
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


    mqttFactory.subscribe($scope, function connectionLost() {
      console.log("connectionLost");
      mqttFactory.setConnected(false);
      vm.connected = mqttFactory.getConnected();
      vm.connectMqtt();
    });

    mqttFactory.subscribeConnect($scope, function connect() {
      console.log("connected");
      mqttFactory.setConnected(true);
      vm.connected = mqttFactory.getConnected();
    });


    vm.shouldValidate = function(name){
      var rules = {
        password: true,
        password_len: 0,
      }
      return rules[name];
    }


  }

})();
