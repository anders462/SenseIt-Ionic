(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.login')
   .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider){

      $stateProvider.state('app.login', {
      url: '/login',
      views: {
        'mainContent': {
          templateUrl: 'login/login.html',
          controller: 'LoginController as vm'
        }
      }
    })

};





})();
