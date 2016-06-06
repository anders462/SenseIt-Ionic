(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.activate')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

        function configFunction($stateProvider){

          $stateProvider.state('app.activate', {
          url: '/activate',
          views: {
            'mainContent': {
              templateUrl: 'dashboard/dashboard.html',
              controller: 'ActivateController as vm'
            }
          },
          data : {authenticate: true
             }
        });


      };




})();
