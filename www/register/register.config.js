(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.register')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider){

    $stateProvider.state('app.register', {
    url: '/register',
    views: {
      'mainContent': {
        templateUrl: 'register/register.html',
        controller: 'RegisterController as vm'
      }
    }
  })

};



})();
