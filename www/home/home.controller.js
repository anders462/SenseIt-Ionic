(function(){

'use strict';

//home page sub module controller
angular
  .module('SenseIt.home')
   .controller('HomeController',HomeController);


  HomeController.$inject = ['$scope','$state','authFactory'];

  function HomeController($scope, $state,authFactory){
//
  var vm = this; //set vm (view model) to reference main object
  //check user loggedIn
  vm.loggedIn = function(){
    return authFactory.getAuthState();
  }
//goToDashboard function
  vm.goToDashboard = function(){
      if (vm.loggedIn()){
      $state.go('app.dashboard');
    }
  }
};

})();
