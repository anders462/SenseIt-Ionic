(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.activate')
   .controller('ActivateController',ActivateController);

  ActivateController.$inject = [
  '$location',
  '$ionicModal',
  '$scope',
  'activateFactory',
  'authFactory',
  'mqttFactory'
];


  function ActivateController($location,$ionicModal, $scope, activateFactory,authFactory,mqttFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.error = false;
  vm.activated = authFactory.getCurrentUser().activated;
  vm.mqttUsername = authFactory.getCurrentUser().username;
  vm.mqttPassword = '*******'

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
    console.log("activated from ac controller", vm.activated);
    if(vm.activated){
      vm.connectMqtt();
    }


    vm.openActivationModal = function(){
      $scope.activateTitle ="MQTT Account Settings";
      console.log("open Activate")

        // ngDialog.open({
        //    template: 'app/activate/activate.modal.html',
        //    className: 'ngdialog-theme-default',
        //    controller: 'ActivateController',
        //    controllerAs: 'vm',
        //    showClose: false,
        //    scope: $scope,
        //    closeByNavigation: true,
        //    closeByEscape: false
        // });
    };

///ADD MIN PASSWORD LENGTH of 8
    vm.activate = function(){
      console.log("creds",vm.activationData)
      activateFactory.activate(vm.activationData)
        .then(function(response){
          vm.activationData = '';
          vm.error = false;
          vm.activated = response.data.resp.activated;
          console.log('activated',vm.activated)
          authFactory.setCurrentUserActivated(vm.activated);
          activateFactory.notify();
          $scope.activateSubTitle ="Account is activated";
          vm.connectMqtt();
          console.log(response.data);
        })
        .catch(function(err){
          if(err.status == 500){
            console.log(err)
            vm.errorMessage = "Something went wrong!";
          } else {
            console.log(err)

            //vm.errorMessage = err.data.message;
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

    vm.closeThisDialog = function(){
      // ngDialog.close();
      $location.path('/dashboard');
    }

    vm.goToDashboard = function(){
      // ngDialog.close();
      $location.path('/dashboard');
    }

    mqttFactory.subscribe($scope, function connectionLost() {
      console.log("connectionLost");
      vm.connectMqtt();
    });



  }

})();
