(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.home')
   .controller('HomeController',HomeController);

    HomeController.$inject = [];

      function HomeController(){}


//   HomeController.$inject = ['$location','ngDialog',"$scope"];
//
//   function HomeController($location,ngDialog,$scope){
//
//   var vm = this; //set vm (view model) to reference main object
//   var loggedIn = false; //Check if activated as well??
//
//
//   vm.getStarted = function(){
//     if (!loggedIn ){
//       console.log("not loggedIn");
//       $location.path('/register')
//
//     } else {
//       console.log("redirect to dashboard")
//     }
// }
// vm.openModal = function(){
//   console.log("open modal")
//   ngDialog.open({
//      template: 'app/login/login.modal.html',
//      className: 'ngdialog-theme-default',
//      controller: 'LoginController',
//      controllerAs: 'vm',
//      showClose: false,
//      closeByNavigation: true,
//      closeByEscape: false
//   })
//
// }
//
//
// }

})();
