(function(){

'use strict';

//auth sub module route config
angular
  .module('SenseIt.auth')
   .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider){

      $stateProvider.state('app.auth', {
      url: '/auth',
      views: {
        'mainContent': {
          templateUrl: 'home/home.html',
          controller: 'AuthController as vm'
        }
      },
      data : {authenticate: false
         }
    })

};


})();
