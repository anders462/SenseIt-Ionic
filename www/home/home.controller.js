(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.home')
   .controller('HomeController',HomeController);


  HomeController.$inject = ['$scope','$state','authFactory'];

  function HomeController($scope, $state,authFactory){
//
  var vm = this; //set vm (view model) to reference main object
  vm.loggedIn = function(){
    return authFactory.getAuthState();
  }

vm.goToDashboard = function(){
  if (vm.loggedIn()){
    $state.go('app.dashboard');
  }
}
};

})();
