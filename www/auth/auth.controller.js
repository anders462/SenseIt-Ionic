(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.auth')
   .controller('AuthController',AuthController);

  AuthController.$inject = ['$state','$scope', '$ionicModal', '$timeout','authFactory'];

  function AuthController($state, $scope, $ionicModal, $timeout, authFactory){

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
  vm.registerData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('auth/login.html', {
    scope: $scope,
  }).then(function(modal) {
    vm.loginModal = modal;
  });


  // Create the register modal that we will use later
  $ionicModal.fromTemplateUrl('auth/register.html', {
    scope: $scope
  }).then(function(modal) {
    vm.regModal = modal;
  });

  // Create the logout modal that we will use later
  $ionicModal.fromTemplateUrl('auth/logout.html', {
    scope: $scope
  }).then(function(modal) {
    vm.logoutModal = modal;
  });

  // Triggered in the login modal to close it
  vm.closeLogin = function() {
    vm.loginData = {}; // reset form
    vm.loginModal.hide();
  };

  // Open the login modal
  vm.login = function() {
    vm.closeRegister();
    vm.error = false; //no error
    vm.loginForm.$setPristine();
    vm.loginModal.show();
  };

  // Open the register modal
  vm.register = function() {
    vm.closeLogin();
    vm.error = false; //no error
    vm.registerForm.$setUntouched(true);
    vm.registerData = {}; // reset form
    vm.regModal.show();
  };

  // Triggered in the register modal to close it
  //!!!!! reseting of errors doesn't work, second reg old value shows up if error occured
  vm.closeRegister = function() {
    vm.registerData = {}; // reset form
    vm.regModal.hide();
  };

  // Open the logout modal
  vm.logout = function() {
    vm.logoutModal.show();
  };

  // Triggered in the register modal to close it
  vm.closeLogout = function() {
    vm.logoutModal.hide();
    $state.go('app.dashboard');

  };

  // Perform the login action when the user submits the login form
    vm.doLogin = function(){
      console.log("loginData", vm.loginData.username, vm.loginData.password);
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
          $state.go('app.dashboard');//go to dashboard
        })
        .catch(function(err){
          console.log("ERROR",err.data.err.message);
          vm.error = true; //show error message
          vm.errorMessage = err.data.err.message; //log error message
        })
    }
// !!!!!! $invalid submit dim doesn't work///
    vm.doRegister = function(){
      console.log("registration obj",vm.registerData)
      authFactory.register(vm.registerData)
        .then(function(response){
          vm.registerData = {};
          vm.closeRegister();
          vm.error = false;
          console.log(response);
          vm.login();

        })
        .catch(function(err){
          console.log(err.data.err.message);
          vm.error = true;
          vm.errorMessage = err.data.err.message;
        })

    }

    vm.shouldValidate = function(name){
      var rules = {
        username: true,
        username_len: 3,
        password: true,
        password_len: 8,
        email: true,
        firstname: false,
        lastname: false
      }
      return rules[name];
    }


      vm.doLogout = function(){
        authFactory.deleteToken();
        authFactory.cacheAuthState(false);
        vm.closeLogout();
      }




  }


})();
