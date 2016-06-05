(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.login')
   .controller('LoginController',LoginController);

  LoginController.$inject = ['$scope', '$ionicModal', '$timeout','$location','authFactory'];

  function LoginController($scope, $ionicModal, $timeout,$location, authFactory){

  var vm = this; //set vm (view model) to reference main object

  //init no error in submission is so check if user has actived MQTT account
  vm.error = false;
  //getCurrentUser if set and
  if (authFactory.getCurrentUser()){
    vm.activated = authFactory.getCurrentUser().activated || false;
  } else {
    vm.activated =  false;
  }

  vm.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('login/login.html', {
    scope: $scope
  }).then(function(modal) {
    vm.modal = modal;
  });

  // Triggered in the login modal to close it
  vm.closeLogin = function() {
    vm.modal.hide();
    vm.loginData = {}; // reset form
  };

  // Open the login modal
  vm.login = function() {
    vm.error = false; //no error
    vm.loginForm.$setPristine();
    vm.modal.show();
  };


  // Perform the login action when the user submits the login form
    vm.doLogin = function(){
      authFactory.login(vm.loginData)
        .then(function(response){
          vm.loginData = {}; // reset form
          vm.closeLogin(); //close login
          vm.error = false; //no error
          authFactory.setToken(response.data.token); //store token in LocalStorage
          authFactory.setCurrentUser(response.data.user); //store Username in LocalStorage
          authFactory.cacheAuthState(true); //cache Auth State
          vm.activated = authFactory.getCurrentUser().activated; //update activation status in LocalStorage
          console.log(response.data);
          $location.path('/dashboard');//go to dashboard
        })
        .catch(function(err){
          console.log(err.data.err.message);
          vm.error = true; //show error message
          vm.errorMessage = err.data.err.message; //log error message
        })
    }

    vm.openRegister = function(){
      vm.closeLogin(); //close login
      $location.path('/register');
    }
  //
  //   vm.doLogout = function(){
  //     authFactory.logout()
  //     .then(function(resp){
  //       console.log("logged out");
  //       authFactory.deleteToken();
  //     })
  //     .catch(function(err){
  //       console.log(err);
  //     })
  //   }


  }

})();
