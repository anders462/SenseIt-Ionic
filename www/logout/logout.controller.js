(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.logout')
   .controller('LogoutController',LogoutController);

  LogoutController.$inject = ['$location','ngDialog','$scope','authFactory'];

  function LogoutController($location,ngDialog,$scope, authFactory){

  var vm = this; //set vm (view model) to reference main object

  //opens up a Login Modal Dialog
    $scope.$on('$stateChangeSuccess',function(){
      console.log("open logout")
        ngDialog.open({
           template: 'app/logout/logout.modal.html',
           className: 'ngdialog-theme-default',
           controller: 'LogoutController',
           controllerAs: 'vm',
           showClose: false,
           closeByNavigation: true,
           closeByEscape: false
        })
    });



    vm.closeThisDialog = function(){
      ngDialog.close();
      $location.path('/dashboard');
    }

    vm.doLogout = function(){
      authFactory.deleteToken();
      authFactory.cacheAuthState(false);
      ngDialog.close();
    }


  }

})();
