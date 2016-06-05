(function(){

'use strict';

//register page sub module
angular
  .module('SenseIt.register')
   .controller('RegisterController',RegisterController);

  RegisterController.$inject = ['$location','ngDialog','$scope','authFactory'];

  function RegisterController($location,ngDialog,$scope,authFactory){

  var vm = this; //set vm (view model) to reference main object
  vm.registration = '';
  vm.error = false;


//opens up a Register Modal Dialog
  $scope.$on('$stateChangeSuccess',function(){
    console.log("open register")
      ngDialog.open({
         template: 'app/register/register.modal.html',
         className: 'ngdialog-theme-default',
         controller: 'RegisterController',
         controllerAs: 'vm',
         showClose: false,
         closeByNavigation: true,
         closeByEscape: false
      })
  });

  vm.doRegister = function(){
    console.log("creds",vm.registration)
    authFactory.register(vm.registration)
      .then(function(response){
        vm.registration = '';
        ngDialog.close();
        vm.error = false;
        console.log(response);
        $location.path('/login');

      })
      .catch(function(err){
        console.log(err.data.err.message);
        vm.registration = '';
        vm.error = true;
        vm.errorMessage = err.data.err.message;
      })

  }

  vm.closeThisDialog = function(){
    ngDialog.close();
    $location.path('/');
  }

  vm.openLogin = function(){
    ngDialog.close();
    $location.path('/login');
  }

  vm.shouldValidate = function(name){
    var rules = {
      username: false,
      username_len: 0,
      password: false,
      password_len: 0,
      email: false,
      firstname: false,
      lastname: false
    }
    return rules[name];
  }



}


})();
